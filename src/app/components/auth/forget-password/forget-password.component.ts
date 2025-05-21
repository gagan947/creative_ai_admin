import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterLink],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent {
  isLoading: boolean = false;

  signInForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });

  constructor(
    private formBuilder: FormBuilder
  ) { }

  protected onFormSubmitHandler = (event: SubmitEvent) => {
    // event.preventDefault();
    // this.isLoading = true;

    // this.commonService.postAPI('admin/signIn', this.signInForm.value).subscribe({
    //   next: (res: any) => {
    //     this.isLoading = false;
    //     this.commonService.setToken(res.data);
    //     this.message.success(res.message);
    //     this.router.navigate([AppRoutes.Admin, AdminRoutes.Dashboard]);
    //   },
    //   error: (err: any) => {
    //     this.isLoading = false;
    //     this.message.error(err.error.message)
    //   }
    // })
  };
}
