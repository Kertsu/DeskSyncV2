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
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [MessageService, ConfirmationService],
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
  moreInfoShown: boolean = false;

  selectedAvatarUrl: string | ArrayBuffer | null = null;
  selectedAvatarImage!: File | undefined;
  selectedBannerUrl: string | ArrayBuffer | null = null;
  selectedBannerImage!: File | undefined;

  oldValue!: boolean;

  isProcessing: boolean = false;

  constructor(
    protected userService: UserService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private uiService: UiService,
    private webService: WebService,
    private layoutMessageService: LayoutMessageService,
    private confirmationService: ConfirmationService
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

    this.oldValue = this.userService.getUser()?.receivingEmail;

    this.checked.setValue(this.oldValue, { emitEvent: false });

    this.checked.valueChanges.subscribe({
      next: (newValue) => {
        if (newValue !== null) {
          this.confirmChange(this.oldValue, newValue);
        }
      },
      error: (error) => {
      },
    });

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

  removeAvatar() {
    this.avatarSource =
      'https://res.cloudinary.com/drlztlr1m/image/upload/v1706979188/oxbsppubd3rsabqwfxsr.jpg';
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

    this.isProcessing = true
    this.webService.changePassword(data).subscribe({
      next: (res: any) => {
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
        // this.visible = false;
        this.isProcessing = false
      },
      complete: () => {
        this.visible = false;
        this.successShown = true;
        this.isProcessing = false
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      },
    });
    // this.webService.changePassword
  }

  saveChanges() {
    const formData = new FormData();

    if (this.informationForm.value.username)
      formData.append('username', this.informationForm.value.username);
    if (this.informationForm.value.description)
      formData.append('description', this.informationForm.value.description);
    if (this.selectedBannerImage)
      formData.append('banner', this.selectedBannerImage);
    if (this.selectedAvatarImage)
      formData.append('avatar', this.selectedAvatarImage);

    if (
      this.bannerSource ==
      'https://res.cloudinary.com/drlztlr1m/image/upload/v1708332794/memuvo7apu0eqdt4f6mr.svg'
    ) {
      formData.append('defaultBanner', this.bannerSource);
      formData.delete('banner');
    }

    if (
      this.avatarSource ==
      'https://res.cloudinary.com/drlztlr1m/image/upload/v1706979188/oxbsppubd3rsabqwfxsr.jpg'
    ) {
      formData.append('defaultAvatar', this.avatarSource);
      formData.delete('avatar');
    }

    this.isProcessing = true
    this.webService.updateProfile(formData).subscribe({
      next: (res: any) => {
        this.userService.setUser(res.user);
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
        this.isProcessing = false
      },
      complete: () => {
        this.messageShown = false;
        this.uiService.setMessageShown(this.messageShown);
        this.messageService.clear('bc');
        this.isProcessing = false
        this.selectedAvatarImage = undefined;
        this.selectedBannerImage = undefined;
      },
    });
  }

  onFileSelected(event: any, model: string) {
    const file: File = event.target.files[0];
    if (file) {
      switch (model) {
        case 'avatar':
          this.selectedAvatarUrl = URL.createObjectURL(file);
          this.selectedAvatarImage = file;
          this.avatarSource = this.selectedAvatarUrl;
          break;
        case 'banner':
          this.selectedBannerUrl = URL.createObjectURL(file);
          this.selectedBannerImage = file;
          this.bannerSource = this.selectedBannerUrl;
          break;
        default:
          break;
      }
    }
    this.checkForChanges();
  }

  confirmChange(oldValue: boolean, newValue: boolean) {
    this.confirmationService.confirm({
      message: `Are you sure you want to turn this ${newValue ? 'on' : 'off'}?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.checked.setValue(newValue);
        this.oldValue = newValue;
        this.webService.updateNotificationPreference(newValue).subscribe({
          next: (res: any) => {
            const value = res.user.receivingEmail;
            if (value !== null) {
              this.layoutMessageService.addMessage(
                'success',
                `You have turned ${value ? 'on' : 'off'} the feature`,
                'Success',
                3000
              );
            }
            this.userService.setUser(res.user);
          },
          error: (error) => {
            this.layoutMessageService.addMessage(
              'error',
              error.error.error,
              'Error',
              3000
            );
          },
          complete: () => {},
        });
      },
      reject: () => {
        this.checked.setValue(oldValue);
      },
    });
  }

  showMoreInfoDialog(){
    this.moreInfoShown = true;
  }
}
