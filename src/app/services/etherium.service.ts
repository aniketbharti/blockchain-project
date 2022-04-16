import { Injectable } from '@angular/core';
import Web3 from "web3";
import { HttpClient } from '@angular/common/http';

declare let window: any;
@Injectable({
  providedIn: 'root'
})

export class EtheriumService {

  contractAddress = "0xA2fE66a7D4e38A87665c928c5CE320aC9CE151Fe";
  ABIObj: any;
  contract: any;
  selectedAccount: any;

  constructor(private httpClient: HttpClient) {
    this.execute()
  }

  execute() {
    this.httpClient.get("assets/Blocketplace.json").subscribe((data: any) => {
      if (window.web3) {
        const web3 = new Web3(window.web3.currentProvider)
        this.contract = new web3.eth.Contract(data.abi, this.contractAddress)
      } else if (window.ethereum) {
        const web3 = new Web3(window.etherium)
        this.contract = new web3.eth.Contract(data.abi, this.contractAddress)
      }
      else {
        console.log("Install Metamask")
        throw new Error("Install MetaMak")
      }
    })
  }

  async connectMetaMask() {
    let provider = window.ethereum;
    if (typeof provider !== 'undefined') {
      try {
        const accounts = await provider.request({ method: 'eth_requestAccounts' })
        this.selectedAccount = accounts[0];
        return accounts
      } catch (err) {
        console.log(err)
      }
      window.ethereum.on('accountsChanged', (accounts: any) => {
        this.selectedAccount = accounts[0];
        console.log(`Selected account changed to ${this.selectedAccount}`);
      });
    }
  }


  registerAsSeller(address: string) {
    if (this.contract) {
      return this.contract.method.registerUser(address).call()
    }
    return null
  }

  registerUser(address: string) {
    const data = {
      from: this.selectedAccount
    }
    return this.contract.methods.registerUser(address).send(
      data
    )
  }
}
