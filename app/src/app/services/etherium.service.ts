import { Injectable } from '@angular/core';
import Web3 from "web3";
import { DataService } from './data.service';
import blocketplace from "../../assets/Blocketplace.json";
import token from "../../assets/BlocketPlaceToken.json";
import { environment } from 'src/environments/environment';

declare let window: any;
@Injectable({
  providedIn: 'root'
})

export class EtheriumService {

  marketPlaceAddress = environment.marketPlace;
  tokenAddress = environment.token;
  deployer = environment.deployer;
  ABIObj: any;
  contract: any;
  weiConverter: any;
  etherConverter: any;
  token: any;

  constructor(private dataService: DataService) {
    this.execute()
  }

  execute() {

    if (window.web3) {
      const web3 = new Web3(window.web3.currentProvider)
      this.weiConverter = web3.utils.toWei
      this.etherConverter = web3.utils.fromWei
      this.contract = new web3.eth.Contract(blocketplace.abi as any, this.marketPlaceAddress)
      this.token = new web3.eth.Contract(token.abi as any, this.tokenAddress)
      window.ethereum.enable();
    } else if (window.ethereum) {
      const web3 = new Web3(window.etherium)
      this.contract = new web3.eth.Contract(blocketplace.abi as any, this.marketPlaceAddress)
      this.token = new web3.eth.Contract(token.abi as any, this.tokenAddress)
      window.ethereum.enable();
    } else {
      console.log("Install Metamask")
      throw new Error("Install MetaMak")
    }
  }

  async connectMetaMask() {
    let ethereum = window?.ethereum;
    const amt = 100
    if (typeof window?.ethereum !== "undefined") {
      try {
        await ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await ethereum.request({ method: "eth_accounts" });
        window.ethereum.on('accountsChanged', (accounts: any) => {
          this.dataService.logout()
        });
        // if ((accounts[0]).toString().toLowerCase() == (this.deployer).toString().toLowerCase()) {
        //   this.approve(accounts[0], amt.toString())
        // }
        return accounts;
      } catch (error) {
        console.error("Install MetaMask")
        throw new Error("Install MetaMak")
      }
    } else {
      console.error("Install MetaMask")
      throw new Error("Install MetaMak")
    }
  }

  convert_to_ether(amount: string) {
    return this.etherConverter(amount)
  }


  registerAsSeller(address: string, amount: string) {
    return this.contract.methods.registerUserAsSeller(address, this.weiConverter(amount, "ether")).send(
      {
        from: address,
        gas: 3000000,
      }
    );
  }


  registerUser(address: string) {
    return this.contract.methods.registerUser(address).send({
      from: address,
      gas: 3000000,
    });
  }

  buyProduct(sellerAddress: string, id: string, productId: string, productName: string, price: string, paymentStatus: string, buyerAddress: string,) {
    return this.contract.methods.payForOrder(sellerAddress, id, productId, productName, this.weiConverter(price, "ether"), paymentStatus, this.weiConverter(price, "ether")).send({
      from: buyerAddress,
      gas: 3000000
    })
  }

  buyProductPartial(sellerAddress: string, id: string, productId: string, productName: string, price: string, paymentStatus: string, buyerAddress: string, partial_amt: string) {
    return this.contract.methods.payForOrder(sellerAddress, id, productId, productName,  this.weiConverter(price, "ether"), paymentStatus, this.weiConverter(partial_amt, "ether")).send({
      from: buyerAddress,
      gas: 3000000
    })
  }

  refund(buyerAddress: string, orderid: string, sellerAddress: string, partial_amount: string) {
    return this.contract.methods.refund(buyerAddress, orderid).send({
      from: sellerAddress,
      gas: 3000000
    })
  }


  buy(address: string, amount: string) {
    return this.contract.methods.buy().send({
      from: address,
      value: this.weiConverter(amount, "ether"),
      gas: 3000000
    })
  }

  async handleWithdraw(address: string) {
    if (this.contract) {
      try {
        return await this.contract.methods.withdrawBalance().send({
          from: address,
          gas: 3000000
        });
      } catch (err) {
        console.log("Error Message", err)
      }
    }
  }

  async getSellerBalance(address: string) {
    if (this.contract) {
      return await this.contract.methods.getSellerBalance().call({
        from: address
      })
    }
  }

  async getOrderStatus(address: string, orderId: string) {
    if (this.contract) {
      const receipt = await this.contract.methods.getOrderStatus(orderId).send({
        from: address,
        gas: 3000000
      });
      console.log("Handle Registration")
      console.log(receipt)
    }
  }

  async approve(address: string, approvalamount: string) {
    return this.token.methods.approve(this.marketPlaceAddress, this.weiConverter(approvalamount, 'ether') ).send({
      from: address
    })
  }


  async checkAllowance(address: string) {
    return this.contract.methods.getAllowance(address, this.marketPlaceAddress).call({
      from: address
    })
  }

  getTokenBalance(address: string) {
    return this.contract.methods.getBalance(address).call({
      from: address
    })
  }

  airdropAmount(address1: string, amount: string, ownaddress: String) {
    return this.token.methods.transfer(address1, this.weiConverter(amount, "ether")).send({
      from: ownaddress,
      gas: 3000000
    });
  }
}