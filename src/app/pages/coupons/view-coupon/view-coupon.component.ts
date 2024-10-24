import { Component } from '@angular/core';

@Component({
  selector: 'app-view-coupon',
  templateUrl: './view-coupon.component.html',
  styleUrl: './view-coupon.component.css'
})
export class ViewCouponComponent {
  breadCrumbItems: Array<{}>;

  ngOnInit() {
    console.log('i am in view coupon');
    this.breadCrumbItems = [{ label: 'Coupons' }, { label: 'View coupon', active: true }];
  }
}
