import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NoWhitespaceDirective } from '../../validators';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../shared/table/table.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, TableComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent {
  Form!: FormGroup;
  loading: boolean = false
  columns: any[] = []
  url: string = ''
  constructor(private service: CommonService, private toastr: NzMessageService, private router: Router) {
    this.initForm()
  }

  ngOnInit(): void {
    this.getData()

  }

  initForm() {
    this.Form = new FormGroup({
      project_name: new FormControl('', [Validators.required, NoWhitespaceDirective.validate]),
      project_description: new FormControl('', [Validators.required, NoWhitespaceDirective.validate]),
      client_name: new FormControl('', [Validators.required, NoWhitespaceDirective.validate]),
      start_date: new FormControl('', [Validators.required, NoWhitespaceDirective.validate]),
      end_date: new FormControl('', [Validators.required, NoWhitespaceDirective.validate]),
      priority: new FormControl('', [Validators.required])
    })
  }

  getData() {
    this.url = 'getOnboardedPRojects'
    this.columns = [
      { field: '', header: 'S. No' },
      { field: 'project_name', header: 'Project Name' },
      { field: 'client_name', header: 'Client Name' },
      { field: 'start_date', header: 'Start Date', pipe: 'date' },
      { field: 'deadline', header: 'End Date', pipe: 'date' },
      { field: 'priority', header: 'Priority' },
    ]
  }


  onSubmit() {
    if (this.Form.invalid) {
      this.Form.markAllAsTouched();
      return
    }
    this.service.postAPI('insertOnboardProjects', this.Form.value).subscribe((res: any) => {
      if (res.success == true) {
        this.toastr.success(res.message)
        this.getData()
        this.onModalCloseHandler(false)
      } else {
        this.toastr.warning(res.message)
      }
    },
      (err: any) => {
        this.toastr.error(err)
      })
  }

  onView(event: any) {
    this.router.navigate([`/admin/projects/view/${event.id}`])
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
