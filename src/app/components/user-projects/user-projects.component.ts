import { Component } from '@angular/core';
import { TableComponent } from "../shared/table/table.component";

@Component({
  selector: 'app-user-projects',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './user-projects.component.html',
  styleUrl: './user-projects.component.css'
})
export class UserProjectsComponent {
 url: string = ''
 loading: boolean = false
 columns: any[] = [];
 totalLength:any
  ngOnInit(): void {
    this.getData()
  }
  
  getData() {
    this.url = 'fetchAllUsersByAdmin'
    this.columns = [
      { field: '', header: 'S. No' },
      { field: 'name', header: 'Name' },
      { field: 'email', header: 'Email',  },
      { field: 'country_code',field2:'phoneNumber', header: 'Phone No.',combine:true },
      { field: 'createdAt', pipe: 'date', header: 'Registered on',combine:true },
      { field: 'action', header: 'Action',  isView: true,  },
    ]
  }

  onView(event: any) {
    // this.projectData = event
    // this.showViewModal = true
  }
  getResponse(event:any){
    this.totalLength = event.length
    
  }

}
