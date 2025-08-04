import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-submit-button',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './submit-button.component.html',
  styleUrl: './submit-button.component.css'
})
export class SubmitButtonComponent {
  @Input() isLoading = false;
  @Input() text = 'Submit';
  @Input() disabled = false;
  @Input() class = '';
}
