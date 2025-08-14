import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true
})
export class HeaderComponent {
  userData: any
  constructor(
    private element: ElementRef, private renderer: Renderer2,
    private router: Router) {
    this.userData = JSON.parse(localStorage.getItem('userInfo') || '{}');
  }

  onClickProfile = () => {
    const profileDropdownList = this.element.nativeElement.querySelector(
      '.profile-dropdown-list'
    );
    this.renderer.setAttribute(profileDropdownList, 'aria-expanded', 'true');
  };

  onLogout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('role_uuid');
    localStorage.removeItem('CtiToken');
    this.router.navigate(['/']);
  };
}

