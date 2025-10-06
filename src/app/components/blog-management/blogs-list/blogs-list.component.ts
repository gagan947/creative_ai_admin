import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { CommonService } from '../../../services/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TableComponent } from '../../shared/table/table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blogs-list',
  standalone: true,
  imports: [RouterLink, TableComponent, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './blogs-list.component.html',
  styleUrl: './blogs-list.component.css'
})
export class BlogsListComponent {

  columns: any[] = []
  url: string = ''

  constructor(private service: CommonService, private toastr: NzMessageService, private router: Router) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.url = 'getAllBlogs'
    this.columns = [
      { field: '', header: 'S. No' },
      { field: 'title', header: 'Title' },
      { field: 'post_date', header: 'Post Date' },
      { field: 'description', header: 'Description', addClass: 'w-[38rem] text-ellipsis overflow-hidden whitespace-nowrap' },
      { field: 'action', header: 'Action', isEdit: true, isDelete: true, isView: false, isAlbum: false, isFeatures: false },
    ]
  }

  onDelete(event: any) {
    this.service.delete(`deleteBlog?id=${event.id}`).subscribe((res: any) => {
      if (res.success == true) {
        this.toastr.success(res.message)
        this.getData()
      } else {
        this.toastr.warning(res.message)
      }
    })
  }

  onEdit(event: any) {
    this.router.navigate(['/admin/add-blog'], { queryParams: { id: event.id } });
  }

  onView(event: any) {
    console.log(event);
  }


}
