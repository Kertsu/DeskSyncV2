import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { useAnimation, transition, trigger } from '@angular/animations';
import { tada } from 'ng-animate';
import confetti from 'canvas-confetti';
import { UiService } from '../../services/ui.service';
import { WebService } from '../../services/web.service';
import { MessageService as LayoutMessageService } from '../../utils/message.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [MessageService],
  animations: [trigger('tada', [transition('* => *', useAnimation(tada))])],
})
export class ProfileComponent implements OnInit {
  informationForm!: FormGroup;
  checked = new FormControl();
  visible: boolean = false;
  uploadPopupShown: boolean = false;
  changePasswordForm!: FormGroup;
  messageShown: boolean = false;
  originalFormValue: any;
  avatarSource: string = this.userService.getUser()?.avatar;
  bannerSource: string = this.userService.getUser()?.banner;
  bounceState: any;
  successShown: boolean = false;

  constructor(
    protected userService: UserService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private uiService: UiService,
    private webService: WebService,
    private layoutMessageService: LayoutMessageService
  ) {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{15,}$'
          ),
        ],
      ],
      confirmPassword: ['', Validators.required],
    });
    this.informationForm = this.fb.group({
      username: '',
      description: '',
    });
  }

  ngOnInit() {
    this.patchUser();
    this.setOriginalFormValue();

    this.informationForm.valueChanges.subscribe(() => {
      this.checkForChanges();
    });
  }

  checkForChanges() {
    const formChanged = this.isFormChanged();
    const avatarChanged =
      this.avatarSource !== this.userService.getUser()?.avatar;
    const bannerChanged =
      this.bannerSource !== this.userService.getUser()?.banner;

    if (!this.messageShown && (formChanged || avatarChanged || bannerChanged)) {
      this.showAlert();
    }
  }

  showChangePasswordDialog() {
    this.visible = true;
  }

  patchUser() {
    const user = this.userService.getUser();
    this.informationForm.patchValue({
      username: user.username,
      description: user.description,
    });
  }

  reset() {
    this.patchUser();
    this.setOriginalFormValue();
    this.avatarSource = this.userService.getUser()?.avatar;
    this.bannerSource = this.userService.getUser()?.banner;
    this.messageShown = false;
    this.uiService.setMessageShown(this.messageShown);
  }

  showAlert() {
    this.messageShown = true;
    this.uiService.setMessageShown(this.messageShown);
    this.messageService.add({
      key: 'bc',
      severity: 'custom',
      detail: 'Heads up — you have unsaved changes!',
      sticky: true,
    });
  }

  close() {
    this.reset();
  }

  isFormChanged() {
    return (
      JSON.stringify(this.informationForm.value) !==
      JSON.stringify(this.originalFormValue)
    );
  }

  setOriginalFormValue() {
    this.originalFormValue = this.informationForm.value;
  }

  // onUpload(event: any){
  //   console.log(event)
  // }

  removeAvatar() {
    this.avatarSource =
      'http://res.cloudinary.com/drlztlr1m/image/upload/v1706979188/oxbsppubd3rsabqwfxsr.jpg';
    this.checkForChanges();
  }

  removeBanner() {
    this.bannerSource =
      'https://res.cloudinary.com/drlztlr1m/image/upload/v1708332794/memuvo7apu0eqdt4f6mr.svg';
    this.checkForChanges();
  }

  showUpload() {
    this.uploadPopupShown = true;
  }

  changePassword() {
    const data = {
      currentPassword: this.changePasswordForm.value.currentPassword,
      newPassword: this.changePasswordForm.value.newPassword,
      confirmPassword: this.changePasswordForm.value.confirmPassword,
    };

    this.webService.changePassword(data).subscribe({
      next: (res: any) => {
        console.log(res);
        this.layoutMessageService.addMessage(
          'success',
          res.message,
          'Success',
          3000
        );
      },
      error: (error) => {
        this.layoutMessageService.addMessage(
          'error',
          error.error.error,
          'Error',
          3000
        );
        this.visible = false;
      },
      complete: () => {
        this.visible = false;
        this.successShown = true;
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      },
    });
    // this.webService.changePassword
  }
}
