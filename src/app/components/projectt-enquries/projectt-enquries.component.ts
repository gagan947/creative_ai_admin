import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonService } from '../../services/common.service';
import { TableComponent } from '../shared/table/table.component';

@Component({
  selector: 'app-projectt-enquries',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './projectt-enquries.component.html',
  styleUrl: './projectt-enquries.component.css'
})
export class ProjecttEnquriesComponent {
  loading: boolean = false
  columns: any[] = []
  url: string = ''
  constructor() {
  }

  ngOnInit(): void {
    // this.getData()
  }
  getData() {
    this.url = 'getClientEnquiries'
    this.columns = [
      { field: '', header: 'S. No' },
      { field: 'clientProjectName', header: 'Project Name' },
      { field: 'durations', header: 'Duration In Weeks' },
      { field: 'totalCost', header: 'Total Price', pipe: 'currency' },
      { field: 'platforms', header: 'Platforms', isArray: true },
      { field: 'developmentSpeed', header: 'Development Speed' },
      { field: 'name', header: 'Client Name' },
      { field: 'email', header: 'Email' },
      { field: 'phoneNumber', header: 'Contact' },
      { field: 'createdAt', header: 'Enquiry Date', pipe: 'date' },
      { field: 'action', header: 'Action', isEdit: true, isDelete: true, isView: true },
    ]
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
}
