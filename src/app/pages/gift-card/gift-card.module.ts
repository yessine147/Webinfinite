import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GiftCardRoutingModule } from './gift-card-routing.module';
import { GiftCardComponent } from './gift-card.component';
import { CreateGiftCardComponent } from './create-gift-card/create-gift-card.component';
import { EditGiftCardComponent } from './edit-gift-card/edit-gift-card.component';
import { FormGiftCardComponent } from './form-gift-card/form-gift-card.component';
import { ApproveGiftCardComponent } from './approve-gift-card/approve-gift-card.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [
    GiftCardComponent,
    CreateGiftCardComponent,
    EditGiftCardComponent,
    FormGiftCardComponent,
    ApproveGiftCardComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule, 
    UIModule,
    ReactiveFormsModule ,
    TranslateModule,
    NgMultiSelectDropDownModule,
    GiftCardRoutingModule
  ]
})
export class GiftCardModule { }
