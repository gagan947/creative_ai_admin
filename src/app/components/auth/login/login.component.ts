import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { AuthService } from '../../../services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SubmitButtonComponent } from "../../shared/submit-button/submit-button.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterLink, SubmitButtonComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  Form!: FormGroup;
  isPasswordVisible: boolean = false;
  loading: boolean = false;

  constructor(private router: Router, private srevice: CommonService, private toster: NzMessageService, private auth: AuthService) {

  }

  logout() {
    localStorage.removeItem('userRole')
    this.router.navigateByUrl('/')
    //window.location.href = 'https://creativethoughtsinfo.com/CT01/ebook/';
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.Form = new FormGroup({
      email: new FormControl(localStorage.getItem('SavedEmail') || '', [Validators.required, Validators.email]),
      password: new FormControl(localStorage.getItem('SavedPassword') || '', Validators.required),
      rememberMe: new FormControl(localStorage.getItem('RememberMe') === 'true' || false)
    })
  }

  onSubmit() {
    this.Form.markAllAsTouched();
    if (this.Form.valid) {
      this.loading = true;

      let formData = {
        email: this.Form.value.email,
        password: this.Form.value.password
      }

      this.srevice.postAPI('signIn', formData).subscribe({
        next: (resp: any) => {
          if (resp.success == true) {
            this.auth.setToken(resp.data.token, '4e5d5b7c-38db-11ee-be56-0242ac120002');
            localStorage.setItem('userInfo', JSON.stringify(resp.data.users[0]));
            this.router.navigate(['/admin/dashboard']);
            if (this.Form.value.rememberMe) {
              localStorage.setItem('SavedEmail', this.Form.value.email);
              localStorage.setItem('SavedPassword', this.Form.value.password);
              localStorage.setItem('RememberMe', 'true');
            } else {
              localStorage.removeItem('SavedEmail');
              localStorage.removeItem('SavedPassword');
              localStorage.removeItem('RememberMe');
            }
            this.toster.success(resp.message)
            this.loading = false;
          } else {
            this.loading = false;
            this.toster.warning(resp.message)
          }
        },
        error: (error) => {
          this.loading = false;
          this.toster.error(error);
        }
      });
    }
  }
}
