import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { Hotdesk } from '../../models/Hotdesk';
import { WebService } from '../../services/web.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from '../../utils/message.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrl: './report.component.css',
})
export class ReportComponent implements OnInit {
  formGroup!: FormGroup;

  desks: Hotdesk[] = [];

  options: any[] = [];

  isProcessing: boolean = false;

  constructor(private fb: FormBuilder, private webService: WebService, private dialogRef: DynamicDialogRef, private messageService: MessageService) {}
  ngOnInit() {
    this.formGroup = this.fb.group({
      date: new FormControl(null),
      selectedDesk: new FormControl(null, [Validators.required]),
      report: ['', Validators.required],
    });

    this.getHotdesks();

    this.formGroup.valueChanges.subscribe((res) => {
      console.log(res);
    });
  }

  getHotdesks() {
    this.webService
      .getDesks({
        sortField: 'deskNumber',
        sortOrder: 1,
      })
      .subscribe({
        next: (res: any) => {
          this.desks = res.desks;
        },
        error: (err: any) => {
          console.log(err);
        },
        complete: () => {
          this.getOptions();
        },
      });
  }

  getOptions() {
    this.options = this.desks.map((desk) => ({
      deskNumber: desk.deskNumber,
      title: desk.title,
    }));
  }

  submitReport(){
    if(this.formGroup.valid){
      this.isProcessing = true;
      this.webService.submitReport(this.formGroup.value).subscribe({
        next: (res: any) => {
          console.log(res);
          this.messageService.addMessage('success', res.message, 'Success')
        },
        error: (err: any) => {
          console.log(err);
          this.isProcessing = false;
        },
        complete: () => {
          this.dialogRef.close(this.formGroup.value);
          this.formGroup.reset();
          this.isProcessing = false;
        }
      })
    }
  }
}
