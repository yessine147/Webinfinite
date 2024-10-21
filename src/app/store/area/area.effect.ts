import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map, tap } from 'rxjs/operators';

import { of } from 'rxjs';
import { CrudService } from 'src/app/core/services/crud.service';
import {
    fetchArealistData, fetchArealistSuccess,
    fetchArealistFail,
    addArealistFailure,
    addArealistSuccess,
    addArealist,
    updateArealistFailure,
    updateArealistSuccess,
    updateArealist,
    deleteArealistFailure,
    deleteArealistSuccess,
    deleteArealist,
    updateAreaStatus,
    updateAreaStatusSuccess,
    updateAreaStatusFailure,
    getAreaById,
    getAreaByIdSuccess
} from './area.action';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectAreaById } from './area-selector';

@Injectable()
export class AreaEffects {
    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchArealistData),
            tap(() => console.log('Request to fetch Area list has been launched')), // Add console log here
            mergeMap(({ page, itemsPerPage }) =>
                this.CrudService.fetchData('/areas',{ limit: itemsPerPage, page: page}).pipe(
                    tap((response : any) => console.log('Fetched data:', response.result.data)), 
                    map((response) => fetchArealistSuccess({ AreaListdata: response.result.data })),
                    catchError((error) =>
                        of(fetchArealistFail({ error }))
                    )
                )
            ),
        ),
    );
  
    addData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addArealist),
            mergeMap(({ newData }) =>
                this.CrudService.addData('/areas', newData).pipe(
                    map((response) => {
                        this.toastr.success('The new Area has been added successfully.');
                        this.router.navigate(['/private/areas']);
                        // Dispatch the action to fetch the updated Area list after adding a new Area
                        return addArealistSuccess({newData: response});
                      }),
                    catchError((error) => of(addArealistFailure({ error })))
                )
            )
        )
    );
    getAreaById$ = createEffect(() =>
        this.actions$.pipe(
          ofType(getAreaById),
          tap(action => console.log('get Area action received:', action)),
          mergeMap(({ AreaId }) => {
            // Use the selector to get the Area from the Area
            return this.store.select(selectAreaById(AreaId)).pipe(
              map(Area => {
                if (Area) {
                  console.log('Area',Area);
                  // Dispatch success action with the Area data
                  return getAreaByIdSuccess({ Area: Area });
                } else {
                  console.log('Area NULL');
                  // Handle the case where the Area is not found, if needed
                  // For example, you might want to dispatch a failure action or return an empty Area
                  return getAreaByIdSuccess({ Area: null }); // or handle it differently
                }
              })
            );
          })
        )
      );
    updateStatus$ = createEffect(() =>
        this.actions$.pipe(
            ofType(updateAreaStatus),
            mergeMap(({ userId, status }) =>
                this.CrudService.addData('/api/update-status', { userId, status }).pipe(
                    map((updatedData) => {
                        this.toastr.success('The Area has been updated successfully.');
                        return updateAreaStatusSuccess({ updatedData })}),
                    catchError((error) => of(updateAreaStatusFailure({ error })))
                )
            )
        )
    );

    updateData$ = createEffect(() => 
        this.actions$.pipe(
            ofType(updateArealist),
            mergeMap(({ updatedData }) => {
                console.log('Updated Data:', updatedData);
                this.toastr.success('The Area has been updated successfully.');
                this.router.navigate(['/private/areas']);
                return this.CrudService.updateData(`/areas/${updatedData.id}`, updatedData).pipe(
                    map((response : any) => updateArealistSuccess({ updatedData : response.result})),
                    catchError((error) => of(updateArealistFailure({ error })))
                );
            })
        )
    );


   deleteData$ = createEffect(() =>
    
        this.actions$.pipe(
            ofType(deleteArealist),
            tap(action => console.log('Delete action received:', action)),
            mergeMap(({ AreaId }) =>
                    this.CrudService.deleteData(`/areas/${AreaId}`).pipe(
                        map((response: string) => {
                            // If response contains a success message or status, you might want to check it here
                            console.log('API response:', response);
                            return deleteArealistSuccess({ AreaId });
                          }),
                    catchError((error) => {return  of(deleteArealistFailure({ error }))})
                )
            )
        )
    );
    
    
    constructor(
        private actions$: Actions,
        private CrudService: CrudService,
        public toastr:ToastrService,
        private router: Router,
        private store: Store
    ) { 
        console.log('i am in area effect');
    }

}