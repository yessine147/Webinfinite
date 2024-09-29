
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, take } from 'rxjs';
import { BsModalService, BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { select, Store } from '@ngrx/store';
// import { adduserlist, deleteuserlist, fetchuserlistData, updateuserlist } from 'src/app/store/UserList/userlist.action';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { addMerchantlist, deleteMerchantlist, fetchMerchantlistData, updateMerchantlist } from 'src/app/store/merchantsList/merchantlist1.action';
import { selectData } from 'src/app/store/merchantsList/merchantlist1-selector';
import { ToastrService } from 'ngx-toastr';
import { Modules, Permission } from 'src/app/store/Role/role.models';

/**
 * Merchants list component
 */

@Component({
  selector: 'app-merchant-list',
  templateUrl: './merchant-list.component.html',
  styleUrl: './merchant-list.component.css'
})
export class MerchantListComponent implements OnInit {



  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any
  merchantList$: Observable<any[]>;
  // Table data
  total: Observable<number>;
  createContactForm!: UntypedFormGroup;
  submitted = false;
  contacts: any;
  files: File[] = [];
  endItem: any;
  viewType: string;
  isDropdownOpen : boolean = false;
  filteredArray: any[] = [];
  originalArray: any[] = [];

  @ViewChild('newContactModal', { static: false }) newContactModal?: ModalDirective;
  @ViewChild('removeItemModal', { static: false }) removeItemModal?: ModalDirective;
  deleteId: any;
  returnedArray: Observable<any[]>;
  
  public Modules = Modules;
  public Permission = Permission;


  constructor(
    private modalService: BsModalService,
    public toastr:ToastrService,
    private formBuilder: UntypedFormBuilder, 
    public store: Store) {
      
      this.merchantList$ = this.store.pipe(select(selectData)); // Observing the merchant list from store

  }

  ngOnInit() {
      
      
        this.store.dispatch(fetchMerchantlistData());
        this.merchantList$.subscribe(data => {
        this.originalArray = data; // Store the full merchant list
        this.filteredArray = [...this.originalArray];
        
        document.getElementById('elmLoader')?.classList.add('d-none');
        console.log('Finish get merchant list');
        console.log(this.filteredArray);
    
        });
     

   
  }

  // File Upload
  imageURL: string | undefined;
  fileChange(event: any) {
    let fileList: any = (event.target as HTMLInputElement);
    let file: File = fileList.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
      document.querySelectorAll('#member-img').forEach((element: any) => {
        element.src = this.imageURL;
      });
      this.createContactForm.controls['profile'].setValue(this.imageURL);
    }
    reader.readAsDataURL(file)
  }


  // fiter job
  searchJob() {
    if (this.term) {
      this.filteredArray = this.originalArray.filter((data: any) =>
        data.username.toLowerCase().includes(this.term.toLowerCase())
      );
    } else {
      this.filteredArray = [...this.originalArray]; // Reset the filter
    }
  }
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  applyFilter(filterType: string) {
    this.isDropdownOpen = false;
    if (filterType === 'All') {
      this.filteredArray = [...this.originalArray]; // Show all items
    } else if (filterType && this.originalArray) {
      console.log('i am in filter section');
      this.filteredArray = this.groupBy(this.originalArray, filterType.toLowerCase());
      console.log(this.filteredArray);
    }
  }

 

// Group data by the selected criterion
groupBy(data: any[], criterion: string) {
  console.log('i am in group by');
  const grouped = data.reduce((result, item) => {
    const key = item[criterion];
    if (key !== undefined) {
      if (!result[key]) {
        result[key] = [];
      }
      result[key].push(item);
    }
    return result;
  }, {} as { [key: string]: any[] });

  // Convert grouped object into a flattened array with grouping info
  const flattened = Object.values(grouped).flat();

  return flattened;

}

  printData(){

  }
  downloadData(){

  }
  addUser() {
    this.viewType = "add";
    this.submitted = false;
    this.createContactForm.reset(); // Reset form for new user
    this.newContactModal?.show();
    this.createContactForm.enable();

    // Set modal title and button for adding
    var modelTitle = document.querySelector('.modal-title') as HTMLAreaElement;
    modelTitle.innerHTML = 'Add New Contact';

    var updateBtn = document.getElementById('addContact-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Add";

    var passwordInput = document.getElementById('pwdField') as HTMLAreaElement;
    passwordInput.hidden = false; // Show the password field for adding new user
}

viewUser(id: any) {
  this.viewType = "view";
  this.submitted = false;
  this.newContactModal?.show()
  
  var modelTitle = document.querySelector('.modal-title') as HTMLAreaElement;
  modelTitle.innerHTML = 'View User';
  
  var okBtn = document.getElementById('addContact-btn') as HTMLAreaElement;
  okBtn.innerHTML = "Ok";

  var cancelBtn = document.getElementById('cancel-btn') as HTMLAreaElement;
  cancelBtn.hidden = true;

  var passwordInput = document.getElementById('pwdField') as HTMLAreaElement;
  passwordInput.hidden = true;
  
  this.merchantList$.pipe(take(1)).subscribe(merchantList => {
  const user = merchantList.find(merchant => merchant._id === id);

    if (user) {
        console.log("The user to be shown", user);
        this.createContactForm.patchValue(user);
        this.createContactForm.patchValue({
          _id: user._id
        });
        this.createContactForm.disable();

    } else {
        console.error('User not found');
    }
});
}
 
 
  resetModal() {
    this.createContactForm.reset();
    var modelTitle = document.querySelector('.modal-title') as HTMLAreaElement;
    modelTitle.innerHTML = '';
    var updateBtn = document.getElementById('addContact-btn') as HTMLAreaElement;
    updateBtn.innerHTML = '';
    var passwordInput = document.getElementById('pwdField') as HTMLAreaElement;
    passwordInput.hidden = false; // Show by default
}

  // pagechanged
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    this.endItem = event.page * event.itemsPerPage;
    //this.merchantList$ = this.returnedArray.slice(startItem, this.endItem);
   // this.merchantList$ = this.returnedArray.sort((a: any, b: any) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime()).slice(0,10);

  }

  // Disable User
  disableMerchant(id: any) {
    this.deleteId = id;
    console.log('the id of the user to be deleted'+this.deleteId);
    this.removeItemModal?.show();
  }

  confirmDelete() {
    this.store.dispatch(deleteMerchantlist({ userId: this.deleteId }));
    this.removeItemModal?.hide();
  }
  onChangeEvent(data: any, event: any) {
    const newStatus = event.checked ? 'active' : 'inactive'; 
    console.log('Merchant ID:', data.id, 'New Status:', newStatus);
    data.user.status = newStatus;
    this.store.dispatch(updateMerchantlist({ updatedData: data }));

   
  }


}
