//SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.9.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Blocketplace {
    enum PaymentStatus {
        PARTIAL,
        DONE,
        REFUNDED,
        WITHDRAW
    }

    struct Order {
        string product_id;
        string name;
        uint256 price;
        uint256 amountPaid;
        address payable seller;
        address payable buyer;
        PaymentStatus paymentStatus;
    }

    struct Account {
        bool isSeller;
        uint256 bankGuarantee;
        string name;
        uint256 balance;
    }

    mapping(address => bool) members;
    mapping(address => Account) accounts;
    mapping(string => Order) ordersPlaced;

    address payable deployer;
    uint256 balance;
    address blocketPlaceAddr;

    IERC20 public bkt;

    constructor(address bktAddress) payable {
        deployer = payable(msg.sender);
        bkt = IERC20(bktAddress);
        blocketPlaceAddr = bktAddress;
    }

    modifier onlyOwner() {
        require(msg.sender == deployer, "Not the owner");
        _;
    }

    modifier userNotRegistered(address addr) {
        require(!members[addr], "User is already registered");
        _;
    }

    modifier isSeller(address sellerAddr) {
        require(accounts[sellerAddr].isSeller, "Not a Seller");
        _;
    }

    event BoughtTokens(uint256 amount);
    event PaymentDone(address payer, uint256 amount, PaymentStatus paymentStatus);
    event PaymentDone(address payer, uint256 amount, string orderId, PaymentStatus paymentStatus);

    function registerUser(address addr) public userNotRegistered(addr) {
        members[addr] = true;
        accounts[addr].balance = 0;
    }

    function registerUserAsSeller(string memory memberName) public payable {
        require(members[msg.sender], "User not registered");
        require(
            msg.value >= 0.001 ether,
            "Deposit money should be atleast 0.1 Ether"
        );

        address senderAddress = msg.sender;
        accounts[senderAddress].isSeller = true;
        accounts[senderAddress].name = memberName;
        accounts[senderAddress].bankGuarantee = msg.value;
        bkt.transferFrom(msg.sender, deployer, msg.value);
    }

    function isUserSeller() public view returns (bool) {
        return accounts[msg.sender].isSeller;
    }

    function getSellerBalance() public view isSeller(msg.sender) returns (uint256) {
        return accounts[msg.sender].balance;
    }

    function getSomethingBalance() public view returns (uint256) {
        return bkt.balanceOf(msg.sender);
    }

    function getOrderStatus(string memory orderId) public view returns (PaymentStatus) {
        return ordersPlaced[orderId].paymentStatus;
    } 

    function buy() payable public {
        uint256 amountToBuy = msg.value;
        uint256 bktBalance = bkt.balanceOf(deployer);
        require(amountToBuy > 0, "Send some ether");
        require(amountToBuy <= bktBalance, "Not enough tokens");
        bkt.transferFrom(deployer, msg.sender, amountToBuy);
        emit BoughtTokens(amountToBuy);
    }

    function withdrawBalance() public payable isSeller(msg.sender) {
        uint256 bal = accounts[msg.sender].balance;
        require(bal > 0, "Balance must be greater than zero");

        bkt.transferFrom(deployer, msg.sender, bal);

        accounts[msg.sender].balance = 0;
        emit PaymentDone(msg.sender, bal, PaymentStatus.WITHDRAW);
    }

    function unregisterUser(address payable userAddress) public payable onlyOwner {
        require(members[userAddress], "User not registered");

        members[userAddress] = false;

        uint256 bankG = accounts[userAddress].bankGuarantee;
        uint256 bal = accounts[userAddress].balance;

        uint256 amountToBePaid = bankG + bal;

        bkt.transfer(userAddress, amountToBePaid);

        accounts[userAddress].isSeller = false;
        accounts[userAddress].bankGuarantee = 0;
        accounts[userAddress].balance = 0;

        emit PaymentDone(userAddress, amountToBePaid, PaymentStatus.WITHDRAW);
    }

    function getBalance(address addr) public view returns(uint256) {
        return bkt.balanceOf(addr);
    }

    function getBalanceSC() public view returns(uint256) {
        return bkt.balanceOf(address(this));
    }

    function getAllowance(address addr1, address addr2) public view returns(uint256) {
        return bkt.allowance(addr1, addr2);
    }

    function payForOrder(
        address payable sellerAddr,
        string memory orderId,
        string memory productId,
        string memory productName,
        uint256 productPrice,
        uint256 paymentStatus
    ) public payable isSeller(sellerAddr) {
        if (paymentStatus == 1) {
            payAmountForOrder(
                sellerAddr,
                orderId,
                productId,
                productName,
                productPrice,
                PaymentStatus.PARTIAL
            );
        } else {
            payAmountForOrder(
                sellerAddr,
                orderId,
                productId,
                productName,
                productPrice,
                PaymentStatus.DONE
            );
        }
    }

    function payAmountForOrder(
        address payable sellerAddr,
        string memory orderId,
        string memory productId,
        string memory productName,
        uint256 productPrice,
        PaymentStatus paymentStatus
    ) public payable isSeller(sellerAddr) {
        uint256 allowance = bkt.allowance(msg.sender, address(this));
        uint256 amountPaying = msg.value;

        require(members[msg.sender], "User not registered");
        require(productPrice > 0, "Product Price must be greater than 0");
        require(allowance >= amountPaying, "Allowance must be equal to Amount Paying");
        require(allowance >= productPrice, "Allowance must be equal to Product Price");
        if (paymentStatus == PaymentStatus.DONE) {
            require(amountPaying == productPrice, "Amount must be equal to Product Price");
        }

        uint256 scCut = amountPaying / 10;
        accounts[sellerAddr].balance += scCut * 9;
        balance += scCut;

        //bkt.transferFrom(msg.sender, sellerAddr, scCut * 9);
        bkt.transferFrom(msg.sender, deployer, amountPaying);

        ordersPlaced[orderId].product_id = productId;
        ordersPlaced[orderId].name = productName;
        ordersPlaced[orderId].seller = sellerAddr;
        ordersPlaced[orderId].buyer = payable(msg.sender);
        if (paymentStatus == PaymentStatus.PARTIAL) {
            ordersPlaced[orderId].amountPaid += amountPaying;
        } else {
            ordersPlaced[orderId].amountPaid = amountPaying;
        }
        ordersPlaced[orderId].price = productPrice;

        ordersPlaced[orderId].paymentStatus = paymentStatus;
        if (ordersPlaced[orderId].amountPaid >= productPrice) {
            ordersPlaced[orderId].paymentStatus = PaymentStatus.DONE;
        }

        emit PaymentDone(sellerAddr, ordersPlaced[orderId].amountPaid, orderId, ordersPlaced[orderId].paymentStatus);
    }

    function refund(string memory orderId, address payable buyerAddress) public payable {
        require(msg.sender == ordersPlaced[orderId].seller, "Seller Invalid");
        require(
            ordersPlaced[orderId].amountPaid > 0,
            "Amount Paid should be greater than 0"
        );

        uint256 amount = ordersPlaced[orderId].amountPaid;
        amount = (amount / 10) * 9;
        uint256 amountToSend = amount;
        if (ordersPlaced[orderId].paymentStatus == PaymentStatus.PARTIAL) {
            amountToSend = (amount / 100) * 90;
        }
        
        uint256 allowance = bkt.allowance(msg.sender, address(this));
        require(
            allowance <= amountToSend,
            "Value must be equal to Send to Customer"
        );

        bkt.transferFrom(msg.sender, buyerAddress, amountToSend);

        accounts[msg.sender].balance -= amountToSend;
        ordersPlaced[orderId].paymentStatus = PaymentStatus.REFUNDED;

        emit PaymentDone(buyerAddress, amountToSend, PaymentStatus.REFUNDED);
    }
}
