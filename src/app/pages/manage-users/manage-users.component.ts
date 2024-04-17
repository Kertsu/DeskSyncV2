import { Component, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ParamsBuilderService } from '../../services/params-builder.service';
import { WebService } from '../../services/web.service';

interface Role {
  label: string;
  value: string;
}

interface Status {
  label: string;
  value: number;
}
@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.css',
  providers: [MessageService, ConfirmationService],
})
export class ManageUsersComponent {
  userDialog: boolean = false;
  createUserDialog: boolean = false;

  role = new FormControl();
  status = new FormControl();

  users!: any[];

  user!: any;

  selectedUsers!: any[];

  submitted: boolean = false;

  roles!: any[];
  statuses!: any[];

  loading: boolean = false;
  totalRecords!: number;
  selectAll: boolean = false;

  editForm = this.fb.group({
    username: [''],
    email: [
      '',
      [
        Validators.email,
        Validators.pattern(/@(student\.laverdad\.edu\.ph|laverdad\.edu\.ph)$/),
      ],
    ],
    role: new FormControl<Role | null>(null),
    status: new FormControl<Status | null>(null),
  });

  createForm = this.fb.group({
    email: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.pattern(/@(student\.laverdad\.edu\.ph|laverdad\.edu\.ph)$/),
      ],
    ],
  });

  @ViewChild('dt') dt: Table | undefined;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private paramsBuilder: ParamsBuilderService,
    private webService: WebService
  ) {}

  ngOnInit() {
    this.roles = [
      { label: 'Admin', value: 'admin' },
      { label: 'User', value: 'user' },
      { label: 'Office Manager', value: 'om' },
      { label: 'Super Admin', value: 'superadmin' },
    ];

    this.statuses = [
      { label: 'Disable', value: 1 },
      { label: 'Enable', value: 0 },
    ];
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  openNew() {
    this.submitted = false;
    this.createUserDialog = true;
  }

  deleteSelectedUsers() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected users?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.users = this.users.filter((val) => {
          console.log(val);
          return this.selectedUsers?.includes(val);
        });
        this.selectedUsers = [];
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Users Deleted',
          life: 3000,
        });
      },
    });
  }

  editUser(user: any) {
    let role;
    switch (user.role) {
      case 'admin':
        role = { label: 'Admin', value: 'admin' };
        break;
      case 'user':
        role = { label: 'User', value: 'user' };
        break;
      case 'om':
        role = { label: 'Office Manager', value: 'om' };
        break;
      case 'superadmin':
        role = { label: 'Super Admin', value: 'superadmin' };
        break;
    }
    this.editForm.patchValue({
      username: user.username,
      email: user.email,
      role,
      status:
        user.isDisabled === 1
          ? { label: 'Disable', value: 1 }
          : { label: 'Enable', value: 0 },
    });

    this.user = { ...user };
    this.userDialog = true;
  }

  deleteUser(user: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + user.username + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.users = this.users.filter((val) => val.id !== user.id);
        this.user = {};
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'User Deleted',
          life: 3000,
        });
      },
    });
  }

  hideDialog() {
    this.userDialog = false;
    this.submitted = false;
  }

  hideCreateUserDialog() {
    this.createUserDialog = false;
    this.submitted = false;
    this.createForm.reset();
  }

  createUser() {
    this.submitted = true;
  }

  saveUser() {
    this.submitted = true;

    if (this.user.name?.trim()) {
      if (this.user.id) {
        this.users[this.findIndexById(this.user.id)] = this.user;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'User Updated',
          life: 3000,
        });
      } else {
        this.user.image = 'user-placeholder.svg';
        this.users.push(this.user);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'User Created',
          life: 3000,
        });
      }

      this.users = [...this.users];
      this.userDialog = false;
      this.user = {};
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i]._id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  loadUsers(event: any) {
    console.log(event);
    const params = this.paramsBuilder.buildParams(event);
    this.loading = true;
    this.webService.getUsers(params).subscribe((res: any) => {
      if (res.success) {
        this.users = res.users;
        this.totalRecords = res.totalDocuments;
        this.loading = false;
      }
    });
  }

  onSelectionChange(value = []) {
    this.selectAll = value.length === this.totalRecords;
    this.selectedUsers = value;
  }

  onSelectAllChange(event: any) {
    const checked = event.checked;

    if (checked) {
      this.webService.getUsers().subscribe((res: any) => {
        if (res.success) {
          console.log(res);
          this.selectedUsers = res.users;
          this.selectAll = true;
        }
      });
    } else {
      this.selectedUsers = [];
      this.selectAll = false;
    }
  }
}