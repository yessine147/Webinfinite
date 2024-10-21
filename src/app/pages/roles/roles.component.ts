import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Modules, Permission } from 'src/app/store/Role/role.models';
import { selectDataRole } from 'src/app/store/Role/role-selector';
import { deleteRolelist, fetchRolelistData, updateRolelist } from 'src/app/store/Role/role.actions';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent  implements OnInit{
  
  // bread crumb items
  breadCrumbItems: Array<{}>;
  public Modules = Modules;
  public Permission = Permission;

  roleList$: Observable<any[]>;
  isDropdownOpen : boolean = false;
  filteredArray: any[] = [];
  originalArray: any[] = [];

  itemPerPage: number = 10;
  currentPage : number = 1;

  columns : any[]= [
    { property: 'name', label: 'Title' },
    { property: 'createdAt', label: 'CreatedAt' },
    { property: 'status', label: 'Status' },
  ];

  constructor(private store: Store) {
      
      this.roleList$ = this.store.pipe(select(selectDataRole)); // Observing the Role list from Role
  }

  ngOnInit() {
          
        this.store.dispatch(fetchRolelistData({ page: this.currentPage, itemsPerPage: this.itemPerPage }));
        this.roleList$.subscribe(data => {
        this.originalArray = data; // Role the full Role list
        this.filteredArray = [...this.originalArray];
        document.getElementById('elmLoader')?.classList.add('d-none');
        console.log('Finish get Role list');
        console.log(this.filteredArray);
        });
   }

 
  // pagechanged
  onPageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    console.log(event.page);
    this.store.dispatch(fetchRolelistData({ page: this.currentPage, itemsPerPage: this.itemPerPage }));
    
  }

  // Delete Role
  onDelete(id: any) {
    this.store.dispatch(deleteRolelist({ RoleId: id }));
  }

 
  onChangeEvent( event: any) {
    const newStatus = event.checked ? 'active' : 'inactive'; 
    console.log('Role ID:', event.data.id, 'New Status:', newStatus);
    event.data.status = newStatus;
    this.store.dispatch(updateRolelist({ updatedData: event.data }));
  }


}
