import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NoWhitespaceDirective, strongPasswordValidator } from '../../validators';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TableComponent } from "../shared/table/table.component";

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TableComponent],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.css'
})
export class TeamsComponent {
  roleList: any[] = [];
  Form!: FormGroup;
  loading: boolean = false
  columns: any[] = []
  url: string = ''
  constructor(private service: CommonService, private toastr: NzMessageService) {
    this.initForm()
  }

  ngOnInit(): void {
    // this.getRoles()
    // this.getData()
  }

  initForm() {
    this.Form = new FormGroup({
      name: new FormControl('', [Validators.required, NoWhitespaceDirective.validate]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, strongPasswordValidator]),
      phone_number: new FormControl('', [Validators.required]),
      role_uuid: new FormControl('', [Validators.required])
    })
  }

  getData() {
    this.url = 'getTeamMembers'
    this.columns = [
      { field: '', header: 'S. No' },
      { field: 'member_name', header: 'Name' },
      { field: 'email', header: 'Email' },
      { field: 'phone_no', header: 'Phone Number' },
      { field: 'role_name', header: 'Role' },
      { field: 'created_at', header: 'Join Date', pipe: 'date' },
      { field: 'action', header: 'Action', isEdit: true, isDelete: true, isView: true },
    ]
  }

  getRoles() {
    this.service.get('getAllRoles').subscribe((res: any) => {
      this.roleList = res.data
    })
  }

  onSubmit() {
    if (this.Form.invalid) {
      this.Form.markAllAsTouched();
      return
    }
    this.service.postAPI('creatememeber', this.Form.value).subscribe((res: any) => {
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
    console.log(event);
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
