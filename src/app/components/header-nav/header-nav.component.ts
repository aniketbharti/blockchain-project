import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { DataService } from 'src/app/services/data.service';
import { EtheriumService } from 'src/app/services/etherium.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { MessageModalComponent } from '../modal/message.modal.component';
import { RegisterModalComponent } from '../register-modal/register-modal.component';

@Component({
  selector: 'app-header-nav',
  templateUrl: './header-nav.component.html',
  styleUrls: ['./header-nav.component.scss']
})
export class HeaderNavComponent implements OnInit {

  isLogin: boolean = false;
  toggleCollapseNavBar = false;
  userData: any;

  constructor(private snackBar: MatSnackBar, private etheriumService: EtheriumService, private dataService: DataService, private firebaseService: FirebaseService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.dataService.getUserData().subscribe((res: any) => {
      if (res) {
        this.userData = res
        this.isLogin = true
      }
    })
  }

  async login() {
    const etherdata = await this.etheriumService.connectMetaMask();
    const docSnap = this.firebaseService.checkUserExists(etherdata[0])
    docSnap.subscribe(res => {
      const data = res.docs.map((docs: any) => {
        return { id: docs.id, ...docs.data() }
      })
      if (data.length == 0) {
        const dialogRef = this.dialog.open(RegisterModalComponent, {
          data: { account: etherdata[0] },
          width: '600px',
          height: '540px',
        });
        dialogRef.afterClosed().subscribe(async (result) => {
          if (result?.event == "register") {
            this.etheriumService.registerUser(etherdata[0]).then((res:any) => {
              console.log(res)
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
        message: ['Are You Sure?', 'In order to register as seller you need 100 WEI'],
        button: ["Ok", "Cancel"]
      }
    }).afterClosed().subscribe((res) => {
      if (res == "Ok") {
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
      }
    })
  }

  snackBarMessage(message: string, action = '', config?: MatSnackBarConfig) {
    return this.snackBar.open(message, action, config);
  }

}
