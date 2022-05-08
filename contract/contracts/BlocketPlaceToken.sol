//SPDX-License-Identifier: MIT

pragma solidity >=0.6.12 < 0.9.0;
import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BlocketPlaceToken is ERC20 {
    address owner;
    constructor () ERC20("Blocketplace", "BKT") {
        owner = msg.sender;
        _mint(msg.sender, 10000 * 10 ** 18);
        approve(address(this), 10000 * 10 ** 18);
    }

    modifier onlyOwnerMint() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    // 100000000000000000
    // 101000000000000000000
    // 100000000000000000000
    // 1000000000000000000000
    //0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
    //0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2
    //0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db
    //10000000000000000000000
    //2000000000000000000000
    //9000000000000000000000
    //0x7b96aF9Bd211cBf6BA5b0dd53aa61Dc5806b6AcE
    //0x2067b56DaBd9a666E7216b8b5d00BfE511fb6464
    // Ganache
    // 0xCcA802BC2a6B7718a1349aF57303a024b98D5E1E
    // 0x497D63614b921339C503E82d1B155a0E8d897Dda
    // 0xA67ebfd8118ca30143AA4106b6Ecfde3D9f8E01E
    // 0xDcA23697b89c762b66Ce8645B50a4B86B38508d2
    // 0xC7260e2150569F6Ac522BE5708C7446F9Fd3a748

    // 100000000000000000000

    function mint(address to, uint amount) onlyOwnerMint public {
        _mint(to, amount);
    }

    function balanceOfSC() onlyOwnerMint public view returns(uint256) {
        return balanceOf(address(this));
    } 

    function balanceOfAddr() onlyOwnerMint public view returns(uint256) {
        return balanceOf(msg.sender);
    } 
}