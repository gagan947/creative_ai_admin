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
  selectedSubFeatureIds: number[] = [];
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
      this.selectedSubFeatureIds = this.data.map(feature => feature.subFeatures.map((sub: { subFeatureId: any; }) => sub.subFeatureId)).flat();
    })
  }

  onSubmit() {
    if (this.selectedSubFeatureIds.length == 0) {
      this.toastr.warning('Please select at least one subfeature')
      return
    }
    this.loading = true
    let formData = {
      projectId: this.id,
      subFeatureIds: this.selectedSubFeatureIds
    }
    this.service.postAPI('insertProjectSubFeatures', formData).subscribe((res: any) => {
      if (res.success == true) {
        this.toastr.success(res.message)
        this.selectedSubFeatureIds = []
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

  isSelected(sub: any): boolean {
    return this.selectedSubFeatureIds.includes(sub.id);
  }

  // ✅ Toggle subfeature selection
  toggleSubFeatureSelection(sub: any, feature: any) {
    const index = this.selectedSubFeatureIds.indexOf(sub.id);
    if (index > -1) {
      this.selectedSubFeatureIds.splice(index, 1);
    } else {
      this.selectedSubFeatureIds.push(sub.id);
    }
  }

  // ✅ Toggle feature selection
  toggleFeatureSelection(feature: any) {
    const allSelected = this.isFeatureFullySelected(feature);
    feature.subFeatures.forEach((sub: { id: number; }) => {
      const index = this.selectedSubFeatureIds.indexOf(sub.id);
      if (allSelected && index > -1) {
        this.selectedSubFeatureIds.splice(index, 1);
      } else if (!allSelected && index === -1) {
        this.selectedSubFeatureIds.push(sub.id);
      }
    });
  }

  // ✅ All subfeatures selected
  isFeatureFullySelected(feature: any): boolean {
    return feature.subFeatures.every((sub: { id: number; }) => this.selectedSubFeatureIds.includes(sub.id));
  }

  // ✅ Some subfeatures selected (for indeterminate state)
  isFeatureIndeterminate(feature: any): boolean {
    const selectedCount = feature.subFeatures.filter((sub: { id: number; }) =>
      this.selectedSubFeatureIds.includes(sub.id)
    ).length;
    return selectedCount > 0 && selectedCount < feature.subFeatures.length;
  }

  // ✅ Display selected labels
  getSelectedLabels(): string[] {
    let labels: string[] = [];
    this.featuresSubFeaturesList.forEach(feature => {
      feature.subFeatures.forEach((sub: { id: number; subFeaturesName: string; }) => {
        if (this.selectedSubFeatureIds.includes(sub.id)) {
          labels.push(sub.subFeaturesName);
        }
      });
    });
    return labels;
  }

  getFormattedSelectedLabels(): string {
    const groupMap: { [feature: string]: string[] } = {};

    // Group selected subfeatures by feature
    this.featuresSubFeaturesList.forEach(feature => {
      const selectedSubs = feature.subFeatures
        .filter((sub: { id: number; }) => this.selectedSubFeatureIds.includes(sub.id))
        .map((sub: { subFeaturesName: any; }) => sub.subFeaturesName);

      if (selectedSubs.length) {
        groupMap[feature.featuresName] = selectedSubs;
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

      const subText =
        remainingSubs > 0
          ? `${visibleSubs.join(', ')}, +${remainingSubs} more`
          : visibleSubs.join(', ');

      return `${feature} (${subText})`;
    });

    return remainingFeatures > 0
      ? `${formatted.join(', ')}, +${remainingFeatures} more selected`
      : formatted.join(', ') || 'Please select';
  }
}
