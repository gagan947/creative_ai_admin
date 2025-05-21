import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzSelectModule } from 'ng-zorro-antd/select';
@Component({
  selector: 'app-main',
  standalone: true,
  imports: [NzSelectModule, FormsModule, RouterOutlet, RouterLink],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  selectedValue: any
}
