import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-blogs-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './blogs-list.component.html',
  styleUrl: './blogs-list.component.css'
})
export class BlogsListComponent {

}
