import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { selectNotificationById } from 'src/app/store/notification/notification-selector';
import { addNotificationlist, getNotificationById, updateNotificationlist } from 'src/app/store/notification/notification.action';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
//import { Bold, Essentials, Italic, Mention, Paragraph, Undo } from '@ckeditor';


@Component({
  selector: 'app-form-notification',
  templateUrl: './form-notification.component.html',
  styleUrl: './form-notification.component.css'
})
export class FormNotificationComponent implements OnInit {
  
  @Input() type: string;
  notifForm: UntypedFormGroup;
  private destroy$ = new Subject<void>();
  notificationlist$: Observable<any[]>;
  messageDesc: string = '';
  public Editor = ClassicEditor;
  // public config = {
  //   toolbar: [ 'undo', 'redo', '|', 'bold', 'italic' ],
  //   plugins: [
  //       Bold, Essentials, Italic, Mention, Paragraph, SlashCommand, Undo
  //   ]
  // }

  submitted: any = false;
  error: any = '';
  isEditing: boolean = false;
 
  
  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute, 
    private router: Router,
    public store: Store) {
      
      this.notifForm = this.formBuilder.group({
        id: [''],
        cronExpression:[''],
        title: ['', Validators.required],
        description: [''],
        user_id: [9]
        
      });
     }
  // set the currenr year
  year: number = new Date().getFullYear();
   


  ngOnInit() {
    

    const notifId = this.route.snapshot.params['id'];
    console.log('Notif ID from snapshot:', notifId);
    if (notifId) {
      // Dispatch action to retrieve the notif by ID
      this.store.dispatch(getNotificationById({ notificationId: notifId }));
      
      // Subscribe to the selected notif from the store
      this.store
        .pipe(select(selectNotificationById(notifId)), takeUntil(this.destroy$))
        .subscribe(Notif => {
          if (Notif) {
            console.log('Retrieved Notif:', Notif);
           
            this.notifForm.patchValue(Notif);
            this.isEditing = true;

          }
        });
    }
   
  }
parseToCronExpression(date : any): any{

  const parseDate = new Date(date);
  const mins = parseDate.getMinutes();
  const hours = parseDate.getHours();
  const day = parseDate.getDate();
  const month = parseDate.getMonth() + 1;
  const year = parseDate.getFullYear();
  const cronExp = `${mins} ${hours} ${day} ${month} ${year}`; 
  return cronExp;
}
  /**
   * On submit form
   */
  onSubmit() {
    console.log('Form status:', this.notifForm.status);
    console.log('Form errors:', this.notifForm.errors);
    if (this.notifForm.valid) {
      console.log('i am on onSubmit');
      console.log(this.notifForm.value);
      console.log('Form status:', this.notifForm.status);
      console.log('Form errors:', this.notifForm.errors);
          
      const newData = this.notifForm.value;
      
          if(!this.isEditing)
            {           
              const payload = this.notifForm.value;
              delete payload.id;

              const notificationData = {
                userId: "3",
                payload: {
                  title: payload.title,
                  description: payload.description,
                  cronExpression: this.parseToCronExpression(payload.cronExpression)
                }
              };
             
              console.log(notificationData);
              //Dispatch Action
              this.store.dispatch(addNotificationlist({ newData: notificationData}));
        }
        else
        {
          console.log('updating notif');
          this.store.dispatch(updateNotificationlist({ updatedData: newData }));
        }
    } else {
      // Form is invalid, display error messages
      console.log('Form is invalid');
      this.notifForm.markAllAsTouched();
    }
  }
  
  onEditorChange(event: any){
    this.messageDesc = event.editor.getData(); // Get the updated content
    console.log(this.messageDesc); // Check the updated content
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  onCancel(){
    console.log('Form status:', this.notifForm.status);
    console.log('Form errors:', this.notifForm.errors);
    this.notifForm.reset();
    this.router.navigateByUrl('/private/notifications');
  }

}