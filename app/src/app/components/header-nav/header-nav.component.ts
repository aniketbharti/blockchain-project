import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { DataService } from 'src/app/services/data.service';
import { EtheriumService } from 'src/app/services/etherium.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { BuyTokenComponent } from '../buy-token/buy-token.component';
import { MessageModalComponent } from '../modal/message.modal.component';
import { RegisterModalComponent } from '../register-modal/register-modal.component';
import { SellerBalanceModalComponent } from '../seller-balance-modal/seller-balance.modal.component';

@Component({
  selector: 'app-header-nav',
  templateUrl: './header-nav.component.html',
  styleUrls: ['./header-nav.component.scss']
})
export class HeaderNavComponent implements OnInit {

  isLogin: boolean = false;
  toggleCollapseNavBar = false;
  userData: any;
  approvalAmount = 10000;

  constructor(private snackBar: MatSnackBar, private etheriumService: EtheriumService, private dataService: DataService, private firebaseService: FirebaseService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.etheriumService.connectMetaMask()
    this.dataService.getUserData().subscribe((res: any) => {
      this.isLogin = false
      this.userData = null
      if (res) {
        this.userData = res
        this.isLogin = true
      }
    })
  }

  logout() {
    this.dataService.logout()
  }

  async seller_balance() {
    const etherdata = await this.etheriumService.connectMetaMask();
    this.etheriumService.getSellerBalance(etherdata[0]).then((res: any) => {
      if (res !== undefined) {
        const dialogRef = this.dialog.open(SellerBalanceModalComponent, {
          data: { seller_balance: this.etheriumService.convert_to_ether(res) },
          width: '400px',
          height: '300px',
        });

        dialogRef.afterClosed().subscribe(async (result) => {
          if (result?.event == "seller_balance") {
            this.etheriumService.handleWithdraw(etherdata[0]).then((res: any) => {
              if (res !== undefined) {
                this.snackBarMessage("Successfully Withdrawn Balance", "Ok")
              } else {
                alert("Error while Withdrawing")
              }
            });
          }
        });
      }
    });
  }

  async login() {
    const etherdata = await this.etheriumService.connectMetaMask();
    console.log(etherdata[0])
    const docSnap = this.firebaseService.checkUserExists(etherdata[0])
    docSnap.subscribe(res => {
      const data = res.docs.map((docs: any) => {
        return { id: docs.id, ...docs.data() }
      })
      console.log(data)
      if (data.length == 0) {
        const dialogRef = this.dialog.open(RegisterModalComponent, {
          data: { account: etherdata[0] },
          width: '600px',
          height: '540px',
        });
        dialogRef.afterClosed().subscribe(async (result) => {
          if (result?.event == "register") {
            this.etheriumService.registerUser(etherdata[0]).then((res: any) => {
              if (res !== undefined) {
                this.etheriumService.approve(etherdata[0], this.approvalAmount).then((res) => {
                  this.firebaseService.registerNewUser(result.data).subscribe((res: any) => {
                    this.firebaseService.checkUserExists(etherdata[0]).subscribe((res) => {
                      this.userData = res.docs.map((docs: any) => {
                        return { id: docs.id, ...docs.data() }
                      })
                      this.dataService.setUserData(this.userData)
                    })
                  }, (err: any) => {
                    console.log(err)
                  })
                }).catch((err: any) => {
                  alert("Error while Approving ...")
                })
              }
            }).catch((err: any) => {
              alert("Error while Registering ...")
            })
          }
        });
      }
      else {
        this.dataService.setUserData(data)
      }
    })
  }

  registerAsSeller() {
    this.dialog.open(MessageModalComponent, {
      data: {
        message: ['Are You Sure?', 'In order to register as seller you need 0.5 Ether'],
        button: ["Ok", "Cancel"]
      }
    }).afterClosed().subscribe((res) => {
      if (res == "Ok") {
        this.etheriumService.registerAsSeller(this.userData[0].user_wallet, "0.5").then((res1: any) => {
          if (res !== undefined) {
            console.log(res1)
            this.firebaseService.checkUserExists(this.userData[0].user_wallet).subscribe((res) => {
              const results = res.docs.map((docs: any) => {
                return { id: docs.id, ...docs.data() }
              })[0]
              results.isSeller = true
              this.firebaseService.updateUserData(results.id, results).subscribe((res) => {
                this.dataService.setUserData([results])
                this.snackBarMessage("Successfully Register as Seller", "Ok")
              })
            })
          } else {
            alert("Error while Registering as Seller ...")
          }
        })
      }
    })
  }

  snackBarMessage(message: string, action = '', config?: MatSnackBarConfig) {
    return this.snackBar.open(message, action, config);
  }


  buyToken() {
    this.dialog.open(BuyTokenComponent, { width: '550px', height: '350px' }).afterClosed().subscribe((res) => {
      if (res.event == "buy") {
        this.etheriumService.buy(this.userData[0].user_wallet, res.amount).then((res: any) => {
          this.snackBarMessage("Token Bought Successfully")
        })
        console.log(res)
      }
    })
  }

}
