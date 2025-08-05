import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonService } from '../../../../services/common.service';
import { CommonModule, Location } from '@angular/common';
import { TableComponent } from '../../../shared/table/table.component';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { SubmitButtonComponent } from "../../../shared/submit-button/submit-button.component";

@Component({
  selector: 'app-cms-project-details',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, TableComponent, NzTreeSelectModule, SubmitButtonComponent],
  templateUrl: './cms-project-details.component.html',
  styleUrl: './cms-project-details.component.css'
})
export class CmsProjectDetailsComponent {
  loading: boolean = false
  columns: any[] = []
  url: string = ''
  id: string = ''
  featuresSubFeaturesList: any[] = []
  value: any[] = []
  dropdownOpen: boolean = false
  selectedFeatures: { featureId: number, subFeatureIds: number[] }[] = [];
  data: any[] = []
  constructor(private service: CommonService, private toastr: NzMessageService, private router: Router, public location: Location, private route: ActivatedRoute) {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id') || '';
    });
  }

  ngOnInit(): void {
    this.getFeaturesSubFeatures()
    this.getData();
  }

  getFeaturesSubFeatures() {
    this.service.get('getAllFeatures').subscribe((res: any) => {
      this.featuresSubFeaturesList = res.data;
    })
  }

  getData() {
    this.url = 'fetchFeaturesById'
    this.columns = [
      { field: '', header: 'S. No' },
      { field: 'featureName', header: 'Features' },
      { field: 'subFeatures', header: 'Sub-Features', isArray: true, arrayField: 'subFeatureName' },
      // { field: 'action', header: 'Action', isEdit: true, isDelete: true, isView: true },
    ]

    this.service.get<any[]>(`fetchFeaturesById?projectId=${this.id}`).subscribe((res: any) => {
      this.data = res.data || [];
      this.selectedFeatures = this.data.map(feature => feature.subFeatures.map((sub: { subFeatureId: any; }) => sub.subFeatureId)).flat();
    })
  }

  onSubmit() {
    if (this.selectedFeatures.length == 0) {
      this.toastr.warning('Please select at least one subfeature')
      return
    }
    this.loading = true
    let formData = {
      projectId: this.id,
      featureData: this.selectedFeatures
    }
    this.service.postAPI('insertProjectSubFeatures', formData).subscribe((res: any) => {
      if (res.success == true) {
        this.toastr.success(res.message)
        this.selectedFeatures = []
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

  isSelected(sub: any, feature: any): boolean {
    const found = this.selectedFeatures.find(f => f.featureId === feature.id);
    return found ? found.subFeatureIds.includes(sub.id) : false;
  }

  toggleSubFeatureSelection(sub: any, feature: any) {
    const featureEntry = this.selectedFeatures.find(f => f.featureId === feature.id);

    if (featureEntry) {
      const index = featureEntry.subFeatureIds.indexOf(sub.id);
      if (index > -1) {
        featureEntry.subFeatureIds.splice(index, 1);
      } else {
        featureEntry.subFeatureIds.push(sub.id);
      }

      if (featureEntry.subFeatureIds.length === 0) {
        this.selectedFeatures = this.selectedFeatures.filter(f => f.featureId !== feature.id);
      }
    } else {
      this.selectedFeatures.push({ featureId: feature.id, subFeatureIds: [sub.id] });
    }
  }

  toggleFeatureSelection(feature: any) {
    const allSelected = this.isFeatureFullySelected(feature);

    if (allSelected) {
      this.selectedFeatures = this.selectedFeatures.filter(f => f.featureId !== feature.id);
    } else {
      const subFeatureIds = feature.subFeatures.map((sub: any) => sub.id);
      const existing = this.selectedFeatures.find(f => f.featureId === feature.id);

      if (existing) {
        existing.subFeatureIds = subFeatureIds;
      } else {
        this.selectedFeatures.push({ featureId: feature.id, subFeatureIds });
      }
    }
  }

  isFeatureFullySelected(feature: any): boolean {
    const selected = this.selectedFeatures.find(f => f.featureId === feature.id);
    return selected ? selected.subFeatureIds.length === feature.subFeatures.length : false;
  }

  isFeatureIndeterminate(feature: any): boolean {
    const selected = this.selectedFeatures.find(f => f.featureId === feature.id);
    return selected ? selected.subFeatureIds.length > 0 && selected.subFeatureIds.length < feature.subFeatures.length : false;
  }

  getSelectedLabels(): string[] {
    const labels: string[] = [];

    this.selectedFeatures.forEach(selected => {
      const feature = this.featuresSubFeaturesList.find(f => f.id === selected.featureId);
      if (feature) {
        selected.subFeatureIds.forEach(subId => {
          const sub = feature.subFeatures.find((s: any) => s.id === subId);
          if (sub) labels.push(sub.subFeaturesName);
        });
      }
    });

    return labels;
  }

  getFormattedSelectedLabels(): string {
    const groupMap: { [feature: string]: string[] } = {};

    this.selectedFeatures.forEach(selected => {
      const feature = this.featuresSubFeaturesList.find(f => f.id === selected.featureId);
      if (feature) {
        const subNames = selected.subFeatureIds
          .map(id => {
            const sub = feature.subFeatures.find((s: any) => s.id === id);
            return sub?.subFeaturesName;
          })
          .filter(Boolean);

        if (subNames.length > 0) {
          groupMap[feature.featuresName] = subNames;
        }
      }
    });

    const maxVisibleFeatures = 1;
    const maxVisibleSubFeatures = 2;

    const featureEntries = Object.entries(groupMap);
    const visibleFeatures = featureEntries.slice(0, maxVisibleFeatures);
    const remainingFeatures = featureEntries.length - maxVisibleFeatures;

    const formatted = visibleFeatures.map(([feature, subs]) => {
      const visibleSubs = subs.slice(0, maxVisibleSubFeatures);
      const remainingSubs = subs.length - maxVisibleSubFeatures;

      const subText = remainingSubs > 0
        ? `${visibleSubs.join(', ')}, +${remainingSubs} more`
        : visibleSubs.join(', ');

      return `${feature} (${subText})`;
    });

    return remainingFeatures > 0
      ? `${formatted.join(', ')}, +${remainingFeatures} more selected`
      : formatted.join(', ') || 'Please select';
  }
}
