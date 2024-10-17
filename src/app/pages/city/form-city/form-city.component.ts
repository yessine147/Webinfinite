import { Component, Input, OnInit } from '@angular/core';
  import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
  import { ActivatedRoute, Router } from '@angular/router';
  
  import { select, Store } from '@ngrx/store';
  import {  Subject, takeUntil } from 'rxjs';
  import { fetchCountrylistData } from 'src/app/store/country/country.action';
  import { selectDataCountry } from 'src/app/store/country/country-selector';
  import { selectDataArea } from 'src/app/store/area/area-selector';

import { fetchArealistData } from 'src/app/store/area/area.action';
import { selectCityById } from 'src/app/store/City/city-selector';
import { addCitylist, getCityById, updateCitylist } from 'src/app/store/City/city.action';
  
@Component({
  selector: 'app-form-city',
  templateUrl: './form-city.component.html',
  styleUrl: './form-city.component.css'
})
export class FormCityComponent  implements OnInit {
    
    @Input() type: string;
    cityForm: UntypedFormGroup;
    private destroy$ = new Subject<void>();
    submitted: any = false;
    error: any = '';
    successmsg: any = false;
    fieldTextType!: boolean;
    imageURL: string | undefined;
    isEditing: boolean = false;
    countries : any[];
    areas : any[];
    filteredAreas: any[];
    
    
    constructor(
      private formBuilder: UntypedFormBuilder,
      private route: ActivatedRoute, 
      private router: Router,
      public store: Store) {
        
        this.store.dispatch(fetchCountrylistData({ page: 1, itemsPerPage: 10, status:'active' }));
        this.store.select(selectDataCountry).subscribe(
          countries => {
            this.countries = countries
          });

        this.store.dispatch(fetchArealistData({ page: 1, itemsPerPage: 10, status:'active' }));
        this.store.select(selectDataArea).subscribe(
            areas => {
              this.areas = areas
            })
        this.cityForm = this.formBuilder.group({
          id:[''],
          name: ['', Validators.required],
          //nameTrans: [''],
          country_id:['', Validators.required],
          area_id:['', Validators.required],
          longitude: ['long'],
          latitude: ['lat']
                     
        });
       }
    // set the currenr year
    year: number = new Date().getFullYear();
      
    ngOnInit() {
  
     
  
      const CityId = this.route.snapshot.params['id'];
      console.log('city ID from snapshot:', CityId);
      if (CityId) {
        // Dispatch action to retrieve the city by ID
        this.store.dispatch(getCityById({ CityId }));
        
        // Subscribe to the selected city from the city
        this.store
          .pipe(select(selectCityById(CityId)), takeUntil(this.destroy$))
          .subscribe(city => {
            if (city) {
              console.log('Retrieved city:', city);
              this.filteredAreas = this.areas;
              this.cityForm.controls['country_id'].setValue(city.area.country_id);
              this.cityForm.patchValue(city);
              this.isEditing = true;
              }
          });
      }
     
    }
     
   
    /**
     * On submit form
     */
    onSubmit() {
      console.log('Form status:', this.cityForm.status);
      console.log('Form errors:', this.cityForm.errors);
      if (this.cityForm.valid) {
        console.log('i am on onSubmit');
        console.log(this.cityForm.value);
        console.log('Form status:', this.cityForm.status);
        console.log('Form errors:', this.cityForm.errors);
              
        const newData = this.cityForm.value;
      
        console.log(newData);
        if(!this.isEditing)
          { delete newData.id;
            delete newData.country_id;
            delete newData.nameTrans;
            console.log('Adding city');
            this.store.dispatch(addCitylist({ newData }));          }
          else
          { 
            console.log('updating city');
            this.store.dispatch(updateCitylist({ updatedData: newData }));
          }
        
      } else {
        // Form is invalid, display error messages
        console.log('Form is invalid');
        this.cityForm.markAllAsTouched();
      }
    }
    onChangeCountrySelection(event : any){
      const country = event.target.value;
      console.log(country);
      if(country){
        console.log(this.areas);
        this.filteredAreas = this.areas.filter(area => area.country_id == country);
        console.log(this.filteredAreas);
      }
      else
      {
        this.filteredAreas = [];

      }
      
    }
    ngOnDestroy() {
      this.destroy$.next();
      this.destroy$.complete();
    }
    onCancel(){
      console.log('Form status:', this.cityForm.status);
      console.log('Form errors:', this.cityForm.errors);
      this.cityForm.reset();
      this.router.navigateByUrl('/private/cities');
    }
  
  }
  
  
