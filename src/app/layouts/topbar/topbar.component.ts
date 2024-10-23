import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { AuthenticationService } from '../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../core/services/authfake.service';
import { CookieService } from 'ngx-cookie-service';
import { LanguageService } from '../../core/services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subscription, map } from 'rxjs';
import { changesLayout } from 'src/app/store/layouts/layout.actions';
import { getLayoutMode } from 'src/app/store/layouts/layout.selector';
import { RootReducerState } from 'src/app/store';
import { _User, User } from 'src/app/store/Authentication/auth.models';
import { ToastrService } from 'ngx-toastr';
import { logout } from 'src/app/store/Authentication/authentication.actions';
import { SocketService } from 'src/app/core/services/webSocket.service';
import { fetchMyNotificationlistData } from 'src/app/store/notification/notification.action';
import { selectDataNotification } from 'src/app/store/notification/notification-selector';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})

/**
 * Topbar component
 */
export class TopbarComponent implements OnInit {
  mode: any
  element: any;
  cookieValue: any;
  flagvalue: any;
  countryName: any;
  valueset: any;
  theme: any;
  layout: string;
  dataLayout$: Observable<string>;
  private currentUserSubject: BehaviorSubject<_User>;
  public currentUser: Observable<_User>;
  notifications: any[] = [];
  nbrNotif: number = 0 ;
  notifications$ : Observable<any>;
  notificationsSubscription: Subscription;
  private notificationsSubject = new BehaviorSubject<any[]>([]);



  // Define layoutMode as a property

  constructor(@Inject(DOCUMENT) private document: any, private router: Router, private authService: AuthenticationService,
    private authFackservice: AuthfakeauthenticationService,
    public languageService: LanguageService,
    public translate: TranslateService,
    public _cookiesService: CookieService, 
    public store: Store<RootReducerState>,
    private socketService: SocketService,
    
    public toastr:ToastrService) {
      this.listenForMessages();
      this.currentUserSubject = new BehaviorSubject<_User>(JSON.parse(localStorage.getItem('currentUser')));
      this.currentUser = this.currentUserSubject.asObservable();
      
      this.notifications$ = this.store.pipe(select(selectDataNotification));     
      
    
      }
     
  private listenForMessages() {
     this.socketService.messages$.subscribe(message => {
    // Update the notifications
        const currentNotifications = this.notificationsSubject.value;
        console.log(currentNotifications);
        this.notificationsSubject.next([...currentNotifications, message]);
        // Update the notification count
        this.nbrNotif = this.notificationsSubject.value.length;
        console.log('Total notifications:', this.nbrNotif);
  });  
}        
  public get currentUserValue(): _User {
      return this.currentUserSubject.value;
  }

    

  listLang: any = [
    { text: 'English', flag: 'assets/images/flags/us.jpg', lang: 'en' },
    { text: 'Arabic', flag: 'assets/images/flags/ar.jpg', lang: 'ar' },

  ];

  openMobileMenu: boolean;

  @Output() settingsButtonClicked = new EventEmitter();
  @Output() mobileMenuButtonClicked = new EventEmitter();

  ngOnInit() {
    
    this.store.dispatch(fetchMyNotificationlistData());
    this.notifications$.subscribe( (myNotif) => {
        this.notifications = myNotif;
        console.log('my notifications');
        console.log(this.notifications);
    });
    // this.initialAppState = initialState;
    this.store.select('layout').subscribe((data) => {
      this.theme = data.DATA_LAYOUT;
    })
    this.openMobileMenu = false;
    this.element = document.documentElement;

    this.cookieValue = this._cookiesService.get('lang');
    const val = this.listLang.filter(x => x.lang === this.cookieValue);
    this.countryName = val.map(element => element.text);
    if (val.length === 0) {
      if (this.flagvalue === undefined) { this.valueset = 'assets/images/flags/us.jpg'; }
    } else {
      this.flagvalue = val.map(element => element.flag);
    }
 
      
   
  }
   navigateToNotification(notification: any) {
    switch (notification.type) {

      case 'merchant-registration':
        this.router.navigate(['private/merchants/approve']); 
        break;
      case 'coupon-approval-request':
       this.router.navigate(['private/coupons/approve']); 
       break;
      case 'coupon-approved':
        this.router.navigate(['private/coupons']); 
        break;
      case 'gift-card-approval-request':
        this.router.navigate(['private/giftcards/approve']); 
        break;
      case 'store-approval-request':
        this.router.navigate(['private/store/approve']); 
        break;
      case 'store-approved':
        this.router.navigate(['private/stores']); 
        break;
      // Add other cases for different notification types
      default:
        console.log('Unknown notification type');
    }
   }

  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.cookieValue = lang;
    this.languageService.setLanguage(lang);
     
    
  }
  
  /**
   * Toggles the right sidebar
   */
  toggleRightSidebar() {
    this.settingsButtonClicked.emit();
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }
/**
   * Update Profile the user
   */
  updateProfile() {
   
    this.authFackservice.logout();

 }
  /**
   * Logout the user
   */
  logout() {
      this.store.dispatch(logout());
      

      
  }

  /**
   * Fullscreen method
   */
  fullscreen() {
    document.body.classList.toggle('fullscreen-enable');
    if (
      !document.fullscreenElement && !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen();
      } else if (this.element.mozRequestFullScreen) {
        /* Firefox */
        this.element.mozRequestFullScreen();
      } else if (this.element.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.element.webkitRequestFullscreen();
      } else if (this.element.msRequestFullscreen) {
        /* IE/Edge */
        this.element.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }

  changeLayout(layoutMode: string) {
    this.theme = layoutMode;
    this.store.dispatch(changesLayout({ layoutMode }));
    this.store.select(getLayoutMode).subscribe((layout) => {
      document.documentElement.setAttribute('data-layout', layout)
    })
  }
  ngOnDestroy(): void {
    if (this.notificationsSubscription) {
      this.notificationsSubscription.unsubscribe(); // Clean up subscription
    }  }

}