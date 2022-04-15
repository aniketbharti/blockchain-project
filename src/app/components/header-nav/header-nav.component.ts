import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { EtheriumService } from 'src/app/services/etherium.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { RegisterModalComponent } from '../register-modal/register-modal.component';

@Component({
  selector: 'app-header-nav',
  templateUrl: './header-nav.component.html',
  styleUrls: ['./header-nav.component.scss']
})
export class HeaderNavComponent implements OnInit {

  isLogin: boolean = false;
  toggleCollapseNavBar = false;

  constructor(private dataService: DataService, private etheriumService: EtheriumService, private firebaseService: FirebaseService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.dataService.getUserData().subscribe((res: any) => {
      if (res) {
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
      console.log(data)
      if (data.length == 0) {
        const dialogRef = this.dialog.open(RegisterModalComponent, {
          data: { account: etherdata[0] },
          width: '600px',
          height: '500px',
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result?.event == "register") {
            this.firebaseService.registerNewUser(result.data).subscribe((res: any) => {
              console.log(res)
            }, (err: any) => {
              console.log(err)
            })
          }
        });
      }
      else {
        this.dataService.setUserData(data)
      }
    })
  }
}
