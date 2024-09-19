import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { environment } from '../environments/environment';

// Swiper Slider
import { SlickCarouselModule } from 'ngx-slick-carousel';
// bootstrap component
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ToastrModule } from 'ngx-toastr';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { SharedModule } from './cyptolanding/shared/shared.module';

// Store
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
// Page Route
import { ExtrapagesModule } from './extrapages/extrapages.module';
import { LayoutsModule } from './layouts/layouts.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CyptolandingComponent } from './cyptolanding/cyptolanding.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Auth
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { ErrorInterceptor } from './core/helpers/error.interceptor';
import { JwtInterceptor } from './core/helpers/jwt.interceptor';
import { FilemanagerEffects } from './store/filemanager/filemanager.effects';
import { rootReducer } from './store';
import { OrderEffects } from './store/orders/order.effects';
import { AuthenticationEffects } from './store/Authentication/authentication.effects';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { CartEffects } from './store/Cart/cart.effects';
import { ProjectEffects } from './store/ProjectsData/project.effects';
import { usersEffects } from './store/UserGrid/user.effects';
import { userslistEffects } from './store/UserList/userlist.effect';
import { JoblistEffects } from './store/Job/job.effects';
import { CandidateEffects } from './store/Candidate/candidate.effects';
import { InvoiceDataEffects } from './store/Invoices/invoice.effects';
import { ChatEffects } from './store/Chat/chat.effect';
import { tasklistEffects } from './store/Tasks/tasks.effect';
import { OrdersEffects } from './store/Crypto/crypto.effects';
import { CustomerEffects } from './store/customer/customer.effects';
import { MailEffects } from './store/Email/email.effects';
import { MerchantsModule } from './pages/merchants/merchants.module';
import { MerchantslistEffects } from './store/merchants/merchantlist.effect';
import { MerchantslistEffects1 } from './store/merchantsList/merchantlist1.effect';
import { CouponsModule } from './pages/coupons/coupons.module';
import { CouponslistEffects } from './store/coupon/coupon.effect';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';




export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    CyptolandingComponent
  ],
  imports: [
    
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    LayoutsModule,
    MerchantsModule,
    CouponsModule,
    AppRoutingModule,
    ExtrapagesModule,
    AccordionModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    SharedModule,
    ScrollToModule.forRoot(),
    SlickCarouselModule,
    ToastrModule.forRoot(),
    StoreModule.forRoot(rootReducer),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
    EffectsModule.forRoot([
      FilemanagerEffects,
      OrderEffects,
      AuthenticationEffects,
      CartEffects,
      ProjectEffects,
      usersEffects,
      userslistEffects,
      MerchantslistEffects,
      CouponslistEffects,
      MerchantslistEffects1,
      JoblistEffects,
      CandidateEffects,
      InvoiceDataEffects,
      ChatEffects,
      tasklistEffects,
      OrdersEffects,
      CustomerEffects,
      MailEffects
    ]),
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    provideAnimationsAsync('noop'),
    //{ provide: HTTP_INTERCEPTORS, useClass: FakeBackendInterceptor, multi: true },
  ],
})
export class AppModule { }
