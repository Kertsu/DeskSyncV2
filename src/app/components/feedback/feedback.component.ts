import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { WebService } from '../../services/web.service';
import { MessageService } from '../../utils/message.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css',
})
export class FeedbackComponent implements OnInit {
  feedbackForm!: FormGroup;

  selectedRating: number | null = null;
  hoveredRating: number | null = null;

  errorMessage!: string;
  hasErrors: boolean = false;

  isProcessing: boolean = false;

  ratings = [
    { emoji: '😣', rate: 1, descripton: 'Very bad' },
    { emoji: '🙁', rate: 2, descripton: 'Bad' },
    { emoji: '😐', rate: 3, descripton: 'Ok' },
    { emoji: '🙂', rate: 4, descripton: 'Good' },
    { emoji: '😃', rate: 5, descripton: 'Excellent' },
  ];

  constructor(
    private fb: FormBuilder,
    protected config: DynamicDialogConfig,
    private webService: WebService,
    private messageService: MessageService,
    private dialogRef: DynamicDialogRef
  ) {}

  ngOnInit(): void {
    console.log(this.config.data.deskNumber);

    this.feedbackForm = this.fb.group({
      rating: [''],
      description: [''],
    });

    this.feedbackForm.valueChanges.subscribe((res) => console.log(res));
  }

  onSubmit() {
    const { deskNumber, reservation } = this.config.data;
    const feedback = this.feedbackForm.value;
    feedback.deskNumber = deskNumber;
    feedback.reservation = reservation;

    console.log(feedback);
    this.isProcessing = true;
    this.webService.submitFeedback(feedback).subscribe({
      next: (res: any) => {},
      error: (error) => {
        console.log(error);
        this.errorMessage = error.error.error;
        this.triggerErrorEvent();
        this.isProcessing = false; 
      },
      complete: () => {
        this.messageService.addMessage(
          'success',
          'Feedback submitted',
          'Success'
        );
        this.dialogRef.close(feedback);
        this.isProcessing = false;
      },
    });
  }

  handleRating(rating: number) {
    this.selectedRating = rating;
    this.feedbackForm.get('rating')?.setValue(rating);
  }

  handleMouseEnter(rating: number) {
    this.hoveredRating = rating;
  }

  handleMouseLeave() {
    this.hoveredRating = null;
  }

  triggerErrorEvent() {
    this.hasErrors = true;

    setTimeout(() => {
      this.hasErrors = false;
    }, 1500);
  }
}
