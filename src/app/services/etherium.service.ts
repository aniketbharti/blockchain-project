import { Injectable } from '@angular/core';
import Web3 from "web3";
import { HttpClient } from '@angular/common/http';

declare let window: any;
@Injectable({
  providedIn: 'root'
})

export class EtheriumService {

  contractAddress = "0xA93849d3Ec7F8E628be0e67b298d026758cb1e8a";
  ABIObj: any;
  contract: any;

  constructor(private httpClient: HttpClient) {
    this.execute()
  }

  execute() {
    this.httpClient.get("assets/Blocketplace.json").subscribe((data: any) => {
      if (window.ethereum) {
        const web3 = new Web3(window.etherium)
        debugger;
        this.contract = new web3.eth.Contract(data.abi, this.contractAddress)
      } else if (window.web3) {
        const web3 = new Web3(window.web3.currentProvider)
        this.contract = new web3.eth.Contract(data.abi, this.contractAddress)
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


  registerAsSeller(address: string) {
    if (this.contract) {
      return this.contract.method.registerUser(address).call()
    }
    return null
  }
  async registerUser(address: string) {
    if (this.contract) {
      debugger
      this.contract.method.registerUser(address, {
        from: address,
      }).call()
    }
  }
}
