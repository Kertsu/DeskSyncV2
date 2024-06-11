import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from './service/app.layout.service';
import { UiService } from '../services/ui.service';
import { UserService } from '../services/user.service';
import { SocketService } from '../services/socket.service';
import { WebService } from '../services/web.service';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ReportComponent } from '../pages/report/report.component';

interface Notification {
  id: string;
  user: string;
  message: string;
  status: string;
}

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
  providers: [DialogService],
})
export class AppTopBarComponent implements OnInit {
  notifications: Notification[] = [];
  totalDocuments!: number;

  isDark: boolean = false;

  items!: MenuItem[];

  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;

  ref: DynamicDialogRef | undefined = undefined;

  constructor(
    public layoutService: LayoutService,
    private uiService: UiService,
    private userService: UserService,
    private socketService: SocketService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {}

  changeTheme(theme: string) {
    this.uiService.switchTheme(theme);
    this.isDark = !this.isDark;
  }

  logout() {
    this.socketService.emit('die', {});
    this.userService.logout();
  }

  openReportDialog() {
    const dialogConfig: DynamicDialogConfig = {
      header: `Submit a Report`,
      modal: true,
      closeOnEscape: true,
      breakpoints: { '2000px': '30vw', '1440px': '60vw', '500px': '90vw' },
    };
    this.ref = this.dialogService.open(ReportComponent, dialogConfig);

    this.ref.onClose.subscribe((data) => {
     
    });
  }
}
