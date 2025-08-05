import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonService } from '../../../../services/common.service';
import { NoWhitespaceDirective } from '../../../../validators';
import { TableComponent } from '../../../shared/table/table.component';
import { SubmitButtonComponent } from '../../../shared/submit-button/submit-button.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
@Component({
  selector: 'app-cms-feature-detail',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, TableComponent, SubmitButtonComponent, NzSelectModule],
  templateUrl: './cms-feature-detail.component.html',
  styleUrl: './cms-feature-detail.component.css'
})
export class CmsFeatureDetailComponent {
  Form!: FormGroup;
  loading: boolean = false
  columns: any[] = []
  url: string = ''
  id: string = ''
  estimatedTimeList: number[] = Array.from({ length: 61 }, (_, i) => i + 1);
  subFeatureId: number | null = null;
  currentRouteName: string = ''

  constructor(private service: CommonService, private toastr: NzMessageService, private router: Router, public location: Location, private route: ActivatedRoute) {
    this.currentRouteName = sessionStorage.getItem('currentRouteName') || ''
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
      estimatedTime: new FormControl(null, [Validators.required]),
    })
  }

  getData() {
    this.url = 'getSubfeaturesByFeatureId'
    this.columns = [
      { field: '', header: 'S. No' },
      { field: 'subFeaturesName', header: 'Sub Feature' },
      { field: 'estimated_time', header: 'Estimated Time' },
      { field: 'action', header: 'Action', isEdit: true, isDelete: true, isView: false },
    ]
  }

  onSubmit() {
    if (this.Form.invalid) {
      this.Form.markAllAsTouched();
      return
    }
    this.loading = true
    let formData = {}
    let apiUrl = ''
    if (this.subFeatureId) {
      apiUrl = 'updateSubFeatures'
      formData = {
        id: this.subFeatureId,
        subFeatureName: this.Form.value.subFeature_name.trim(),
        estimatedTime: this.Form.value.estimatedTime
      }
    } else {
      apiUrl = 'addSubFeature'
      formData = {
        featureId: this.id,
        subFeatureName: this.Form.value.subFeature_name.trim(),
        estimatedTime: this.Form.value.estimatedTime
      }
    }
    this.service.postAPI(apiUrl, formData).subscribe((res: any) => {
      if (res.success == true) {
        this.toastr.success(res.message)
        this.getData()
        this.onModalCloseHandler(false)
        this.loading = false
        this.Form.reset()
        this.subFeatureId = null
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
    this.subFeatureId = event.id
    this.showModal = true
    this.Form.patchValue({
      subFeature_name: event.subFeaturesName,
      estimatedTime: Number(event.estimated_time)
    })
  }

  onDelete(event: any) {
    this.service.get('deleteSubFeature', { id: event.id }).subscribe((res: any) => {
      if (res.success == true) {
        this.toastr.success(res.message)
        this.getData()
      } else {
        this.toastr.warning(res.message)
      }
    })
  }

  showModal: boolean = false;
  openModal() {
    this.showModal = !this.showModal;
  }

  onModalCloseHandler(event: any) {
    this.showModal = event;
    this.subFeatureId = null
    this.Form.reset()
  }
}
