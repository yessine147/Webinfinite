import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map, tap } from 'rxjs/operators';

import { of } from 'rxjs';
import { CrudService } from 'src/app/core/services/crud.service';
import {
    fetchStorelistData, fetchStorelistSuccess,
    fetchStorelistFail,
    addStorelistFailure,
    addStorelistSuccess,
    addStorelist,
    updateStorelistFailure,
    updateStorelistSuccess,
    updateStorelist,
    deleteStorelistFailure,
    deleteStorelistSuccess,
    deleteStorelist,
    updateStoreStatus,
    updateStoreStatusSuccess,
    updateStoreStatusFailure,
    getStoreById,
    getStoreByIdSuccess
} from './store.action';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectStoreById } from './store-selector';

@Injectable()
export class StoreslistEffects {
    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchStorelistData),
            tap(() => console.log('Request to fetch Store list has been launched')), // Add console log here
            mergeMap(({ page, itemsPerPage,status, merchant_id }) =>
                this.CrudService.fetchData('/stores',{ limit: itemsPerPage, page: page,status: status, merchant_id: merchant_id}).pipe(
                    tap((response : any) => console.log('Fetched data:', response.result)), 
                    map((response) => fetchStorelistSuccess({ StoreListdata: response.result })),
                    catchError((error) =>
                        of(fetchStorelistFail({ error }))
                    )
                )
            ),
        ),
    );
  
    addData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addStorelist),
            mergeMap(({ newData }) =>
                this.CrudService.addData('/stores', newData).pipe(
                    map((response: any) => {
                        this.toastr.success('The new Store has been added successfully.');
                        this.router.navigate(['/private/stores']);
                        // Dispatch the action to fetch the updated Store list after adding a new Store
                        return addStorelistSuccess({newData: response.result});
                      }),
                    catchError((error) => of(addStorelistFailure({ error })))
                )
            )
        )
    );
    getStoreById$ = createEffect(() =>
        this.actions$.pipe(
          ofType(getStoreById),
          tap(action => console.log('get Store action received:', action)),
          mergeMap(({ StoreId }) => {
            // Use the selector to get the Store from the store
            return this.store.select(selectStoreById(StoreId)).pipe(
              map(Store => {
                if (Store) {
                  console.log('Store',Store);
                  // Dispatch success action with the Store data
                  return getStoreByIdSuccess({ Store: Store });
                } else {
                  console.log('Store NULL');
                  // Handle the case where the Store is not found, if needed
                  // For example, you might want to dispatch a failure action or return an empty Store
                  return getStoreByIdSuccess({ Store: null }); // or handle it differently
                }
              })
            );
          })
        )
      );
    updateStatus$ = createEffect(() =>
        this.actions$.pipe(
            ofType(updateStoreStatus),
            mergeMap(({ userId, status }) =>
                this.CrudService.addData('/api/update-status', { userId, status }).pipe(
                    map((updatedData) => {
                        this.toastr.success('The Store has been updated successfully.');
                        return updateStoreStatusSuccess({ updatedData })}),
                    catchError((error) => of(updateStoreStatusFailure({ error })))
                )
            )
        )
    );

    updateData$ = createEffect(() => 
        this.actions$.pipe(
            ofType(updateStorelist),
            mergeMap(({ updatedData }) => {
                return this.CrudService.updateData(`/stores/${updatedData.id}`, updatedData).pipe(
                map((response: any) =>{
                console.log('Updated Data:', updatedData);
                this.toastr.success('The Store has been updated successfully.');
                this.router.navigate(['/private/stores']);
                return  updateStorelistSuccess({ updatedData: response.result })}),
                catchError((error) => of(updateStorelistFailure({ error })))
                );
            })
        )
    );


   deleteData$ = createEffect(() =>
    
        this.actions$.pipe(
            ofType(deleteStorelist),
            tap(action => console.log('Delete action received:', action)),
            mergeMap(({ storeId }) =>
                    this.CrudService.deleteData(`/stores/${storeId}`).pipe(
                        map((response: string) => {
                            // If response contains a success message or status, you might want to check it here
                            console.log('API response:', response);
                            this.toastr.success('The Store has been deleted successfully.');
                            return deleteStorelistSuccess({ storeId });
                          }),
                    catchError((error) => {return  of(deleteStorelistFailure({ error }))})
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
    ) { }

}