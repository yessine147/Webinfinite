

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';


import { Store } from '@ngrx/store';

import { PageChangedEvent } from 'ngx-bootstrap/pagination';


import { ToastrService } from 'ngx-toastr';
import { Modules, Permission } from 'src/app/store/Role/role.models';
import { selectApprovalData, selectData } from 'src/app/store/coupon/coupon-selector';
import { fetchCouponlistData, updateCouponlist } from 'src/app/store/coupon/coupon.action';


@Component({
  selector: 'app-coupon-approval',
  templateUrl: './coupon-approval.component.html',
  styleUrl: './coupon-approval.component.css'
})
export class CouponApprovalComponent implements OnInit {
// bread crumb items
breadCrumbItems: Array<{}>;
public Modules = Modules;
public Permission = Permission;

couponApprovalList$: Observable<any[]>;
isDropdownOpen : boolean = false;
filteredArray: any[] = [];
originalArray: any[] = [];

itemPerPage: number = 10;
currentPage : number = 1;

columns : any[]= [
  { property: 'name', label: 'Title' },
  { property: 'merchant.merchantName', label: 'Merchant_Name' },
  { property: 'createdAt', label: 'Request_Date' },
  { property: 'status', label: 'Status' },


];
  constructor(public toastr:ToastrService,  public store: Store) {
   
    this.couponApprovalList$ = this.store.select(selectApprovalData);
    this.couponApprovalList$.subscribe(
      data => this.originalArray = data );
  }

  ngOnInit() {
  
     
      setTimeout(() => {
        this.store.dispatch(fetchCouponlistData({ page: 1, itemsPerPage: 10, status:'pending' }));
        document.getElementById('elmLoader')?.classList.add('d-none')
      }, 1200);
    }
     
  
   // pagechanged
   onPageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    this.store.dispatch(fetchCouponlistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, status:'pending' }));
    
  }

  onApproveEvent( event: any) {
    console.log('Coupon ID:', event.id, 'New Status:', event.status);
    this.store.dispatch(updateCouponlist({ updatedData: event }));
  }


 

}
 

 