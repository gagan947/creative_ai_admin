import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonService } from '../../../services/common.service';
import { NoWhitespaceDirective } from '../../../validators';
import { CommonModule, Location } from '@angular/common';
import { SubmitButtonComponent } from '../../shared/submit-button/submit-button.component';

@Component({
  selector: 'app-add-blog',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, SubmitButtonComponent],
  templateUrl: './add-blog.component.html',
  styleUrl: './add-blog.component.css'
})
export class AddBlogComponent {
  Form!: FormGroup;
  LogoImage: File | null = null;
  loading: boolean = false;
  blogId: number | null = null;
  logoPreview: string | null = null;
  constructor(private service: CommonService, private toastr: NzMessageService, private router: Router, public location: Location) {
    this.initForm()
  }
  initForm() {
    this.Form = new FormGroup({
      title: new FormControl('', [Validators.required, NoWhitespaceDirective.validate]),
      description: new FormControl('', [Validators.required, NoWhitespaceDirective.validate])
    })
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.LogoImage = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.logoPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  removeProjectImage() {
    this.logoPreview = null;
    this.LogoImage = null;
  }

  onSubmit() {
    if (this.Form.invalid) {
      this.Form.markAllAsTouched();
      return
    }


    this.loading = true
    let apiUrl = ''
    let formData = new FormData()

    if (this.blogId) {
      apiUrl = 'updateProjects'
      formData.append('blogId', this.blogId.toString())
      formData.append('projectName', this.Form.value.project_name.trim())
      formData.append('description', this.Form.value.project_description.trim())
      if (this.LogoImage) {
        formData.append('projectImage', this.LogoImage)
      }
    } else {
      apiUrl = 'insertOnboardProjects'
      formData.append('projectName', this.Form.value.project_name.trim())
      formData.append('description', this.Form.value.project_description.trim())
      if (this.LogoImage) {
        formData.append('projectImage', this.LogoImage)
      }
    }

    this.service.postAPI(apiUrl, formData).subscribe((res: any) => {
      if (res.success == true) {
        this.toastr.success(res.message)
        this.Form.reset()
        this.LogoImage = this.logoPreview = null
        this.loading = false;
        this.blogId = null
      } else {
        this.toastr.warning(res.message)
        this.loading = false
      }
    },
      (err: any) => {
        this.toastr.error(err)
        this.loading = false
      })
  }
}
