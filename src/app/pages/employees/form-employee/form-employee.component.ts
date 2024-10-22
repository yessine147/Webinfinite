import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { selectDataArea } from 'src/app/store/area/area-selector';
import { fetchArealistData } from 'src/app/store/area/area.action';
import { selectDataCity } from 'src/app/store/City/city-selector';
import { fetchCitylistData } from 'src/app/store/City/city.action';
import { selectDataCountry } from 'src/app/store/country/country-selector';
import { fetchCountrylistData } from 'src/app/store/country/country.action';
import { selectEmployeeById } from 'src/app/store/employee/employee-selector';
import { addEmployeelist, getEmployeeById, updateEmployeelist } from 'src/app/store/employee/employee.action';
import { selectDataRole } from 'src/app/store/Role/role-selector';
import { fetchRolelistData } from 'src/app/store/Role/role.actions';
import { Modules, Permission } from 'src/app/store/Role/role.models';

@Component({
  selector: 'app-form-employee',
  templateUrl: './form-employee.component.html',
  styleUrl: './form-employee.component.css'
})
export class FormEmployeeComponent implements OnInit{
  
  @Input() type: string;
  employeeForm: UntypedFormGroup;
  isEditing: boolean = false;
  isCollapsed: boolean;
  private destroy$ = new Subject<void>();
  public firstColleaps:boolean = false;
  public secondColleaps:boolean = false;
  public bothColleaps:boolean = false;

  isFirstOpen:boolean = true;
  banks : any[] = [{id: '1', name:'BIAT'},{id: '2', name:'BT'}];
  
  
  countrylist: any[] = [];
  arealist$:  Observable<any[]>  ;
  citylist$:  Observable<any[]> ;
  rolelist$:  Observable<any[]> ;
  selectedRole : any = null;

  filteredAreas :  any[] = [];
  filteredCities:  any[] = [];

  public Permission: Permission;
  public Module: Modules;

moduleKeys = Object.keys(Modules).filter(key => isNaN(Number(key))); // Get the module names
permissionKeys = Object.keys(Permission).filter(key => isNaN(Number(key))); // Get the permission names




  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store){

      this.store.dispatch(fetchCountrylistData({page: 1, itemsPerPage: 10, status: 'active' }));
      this.store.dispatch(fetchArealistData({page: 1, itemsPerPage: 10, status: 'active' }));
      this.store.dispatch(fetchCitylistData({page: 1, itemsPerPage: 10, status: 'active' }));
      this.store.dispatch(fetchRolelistData({page: 1, itemsPerPage: 10, status: 'active' }));

      
      this.employeeForm = this.formBuilder.group({
        id: [''],
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        phone:['',Validators.required], //Validators.pattern(/^\d{3}-\d{3}-\d{4}$/)*/],
        country_id:[''],
        city_id:[''],
        area_id:[''], 
        bankAccountNumber: [''],
        bankName:[''],
        role_id:['']
  
      });
    }
  
  
  ngOnInit() {
   
    this.store.select(selectDataCountry).subscribe(
      (data)  => {
        this.countrylist = data;
    });
    this.arealist$ = this.store.select(selectDataArea);
    this.citylist$ = this.store.select(selectDataCity);
    this.rolelist$ = this.store.select(selectDataRole);

    
    const employeeId = this.route.snapshot.params['id'];
    console.log('employee ID from snapshot:', employeeId);
    if (employeeId) {
      // Dispatch action to retrieve the employee by ID
      this.store.dispatch(getEmployeeById({ employeeId }));
      
      // Subscribe to the selected employee from the store
      this.store
        .pipe(select(selectEmployeeById(employeeId)), takeUntil(this.destroy$))
        .subscribe(employee => {
          if (employee) {
            console.log('Retrieved employee:', employee);
            // Patch the form with employee data
          
            this.employeeForm.patchValue(employee);
          
            this.isEditing = true;

          }
        });
    }
   
    
  }
  onChangeCountrySelection(event: any){
    const country = event.target.value;
    console.log(country);
    if(country){
      this.arealist$.subscribe(
        areas => 
          this.filteredAreas = areas.filter(c =>c.country_id == country )
      );
    }
    else{
      this.filteredAreas = [];
    }
    
  }
  onChangeAreaSelection(event: any){
    const area = event.target.value;
    console.log(area);
    if(area){
      this.citylist$.subscribe(
        cities => 
          this.filteredCities = cities.filter(c =>c.area_id == area )
      );
    }
    else{
      this.filteredCities = [];
    }
    
  }
  onChangeRoleSelection(event: any){
    const role = event.target.value;
    console.log(role);
    if(role){
      this.rolelist$.subscribe(
        (data)=>{
          this.selectedRole = data.find(r => r.id == role);
        });

    }
  }



  onSubmit() {
    console.log('Form status:', this.employeeForm.status);
    console.log('Form errors:', this.employeeForm.errors);
    if (this.employeeForm.valid) {
      console.log('i am on onSubmit');
      console.log(this.employeeForm.value);
      console.log('Form status:', this.employeeForm.status);
      console.log('Form errors:', this.employeeForm.errors);
      
      
      const newData = this.employeeForm.value;
      console.log(newData);
      if(!this.isEditing)
        {
            delete newData.id;
            delete newData.role;
            this.store.dispatch(addEmployeelist({ newData }));
        }
        else{
          delete newData.password;
          this.store.dispatch(updateEmployeelist({ updatedData: newData }));
  
        }
      //Dispatch Action
      
    } 
    else 
    {
      // Form is invalid, display error messages
      console.log('Form is invalid');
      this.employeeForm.markAllAsTouched();
    }
  }
  onPhoneNumberChanged(phoneNumber: string) {
    this.employeeForm.get('phone').setValue(phoneNumber);
  }




hasPermission(module: string, permission: string): boolean {
  const moduleEnum = Modules[module as keyof typeof Modules];
  const permissionEnum = Permission[permission as keyof typeof Permission];
  if(this.selectedRole){
    const claim = this.selectedRole.claims.find((claim) => claim.claimType === moduleEnum);
    return claim ? claim.claimValue.includes(permissionEnum) : false;
  }
  return false;
}

togglePermission(module: string, permission: string, event: any): void {
  const moduleEnum = this.Module[module as keyof typeof Modules];
  const permissionEnum = this.Permission[permission as keyof typeof Permission];

  const claim = this.selectedRole.claims.find((claim) => claim.claimType === moduleEnum);
  if (claim) {
    if (event.target.checked) {
      // Add the permission
      claim.claimValue.push(permissionEnum);
    } else {
      // Remove the permission
      claim.claimValue = claim.claimValue.filter((perm) => perm !== permissionEnum);
    }
  } else {
    // If there's no claim for this module, create one and add the permission
    this.selectedRole.claims.push({
      claimType: moduleEnum,
      claimValue: [permissionEnum],
    });
  }
}





  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  onCancel(){
    this.employeeForm.reset();
    this.router.navigateByUrl('/private/employees');
  }

}
