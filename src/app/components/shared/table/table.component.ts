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
  @Input() columns: {
    field: string;
    header: string;
    align?: string;
    width?: string;
    pipe?: string;
    isArray?: boolean;
    addClass?: string;
    arrayField?: string;
    isEdit?: boolean;
    isDelete?: boolean;
    isView?: boolean;
    isFeatures?: boolean;
    isAlbum?: boolean;
  }[] = [];
  @Input() pageSizeOptions: number[] = [10, 20, 25];
  @Input() projectId?: any
  @Input() featureId?: any
  @Output() viewClicked = new EventEmitter<any>();
  @Output() editClicked = new EventEmitter<any>();
  @Output() deleteClicked = new EventEmitter<any>();
  @Output() featureViewClicked = new EventEmitter<any>();

  pagedData: any[] = [];
  totalRecords = 0;
  currentPage = 1;
  pageSize = this.pageSizeOptions[0];
  isLoading: boolean = true;
  constructor(private service: CommonService, private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe) { }

  // ngOnInit() {
  //   this.fetchData();
  // }

  ngOnChanges(): void {
    this.fetchData();
  }

  fetchData() {
    this.isLoading = true
    const params: any = {
      page: this.currentPage.toString(),
      limit: this.pageSize.toString()
    };

    if (this.projectId) {
      params['projectId'] = this.projectId;
    }
    if (this.featureId) {
      params['featureId'] = this.featureId;
    }

    this.service.get<any[]>(this.apiUrl, params).subscribe((res: any) => {
      this.pagedData = res.data || [];
      this.totalRecords = res.totalRecords || 0;
      this.isLoading = false
    }, (err: any) => {
      this.isLoading = false
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

  emitFeaturesView(row: any) {
    this.featureViewClicked.emit(row);
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

  parseData(array: any[], key: string): string {
    if (!Array.isArray(array) || !key) return 'N/A';

    const values = array.map(item => item?.[key]).filter(Boolean);
    return values.length ? values.join(' | ') : 'N/A';
  }
}
