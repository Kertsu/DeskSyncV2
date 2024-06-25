import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-guides',
  templateUrl: './guides.component.html',
  styleUrl: './guides.component.css',
})
export class GuidesComponent {
  constructor(protected userService: UserService) {}

  getRole() {
    switch (this.userService.getUser().role) {
      case 'admin':
      case 'superadmin':
        return 'Admin';
      case 'om':
        return 'Office Manager';
      case 'user':
        return 'User';
      default:
        return '';
    }
  }
}
