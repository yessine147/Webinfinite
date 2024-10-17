import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from 'src/app/core/guards/role.guard';
import { Modules, Permission } from 'src/app/store/Role/role.models';
import { AreasComponent } from './areas.component';
import { CreateAreaComponent } from './create-area/create-area.component';
import { EditAreaComponent } from './edit-area/edit-area.component';

const routes: Routes = [
  {
  path: '',
  canActivate: [RoleGuard],
  data: {
    claim : [{claimType: Modules.All, claimValue: [Permission.All]}, {claimType: Modules.System_Administration, claimValue: [Permission.ViewAll]}]

  },
  component: AreasComponent
},
{
  path: "create",
  component: CreateAreaComponent,
  canActivate: [RoleGuard],
  data: {
    claim: [{claimType: Modules.All, claimValue: [Permission.All]},{ claimType:Modules.System_Administration, claimValue:[Permission.ViewAll,Permission.Create]}]

  }
},
{
  path: "edit/:id",
  component: EditAreaComponent,
  canActivate: [RoleGuard],
  data: {
  claim: [{claimType: Modules.All, claimValue: [Permission.All]},{ claimType:Modules.System_Administration, claimValue:[Permission.ViewAll,Permission.Update]}]

   }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AreasRoutingModule { }
