import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  providers: [DatePipe, CurrencyPipe]
})
export class TableComponent {
  @Input() apiUrl!: string;
  @Input() columns: { field: string; header: string; align?: string; width?: string; pipe?: string; isArray?: boolean }[] = [];
  @Input() pageSizeOptions: number[] = [5, 10, 25];

  @Output() viewClicked = new EventEmitter<any>();
  @Output() editClicked = new EventEmitter<any>();
  @Output() deleteClicked = new EventEmitter<any>();

  pagedData: any[] = [];
  totalRecords = 0;
  currentPage = 1;
  pageSize = this.pageSizeOptions[0];

  constructor(private service: CommonService, private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe) { }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    const params = {
      _page: this.currentPage.toString(),
      _limit: this.pageSize.toString()
    };

    this.service.get<any[]>(this.apiUrl).subscribe((res: any) => {
      this.pagedData = res.data || [];
      this.totalRecords = this.pagedData.length;
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.fetchData();
  }

  onPageSizeChange(event: any) {
    const size = event.target.value;
    this.pageSize = +size;
    this.currentPage = 1;
    this.fetchData();
  }

  getPageEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalRecords);
  }

  emitView(row: any) {
    this.viewClicked.emit(row);
  }
  emitEdit(row: any) {
    this.editClicked.emit(row);
  }
  emitDelete(row: any) {
    this.deleteClicked.emit(row);
  }

  applyPipe(value: any, pipeName: string, args: string = ''): any {
    switch (pipeName) {
      case 'date':
        return this.datePipe.transform(value, args || 'mediumDate');
      case 'currency':
        return this.currencyPipe.transform(value, args || 'INR');
      default:
        return value;
    }
  }

  parseData(data: string): string {
    return JSON.parse(data)?.join(' | ')
  }
}
