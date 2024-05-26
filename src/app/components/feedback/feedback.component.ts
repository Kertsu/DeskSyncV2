import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css',
})
export class FeedbackComponent implements OnInit {
  feedbackForm!: FormGroup;

  justFinished: boolean = false;
  selectedRating: number | null = null;
  hoveredRating: number | null = null;

  ratings = [
    { emoji: '😣', rate: 1, descripton: 'Very bad' },
    { emoji: '🙁', rate: 2, descripton: 'Bad' },
    { emoji: '😐', rate: 3, descripton: 'Ok' },
    { emoji: '🙂', rate: 4, descripton: 'Good' },
    { emoji: '😃', rate: 5, descripton: 'Excellent' },
  ];

  constructor(private fb: FormBuilder, protected config: DynamicDialogConfig) {}

  ngOnInit(): void {

    console.log(this.config.data.deskNumber)

    this.feedbackForm = this.fb.group({
      rating: [''],
      description: [''],
    })

    this.feedbackForm.valueChanges.subscribe(res => console.log(res));
  }  

  onSubmit() {
    alert(JSON.stringify(this.feedbackForm.value));
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
}
