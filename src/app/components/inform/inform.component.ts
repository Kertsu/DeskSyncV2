import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-inform',
  templateUrl: './inform.component.html',
  styleUrl: './inform.component.css'
})
export class InformComponent {
  @Input() info: string = ''
}
