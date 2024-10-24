import { Component } from '@angular/core';

@Component({
  selector: 'app-view-store',
  templateUrl: './view-store.component.html',
  styleUrl: './view-store.component.css'
})
export class ViewStoreComponent {
  breadCrumbItems: Array<{}>;

  ngOnInit() {
    console.log('i am in view store');
    this.breadCrumbItems = [{ label: 'Stores' }, { label: 'View store', active: true }];
  }
}
