import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonService } from '../../../../services/common.service';
import { NoWhitespaceDirective } from '../../../../validators';
import { TableComponent } from '../../../shared/table/table.component';
import { SubmitButtonComponent } from '../../../shared/submit-button/submit-button.component';

@Component({
  selector: 'app-cms-feature-detail',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, TableComponent, SubmitButtonComponent],
  templateUrl: './cms-feature-detail.component.html',
  styleUrl: './cms-feature-detail.component.css'
})
export class CmsFeatureDetailComponent {
  Form!: FormGroup;
  loading: boolean = false
  columns: any[] = []
  url: string = ''
  id: string = ''
  constructor(private service: CommonService, private toastr: NzMessageService, private router: Router, public location: Location, private route: ActivatedRoute) {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id') || '';
    });
    this.initForm()
  }

  ngOnInit(): void {
    this.getData()
  }

  initForm() {
    this.Form = new FormGroup({
      subFeature_name: new FormControl('', [Validators.required, NoWhitespaceDirective.validate]),
    })
  }

  getData() {
    this.url = 'getSubfeaturesByFeatureId'
    this.columns = [
      { field: '', header: 'S. No' },
      { field: 'subFeaturesName', header: 'Sub Feature' },
      { field: 'action', header: 'Action', isEdit: true, isDelete: true, isView: false },
    ]
  }

  onSubmit() {
    if (this.Form.invalid) {
      this.Form.markAllAsTouched();
      return
    }
    this.loading = true
    let formData = {
      featureId: this.id,
      subFeatureName: this.Form.value.subFeature_name
    }
    this.service.postAPI('addSubFeature', formData).subscribe((res: any) => {
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
    this.router.navigate([`/admin/builder-cms/project-details/${event.id}`])
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
