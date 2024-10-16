

import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import { Store } from '@ngrx/store';

import { PageChangedEvent } from 'ngx-bootstrap/pagination';

import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Modules, Permission } from 'src/app/store/Role/role.models';
import { selectApprovalData, selectData } from 'src/app/store/coupon/coupon-selector';
import { fetchCouponlistData, updateCouponlist, updateCouponStatus } from 'src/app/store/coupon/coupon.action';
import { Status } from '../../../store/Role/role.models';


@Component({
  selector: 'app-coupon-approval',
  templateUrl: './coupon-approval.component.html',
  styleUrl: './coupon-approval.component.css'
})
export class CouponApprovalComponent implements OnInit {


  public Modules = Modules;
  public Permission = Permission;
  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any
  merchantApprovalList: any

  couponApprovalList$: Observable<any[]>;

  // Table data
  total: Observable<number>;
  
  endItem: any
  isEmpty: boolean = false;


  returnedArray: any

  constructor(public toastr:ToastrService,  public store: Store) {
   
    this.couponApprovalList$ = this.store.select(selectApprovalData);
  }

  ngOnInit() {
    //this.breadCrumbItems = [{ label: 'Merchants' }, { label: 'Merchants Approval List', active: true }];
  
     
      setTimeout(() => {
        this.store.dispatch(fetchCouponlistData({ page: 1, itemsPerPage: 10 }));
        this.store.select(selectData).subscribe(data => {
          this.returnedArray =  data.filter((data)=> data.status === 'pending');
          
        })
        document.getElementById('elmLoader')?.classList.add('d-none')
      }, 1200);
    }
      
      
  

  // filter Approval Requests
  searchRequest() {
    if (this.term) {
      this.merchantApprovalList = this.returnedArray.filter((data: any) => {
        return data.username.toLowerCase().includes(this.term.toLowerCase())
      })
    } else {
      this.merchantApprovalList = this.returnedArray
    }
  }

  
  // pagechanged
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    this.endItem = event.page * event.itemsPerPage;
    this.merchantApprovalList = this.returnedArray.slice(startItem, this.endItem);
  }

  UpdateItem(item: any, action: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: action == 'approve' ?  'Yes, Approve it!':  'Yes, Decline it!'
      
    }).then(result => {
      if (result.isConfirmed) {
        // Dispatch the action to update coupon status
        item.status = action == 'approve' ?  'active':  'refused';
        const newData = {id: item.id, status: item.status}
        this.store.dispatch(updateCouponlist({updatedData: newData}));
        
        // // Show success message
        // Swal.fire('Approved!', 'The merchant has been approved.', 'success').then(() => {
        //   // You can also update the item status in the list if needed
          
        // });
      }
    });
  }


 

}