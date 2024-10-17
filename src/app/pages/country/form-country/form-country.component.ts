


  import { Component, Input, OnInit } from '@angular/core';
  import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
  import { ActivatedRoute, Router } from '@angular/router';
  
  import { select, Store } from '@ngrx/store';
  import { Subject, takeUntil } from 'rxjs';
  import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
  import { addCountrylist, getCountryById, updateCountrylist } from 'src/app/store/country/country.action';
  import { selectCountryById } from 'src/app/store/country/country-selector';
  
  
  @Component({
    selector: 'app-form-country',
    templateUrl: './form-country.component.html',
    styleUrl: './form-country.component.css'
  })
  export class FormCountryComponent implements OnInit {
    
    @Input() type: string;
    countryForm: UntypedFormGroup;
    private destroy$ = new Subject<void>();
    CountryFlagBase64 : string = null ;
    submitted: any = false;
    error: any = '';
    successmsg: any = false;
    fieldTextType!: boolean;
    imageURL: string | undefined;
    isEditing: boolean = false;
    flag: string = '';
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
  
        this.countryForm = this.formBuilder.group({
          id:[''],
          name: ['', Validators.required],
         // nameTrans: [''],
          phoneCode: ['', Validators.required ],
          flag:[''],
                     
        });
       }
    // set the currenr year
    year: number = new Date().getFullYear();
      
    ngOnInit() {
  
      const CountryId = this.route.snapshot.params['id'];
      console.log('Country ID from snapshot:', CountryId);
      if (CountryId) {
        // Dispatch action to retrieve the Country by ID
        this.store.dispatch(getCountryById({ CountryId }));
        
        // Subscribe to the selected Country from the Country
        this.store
          .pipe(select(selectCountryById(CountryId)), takeUntil(this.destroy$))
          .subscribe(Country => {
            if (Country) {
              console.log('Retrieved Country:', Country);
              this.flag = Country.flag;
              this.countryForm.patchValue(Country);
              this.isEditing = true;
              }
          });
      }
     
    }
    
    private formatDate(dateString: string): string {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0]; // Converts to YYYY-MM-DD format
    }
    onPhoneNumberChanged(phoneNumber: string) {
      console.log('PHONE NUMBER', phoneNumber);
      this.countryForm.get('phone').setValue(phoneNumber);
    }
  
    onSupervisorPhoneChanged(phoneNumber: string) {
      this.countryForm.get('supervisorPhone').setValue(phoneNumber);
    }
    // convenience getter for easy access to form fields
    get f() { return this.countryForm.controls; }
  
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
      console.log('Form status:', this.countryForm.status);
      console.log('Form errors:', this.countryForm.errors);
      if (this.countryForm.valid) {
        console.log('i am on onSubmit');
        console.log(this.countryForm.value);
        console.log('Form status:', this.countryForm.status);
        console.log('Form errors:', this.countryForm.errors);
              
        const newData = this.countryForm.value;
        if(this.CountryFlagBase64){
          newData.flag = this.CountryFlagBase64;
        }
        
        console.log(newData);
        if(!this.isEditing)
          {
            this.store.dispatch(addCountrylist({ newData }));          }
          else
          { 
            console.log('updating Country');

            if(!this.CountryFlagBase64){
              delete newData.flag;
            }
            this.store.dispatch(updateCountrylist({ updatedData: newData }));
          }
        
      } else {
        // Form is invalid, display error messages
        console.log('Form is invalid');
        this.countryForm.markAllAsTouched();
      }
    }
    
  
  async fileChange(event: any): Promise<string> {
    let fileList: any = (event.target as HTMLInputElement);
    let file: File = fileList.files[0];
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        reject(reader.error);
      };
      reader.readAsDataURL(file);
    });
  }
    /**
     * Upload Country Logo
     */
    async uploadCountryFlag(event: any){
      console.log('i am in Country Flag Upload');
      try {
        this.imageURL = await this.fileChange(event);
        document.querySelectorAll('#projectlogo-img').forEach((element: any) => {
          element.src = this.imageURL;
        });
        console.log(this.imageURL);
        //this.CountryForm.controls['CountryLogo'].setValue(imageURL);
         this.CountryFlagBase64 = this.imageURL;
      } catch (error: any) {
        console.error('Error reading file:', error);
      }
    }
   
 
  
    ngOnDestroy() {
      this.destroy$.next();
      this.destroy$.complete();
    }
    onCancel(){
      console.log('Form status:', this.countryForm.status);
      console.log('Form errors:', this.countryForm.errors);
      this.countryForm.reset();
      this.router.navigateByUrl('/private/countries');
    }
  
  }

