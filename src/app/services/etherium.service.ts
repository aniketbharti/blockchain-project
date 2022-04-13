import { Injectable } from '@angular/core';

declare let window: any;

@Injectable({
  providedIn: 'root'
})

export class EtheriumService {
  constructor() { }

  async connectMetaMask() {
    let ethereum = window?.ethereum;
    if (typeof window?.ethereum !== "undefined") {
      try {
        await window.ethereum.enable();
        // eth_requestAccounts
        const accounts = await ethereum.request({ method: "eth_accounts" });
        return accounts;
      } catch (error) {
        throw new Error("Install MetaMak")
      }
    } else {
      throw new Error("Install MetaMak")
    }
  }



}
