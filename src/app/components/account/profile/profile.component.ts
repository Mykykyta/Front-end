import {Component, OnInit} from '@angular/core';
import {AccountService} from '../../../service/account.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SettingsService} from '../../../service/settings.service';
import {ConfirmDeleteFromFriendsDialog} from "../../user-item/confirm-delete-from-friends-dialog/confirm-delete-from-friends-dialog.component";
import {flatMap} from "rxjs/operators";
import {EMPTY} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {SettingsDialogComponent} from "./settigns-dialog/settings-dialog.component";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile = {userId: null, fullName: null, email: null, createdAt: null, photoPath: ''};
  isLogged: boolean;


  constructor(private activatedRoute: ActivatedRoute,
              private accountService: AccountService,
              private router: Router,
              private settingsService: SettingsService,
              private dialog: MatDialog) {
  }

  private setDefaultAvatar() {
    this.profile.photoPath = '../../../assets/images/default_avatar.jpg';
  }

  ngOnInit() {
    this.initIsLoggedProperty();
    this.setDefaultAvatar();
    const userIdStr = this.activatedRoute.snapshot.paramMap.get('userId');
    let userId;
    if (isNaN(+userIdStr)) {
      userId = this.accountService.getCurrentUser().userId;
    } else {
      userId = Number(userIdStr);
    }
    this.accountService.getUserById(userId)
      .subscribe(
        user => {
          this.profile = user;
          if (!this.profile.photoPath) {
            this.setDefaultAvatar();
          }
        },
        error => {
          console.log('Error');
          console.log(error);
          console.log('Error message');
          console.log(error.message);
          console.log('Error object');
          console.error(error.error);
          // handle error
          this.router.navigate(['']);
        }
      );
  }

  edit() {
    console.log('edit button clicked');
  }

  canEdit() {
    const currentUser = this.accountService.getCurrentUser();
    return currentUser && this.profile.userId === currentUser.userId;
  }

  canChat() {
    const currentUser = this.accountService.getCurrentUser();
    return currentUser && this.profile.userId === currentUser.userId;
  }

  initIsLoggedProperty(): void {
    this.isLogged = this.accountService.getCurrentUser() != null;
  }

  openSettings() {
    this.dialog.open(SettingsDialogComponent, {
      width: '400px',
      height: '370px'
    });
  }
}
