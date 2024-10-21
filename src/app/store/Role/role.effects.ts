import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map, tap, switchMap } from 'rxjs/operators';

import { of } from 'rxjs';
import { CrudService } from 'src/app/core/services/crud.service';
import {
    fetchRolelistData, fetchRolelistSuccess,
    fetchRolelistFail,
    addRolelistFailure,
    addRolelistSuccess,
    addRolelist,
    updateRolelistFailure,
    updateRolelistSuccess,
    updateRolelist,
    deleteRolelistFailure,
    deleteRolelistSuccess,
    deleteRolelist,
    updateRoleStatus,
    updateRoleStatusSuccess,
    updateRoleStatusFailure,
    getRoleById,
    getRoleByIdSuccess
} from './role.actions';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { selectRoleById } from './role-selector';
import { Store } from '@ngrx/store';

@Injectable()
export class RolesEffects {

    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchRolelistData),
            tap(() => console.log('Request to fetch Role list has been launched')), // Add console log here
            mergeMap(({ page, itemsPerPage }) =>
                this.CrudService.fetchData('/roles/').pipe(
                    tap((response : any) => console.log('Fetched data:', response.result)), 
                    map((response) => fetchRolelistSuccess({ RoleListdata : response.result })),
                    catchError((error) =>
                        of(fetchRolelistFail({ error }))
                    )
                )
            ),
        ),
    );
  
    addData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addRolelist),
            mergeMap(({ newData }) =>
                this.CrudService.addData('/roles', newData).pipe(
                    map((newData) => {
                        
                        this.router.navigate(['/private/roles']);
                        this.toastr.success('The new Role has been added successfully.');
                        // Dispatch the action to fetch the updated Role list after adding a new Role
                        return addRolelistSuccess({newData});
                      }),
                    catchError((error) => of(addRolelistFailure({ error })))
                )
            )
        )
    );
    updateStatus$ = createEffect(() =>
        this.actions$.pipe(
            ofType(updateRoleStatus),
            mergeMap(({ RoleId, status }) =>
                this.CrudService.addData('/api/update-status', { RoleId, status }).pipe(
                    map((updatedData) => {
                        this.toastr.success('The Role has been updated successfully.');
                        return updateRoleStatusSuccess({ updatedData })}),
                    catchError((error) => of(updateRoleStatusFailure({ error })))
                )
            )
        )
    );

    updateData$ = createEffect(() =>
        this.actions$.pipe(
          ofType(updateRolelist),
          mergeMap(({ updatedData }) =>
            this.CrudService.updateData(`/roles/${updatedData.id}`, updatedData).pipe(
              map(() => {
                this.router.navigate(['/private/roles']);
                this.toastr.success('The Role has been updated successfully.');
                return updateRolelistSuccess({ updatedData }); // Make sure to return the action
              }),
              catchError((error) => of(updateRolelistFailure({ error }))) // Catch errors and return the failure action
            )
          )
        )
      );
      

   getRoleById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getRoleById),
      tap(action => console.log('get Role action received:', action)),
      mergeMap(({ RoleId }) => {
        // Use the selector to get the Role from the store
        return this.store.select(selectRoleById(RoleId)).pipe(
          map(Role => {
            if (Role) {
              console.log('Role',Role);
              // Dispatch success action with the Role data
              return getRoleByIdSuccess({ Role });
            } else {
              console.log('Role NULL');
              // Handle the case where the Role is not found, if needed
              // For example, you might want to dispatch a failure action or return an empty Role
              return getRoleByIdSuccess({ Role: null }); // or handle it differently
            }
          })
        );
      })
    )
  );
   deleteData$ = createEffect(() =>
    
        this.actions$.pipe(
            ofType(deleteRolelist),
            tap(action => console.log('Delete action received:', action)),
            mergeMap(({ RoleId }) =>
                    this.CrudService.deleteData(`/roles/${RoleId}`).pipe(
                        map((response: string) => {
                            // If response contains a success message or status, you might want to check it here
                            console.log('API response:', response);
                            this.toastr.success('The Role has been deleted successfully.');
                            return deleteRolelistSuccess({ RoleId });
                          }),
                    catchError((error) => {return  of(deleteRolelistFailure({ error }))})
                )
            )
        )
    );
    
    
    constructor(
        private actions$: Actions,
        private CrudService: CrudService,
        private router: Router,
        private store: Store,
        public toastr:ToastrService
    ) { }

}