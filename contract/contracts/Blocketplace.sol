//SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.9.0;

contract Blocketplace {
    enum PaymentStatus {
        PARTIAL,
        DONE,
        REFUNDED
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

    address owner;
    uint256 balance;

    constructor() public payable {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
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

    function registerUser(address addr) public userNotRegistered(addr) {
        members[addr] = true;
        accounts[addr].balance = 0;
    }

    function registerUserAsSeller(string memory memberName) public payable {
        require(members[msg.sender], "User not registered");
        require(
            msg.value >= 0.1 ether,
            "Deposit money should be atleast 0.1 Ether"
        );

        address senderAddress = msg.sender;
        accounts[senderAddress].isSeller = true;
        accounts[senderAddress].name = memberName;
        accounts[senderAddress].bankGuarantee = msg.value;
    }

    function isUserSeller() public view returns (bool) {
        return accounts[msg.sender].isSeller;
    }

    function getSellerBalance()
        public
        view
        isSeller(msg.sender)
        returns (uint256)
    {
        return accounts[msg.sender].balance;
    }

    function getOrderStatus(string memory orderId)
        public
        view
        returns (PaymentStatus)
    {
        return ordersPlaced[orderId].paymentStatus;
    }

    function withdrawBalance() public payable isSeller(msg.sender) {
        uint256 bal = accounts[msg.sender].balance;
        require(bal > 0, "Balance must be greater than zero");
        msg.sender.transfer(bal);
        accounts[msg.sender].balance = 0;
    }

    function unregisterUser(address payable userAddress)
        public
        payable
        onlyOwner
    {
        require(members[userAddress], "User not registered");

        members[userAddress] = false;

        uint256 bankG = accounts[userAddress].bankGuarantee;
        uint256 bal = accounts[userAddress].balance;
        userAddress.transfer(bankG + bal);

        accounts[userAddress].isSeller = false;
        accounts[userAddress].bankGuarantee = 0;
        accounts[userAddress].balance = 0;
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
        uint256 amount = msg.value;

        require(members[msg.sender], "User not registered");
        require(productPrice > 0, "Product Price must be greater than 0");
        if (paymentStatus == PaymentStatus.DONE) {
            require(
                productPrice == amount,
                "Value must be equal to Product Price"
            );
        }

        uint256 scCut = amount / 10;
        accounts[sellerAddr].balance += scCut * 9;
        balance += scCut;
        //sellerAddr.transfer(scCut * 9);
        // accounts[msg.sender].balance -= amount;

        ordersPlaced[orderId].product_id = productId;
        ordersPlaced[orderId].name = productName;
        ordersPlaced[orderId].seller = sellerAddr;
        ordersPlaced[orderId].buyer = payable(msg.sender);
        if (paymentStatus == PaymentStatus.PARTIAL) {
            ordersPlaced[orderId].amountPaid += amount;
        } else {
            ordersPlaced[orderId].amountPaid = amount;
        }
        ordersPlaced[orderId].price = productPrice;

        ordersPlaced[orderId].paymentStatus = paymentStatus;
        if (ordersPlaced[orderId].amountPaid >= productPrice) {
            ordersPlaced[orderId].paymentStatus = PaymentStatus.DONE;
        }
    }

    function refund(string memory orderId, address payable buyerAddress)
        public
        payable
    {
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

        require(
            msg.value == amountToSend,
            "Value must be equal to Send to Customer"
        );

        buyerAddress.transfer(amountToSend);
        accounts[msg.sender].balance -= amountToSend;

        ordersPlaced[orderId].paymentStatus = PaymentStatus.REFUNDED;
    }
}
