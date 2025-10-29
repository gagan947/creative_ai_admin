import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
interface ChartData {
  name: string;
  value?: number;
  series?: { name: string; value: number }[];
}
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgxChartsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  colorScheme: Color = {
    name: 'users',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#6d28d9'],
  };

  colorSchemeRevenue: Color = {
    name: 'revenue',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#06b6d4'],
  };

  filterOptions: ('day' | 'week' | 'month')[] = ['day', 'week', 'month'];
  activeFilter: 'day' | 'week' | 'month' = 'week';
  userChartData: ChartData[] = [];
  revenueChartData: ChartData[] = [];

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.filterChart('day');
    this.loadRevenueData();
  }

filterChart(period: 'day' | 'week' | 'month') {
  this.activeFilter = period;

  setTimeout(() => {
    let data: { name: string; value: number }[] = [];

    switch (period) {
      case 'day':
        data = [
          { name: 'Mon', value: 120 },
          { name: 'Tue', value: 150 },
          { name: 'Wed', value: 200 },
          { name: 'Thu', value: 250 },
          { name: 'Fri', value: 300 },
          { name: 'Sat', value: 280 },
          { name: 'Sun', value: 80 },
        ];
        break;

      case 'week':
        data = [
          { name: 'Week 1', value: 800 },
          { name: 'Week 2', value: 1200 },
          { name: 'Week 3', value: 950 },
          { name: 'Week 4', value: 1400 },
          { name: 'Week 5', value: 1300 },
        ];
        break;

      case 'month':
        data = [
          { name: 'Jan', value: 4000 },
          { name: 'Feb', value: 5000 },
          { name: 'Mar', value: 5500 },
          { name: 'Apr', value: 6000 },
          { name: 'May', value: 6500 },
          { name: 'Jun', value: 7000 },
          { name: 'Jul', value: 3000 },
          { name: 'Aug', value: 6500 },
          { name: 'Sep', value: 4000 },
          { name: 'Oct', value: 9000 },
        ];
        break;
    }

    this.userChartData = [
      {
        name: 'Users',
        series: data,
      },
    ];
  }, 150);
}


  loadRevenueData() {
    this.revenueChartData = [
      { name: 'Jan', value: 25000 },
      { name: 'Feb', value: 30000 },
      { name: 'Mar', value: 28000 },
      { name: 'Apr', value: 35000 },
      { name: 'May', value: 37000 },
      { name: 'Jun', value: 39000 },
      { name: 'Jul', value: 41000 },
      { name: 'Aug', value: 43000 },
      { name: 'Sep', value: 45000 },
      { name: 'Oct', value: 47000 },
      { name: 'Nov', value: 49000 },
      { name: 'Dec', value: 52000 },
    ];
  }
}
