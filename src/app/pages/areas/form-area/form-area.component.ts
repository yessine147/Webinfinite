import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { addArealist,  getAreaById, updateArealist } from 'src/app/store/area/area.action';
import { selectAreaById } from 'src/app/store/area/area-selector';
import { fetchCountrylistData } from 'src/app/store/country/country.action';
import { selectDataCountry } from 'src/app/store/country/country-selector';



@Component({
  selector: 'app-form-area',
  templateUrl: './form-area.component.html',
  styleUrl: './form-area.component.css'
})

export class FormAreaComponent implements OnInit {
  
  @Input() type: string;
  areaForm: UntypedFormGroup;
  private destroy$ = new Subject<void>();
  areaFlagBase64 : string;
  submitted: any = false;
  error: any = '';
  successmsg: any = false;
  fieldTextType!: boolean;
  imageURL: string | undefined;
  isEditing: boolean = false;
  countries : any[];
  // file upload
  public dropzoneConfig: DropzoneConfigInterface = {
    clickable: true,
    addRemoveLinks: true,
    previewsContainer: false
  };
  
  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute, 
    private router: Router,
    public store: Store) {
      
      this.store.dispatch(fetchCountrylistData({ page: 1, itemsPerPage: 10, status:'active' }));
      this.store.select(selectDataCountry).subscribe(
        countries => {
          this.countries = countries
        })

      this.areaForm = this.formBuilder.group({
        id:[''],
        name: ['', Validators.required],
       // nameTrans: [''],
        country_id:['', Validators.required]
                   
      });
     }
  // set the currenr year
  year: number = new Date().getFullYear();
    
  ngOnInit() {

   

    const AreaId = this.route.snapshot.params['id'];
    console.log('Area ID from snapshot:', AreaId);
    if (AreaId) {
      // Dispatch action to retrieve the Area by ID
      this.store.dispatch(getAreaById({ AreaId }));
      
      // Subscribe to the selected Area from the Area
      this.store
        .pipe(select(selectAreaById(AreaId)), takeUntil(this.destroy$))
        .subscribe(Area => {
          if (Area) {
            console.log('Retrieved Area:', Area);
            this.areaForm.patchValue(Area);
            this.isEditing = true;
            }
        });
    }
   
  }
   
  // convenience getter for easy access to form fields
  get f() { return this.areaForm.controls; }

  // swiper config
  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: true
  };

  /**
   * On submit form
   */
  onSubmit() {
    console.log('Form status:', this.areaForm.status);
    console.log('Form errors:', this.areaForm.errors);
    if (this.areaForm.valid) {
      console.log('i am on onSubmit');
      console.log(this.areaForm.value);
      console.log('Form status:', this.areaForm.status);
      console.log('Form errors:', this.areaForm.errors);
            
      const newData = this.areaForm.value;
    
      console.log(newData);
      if(!this.isEditing)
        { delete newData.id;
          console.log('Adding Area');
          this.store.dispatch(addArealist({ newData }));          }
        else
        { 
          console.log('updating Area');
          this.store.dispatch(updateArealist({ updatedData: newData }));
        }
      
    } else {
      // Form is invalid, display error messages
      console.log('Form is invalid');
      this.areaForm.markAllAsTouched();
    }
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  onCancel(){
    console.log('Form status:', this.areaForm.status);
    console.log('Form errors:', this.areaForm.errors);
    this.areaForm.reset();
    this.router.navigateByUrl('/private/areas');
  }

}

