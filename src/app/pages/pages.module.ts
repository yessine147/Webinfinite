import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AlertModule } from 'ngx-bootstrap/alert';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FullCalendarModule } from '@fullcalendar/angular';
import { SimplebarAngularModule } from 'simplebar-angular';
import { LightboxModule } from 'ngx-lightbox';
import { WidgetModule } from '../shared/widget/widget.module';
import { UIModule } from '../shared/ui/ui.module';

// Emoji Picker
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { PagesRoutingModule } from './pages-routing.module';
import { DashboardsModule } from './dashboards/dashboards.module';
import { EcommerceModule } from './ecommerce/ecommerce.module';
import { CryptoModule } from './crypto/crypto.module';
import { EmailModule } from './email/email.module';
import { InvoicesModule } from './invoices/invoices.module';
import { ContactsModule } from './contacts/contacts.module';
import { UtilityModule } from './utility/utility.module';
import { UiModule } from './ui/ui.module';
import { FormModule } from './form/form.module';

import { ChartModule } from './chart/chart.module';
import { CalendarComponent } from './calendar/calendar.component';
import { MapsModule } from './maps/maps.module';
import { HttpClientModule } from '@angular/common/http';
import { ChatComponent } from './chat/chat.component';

import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../core/services/language.service';
import { CreateCityComponent } from './city/create-city/create-city.component';
import { EditCityComponent } from './city/edit-city/edit-city.component';
import { FormCityComponent } from './city/form-city/form-city.component';
import { CityModule } from './city/city.module';

@NgModule({
  declarations: [CalendarComponent, ChatComponent, CreateCityComponent, EditCityComponent, FormCityComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    PagesRoutingModule,
    NgApexchartsModule,
    ReactiveFormsModule,
    DashboardsModule,
    CryptoModule,
    EcommerceModule,
    EmailModule,
    InvoicesModule,
    HttpClientModule,
    UIModule,
    ContactsModule,
    UtilityModule,
    UiModule,
    FormModule,
    ChartModule,
    WidgetModule,
    MapsModule,
    CityModule,
    FullCalendarModule,
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    CollapseModule.forRoot(),
    AlertModule.forRoot(),
    SimplebarAngularModule,
    LightboxModule,
    PickerModule
  ],
  providers: [LanguageService]

})
export class PagesModule { }
