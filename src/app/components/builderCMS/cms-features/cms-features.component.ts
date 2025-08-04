import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonService } from '../../../services/common.service';
import { NoWhitespaceDirective } from '../../../validators';
import { TableComponent } from '../../shared/table/table.component';
import { SubmitButtonComponent } from '../../shared/submit-button/submit-button.component';

@Component({
  selector: 'app-cms-features',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, TableComponent, SubmitButtonComponent],
  templateUrl: './cms-features.component.html',
  styleUrl: './cms-features.component.css'
})
export class CmsFeaturesComponent {
  Form!: FormGroup;
  loading: boolean = false
  columns: any[] = []
  url: string = ''
  constructor(private service: CommonService, private toastr: NzMessageService, private router: Router, public location: Location) {
    this.initForm()
  }

  ngOnInit(): void {
    this.getData()
  }

  initForm() {
    this.Form = new FormGroup({
      featureName: new FormControl('', [Validators.required, NoWhitespaceDirective.validate]),
    })
  }

  getData() {
    this.url = 'getAllFeatures'
    this.columns = [
      { field: '', header: 'S. No' },
      { field: 'featuresName', header: 'Features' },
      { field: 'subFeatures', header: 'Sub-Features', isArray: true, arrayField: 'subFeaturesName' },
      { field: 'action', header: 'Action', isEdit: true, isDelete: true, isView: true },
    ]
  }

  onSubmit() {
    if (this.Form.invalid) {
      this.Form.markAllAsTouched();
      return
    }
    this.loading = true
    this.service.postAPI('addFeature', this.Form.value).subscribe((res: any) => {
      if (res.success == true) {
        this.toastr.success(res.message)
        this.getData()
        this.onModalCloseHandler(false)
        this.loading = false
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

  onView(event: any) {
    this.router.navigate([`/admin/builder-cms/feature-detail/${event.id}`])
  }

  onEdit(event: any) {
    console.log(event);
  }

  onDelete(event: any) {
    console.log(event);
  }

  showModal: boolean = false;
  openModal() {
    this.showModal = !this.showModal;
  }

  onModalCloseHandler(event: any) {
    this.showModal = event;
  }
}
