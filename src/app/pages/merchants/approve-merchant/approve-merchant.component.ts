
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { BsModalService, BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';

import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Modules, Permission } from 'src/app/store/Role/role.models';
import { fetchMerchantlistData, updateMerchantlist } from 'src/app/store/merchantsList/merchantlist1.action';
import { selectDataMerchant } from 'src/app/store/merchantsList/merchantlist1-selector';

@Component({
  selector: 'app-approve-merchant',
  templateUrl: './approve-merchant.component.html',
  styleUrl: './approve-merchant.component.css',
  providers: [DatePipe]
})
export class ApproveMerchantComponent implements OnInit {

// bread crumb items
breadCrumbItems: Array<{}>;
public Modules = Modules;
public Permission = Permission;

merchantApprovalList$: Observable<any[]>;
isDropdownOpen : boolean = false;
filteredArray: any[] = [];
originalArray: any[] = [];

itemPerPage: number = 10;
currentPage : number = 1;

columns : any[]= [
  { property: 'merchantName', label: 'Merchant Name' },
  { property: 'merchant.user.email', label: 'Email' },
  { property: 'createdAt', label: 'Request Date' },
  { property: 'status', label: 'Status' },
];
  constructor(public toastr:ToastrService,  public store: Store) {
   
    this.merchantApprovalList$ = this.store.select(selectDataMerchant);
  }

  ngOnInit() {
  
     
      setTimeout(() => {
        this.store.dispatch(fetchMerchantlistData({ page: 1, itemsPerPage: 10 , status: 'pending'}));
        document.getElementById('elmLoader')?.classList.add('d-none')
      }, 1200);
    }
     
  
   // pagechanged
   onPageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    this.store.dispatch(fetchMerchantlistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, status:'pending' }));
    
  }

  onApproveEvent( event: any) {
    console.log('Coupon ID:', event.id, 'New Status:', event.status);
    this.store.dispatch(updateMerchantlist({ updatedData: event }));
  }


 
}