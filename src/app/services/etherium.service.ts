import { Injectable } from '@angular/core';
import Web3 from "web3";
import { HttpClient } from '@angular/common/http';
import { DataService } from './data.service';

declare let window: any;
@Injectable({
  providedIn: 'root'
})

export class EtheriumService {

  contractAddress = "0x69DaB36483811Ed39a9545ac709D20e441302808";
  ABIObj: any;
  contract: any;
  weiConverter: any;
  etherConverter: any;

  constructor(private httpClient: HttpClient, private dataService: DataService) {
    this.execute()
  }

  execute() {
    this.httpClient.get("assets/Blocketplace.json").subscribe((data: any) => {
      if (window.web3) {
        const web3 = new Web3(window.web3.currentProvider)
        this.weiConverter = web3.utils.toWei
        this.etherConverter = web3.utils.fromWei
        this.contract = new web3.eth.Contract(data.abi, this.contractAddress)
        window.ethereum.enable();
      } else if (window.ethereum) {
        const web3 = new Web3(window.etherium)
        this.contract = new web3.eth.Contract(data.abi, this.contractAddress)
        window.ethereum.enable();
      } else {
        console.log("Install Metamask")
        throw new Error("Install MetaMak")
      }
    })
  }

  async connectMetaMask() {
    let ethereum = window?.ethereum;
    if (typeof window?.ethereum !== "undefined") {
      try {
        await ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await ethereum.request({ method: "eth_accounts" });
        window.ethereum.on('accountsChanged', (accounts: any) => {
          console.log("hi")
          this.dataService.logout()
        });
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
    return this.etherConverter(amount, "ether")
  }


  registerAsSeller(address: string, amount: string) {
    return this.contract.methods.registerUserAsSeller(address).send(
      {
        from: address,
        value: this.weiConverter(amount, "ether"),
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

  buyProduct(sellerAddress: string, id: string, productId: string, productName: string, price: string, paymentStatus: string, buyerAddress: string) {
    return this.contract.methods.payForOrder(sellerAddress, id, productId, productName, price, paymentStatus).send({
      from: buyerAddress,
      value: this.weiConverter(price, "ether"),
      gas: 3000000
    })
  }

  buyProductPartial(sellerAddress: string, id: string, productId: string, productName: string, price: string, paymentStatus: string, buyerAddress: string, partial_amt: string) {
    return this.contract.methods.payForOrder(sellerAddress, id, productId, productName, price, paymentStatus).send({
      from: buyerAddress,
      value: this.weiConverter(partial_amt, "ether"),
      gas: 3000000
    })
  }

  refund(buyerAddress: string, orderid: string, sellerAddress: string, partial_amount: string) {
    return this.contract.methods.refund(buyerAddress, orderid).send({
      from: sellerAddress,
      value: this.weiConverter(partial_amount, "ether"),
      gas: 3000000
    })
  }

  async handleWithdraw(address: string) {
    if (this.contract) {
      try {
        return await this.contract.methods.withdrawBalance().send({
          from: address
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
        from: address
      });
      console.log("Handle Registration")
      console.log(receipt)
    }
  }

}