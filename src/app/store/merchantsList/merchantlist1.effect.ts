import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map, tap } from 'rxjs/operators';

import { of } from 'rxjs';
import { CrudService } from 'src/app/core/services/crud.service';
import {
    fetchMerchantlistData, fetchMerchantlistSuccess,
    fetchMerchantlistFail,
    addMerchantlistFailure,
    addMerchantlistSuccess,
    addMerchantlist,
    updateMerchantlistFailure,
    updateMerchantlistSuccess,
    updateMerchantlist,
    deleteMerchantlistFailure,
    deleteMerchantlistSuccess,
    deleteMerchantlist,
    updateMerchantStatus,
    updateMerchantStatusSuccess,
    updateMerchantStatusFailure,
    getMerchantById,
    getMerchantByIdSuccess
} from './merchantlist1.action';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectMerchantById } from './merchantlist1-selector';

@Injectable()
export class MerchantslistEffects1 {
    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchMerchantlistData),
            tap(() => console.log('Request to fetch merchant list has been launched')), // Add console log here
            mergeMap(({ page, itemsPerPage, status }) =>
                this.CrudService.fetchData('/merchants',{ limit: itemsPerPage, page: page, status: status}).pipe(
                    tap((response : any) => console.log('Fetched data:', response.result)), 
                    map((response) => {return fetchMerchantlistSuccess({ MerchantListdata: response.result })}),
                    catchError((error) =>
                        of(fetchMerchantlistFail({ error }))
                    )
                )
            ),
        ),
    );
  
    addData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addMerchantlist),
            mergeMap(({ newData }) =>
                this.CrudService.addData('/merchants', newData).pipe(
                    map((newData) => {
                        this.toastr.success('The new merchant has been added successfully.');
                        this.router.navigate(['/private/merchants/list']);
                        // Dispatch the action to fetch the updated merchant list after adding a new merchant
                        return addMerchantlistSuccess({newData});
                      }),
                    catchError((error) => of(addMerchantlistFailure({ error })))
                )
            )
        )
    );
    getMerchantById$ = createEffect(() =>
        this.actions$.pipe(
          ofType(getMerchantById),
          tap(action => console.log('get Merchant action received:', action)),
          mergeMap(({ merchantId }) => {
            // Use the selector to get the Merchant from the store
            return this.store.select(selectMerchantById(merchantId)).pipe(
              map(Merchant => {
                if (Merchant) {
                  console.log('Merchant',Merchant);
                  // Dispatch success action with the Merchant data
                  return getMerchantByIdSuccess({ merchant: Merchant });
                } else {
                  console.log('Merchant NULL');
                  // Handle the case where the Merchant is not found, if needed
                  // For example, you might want to dispatch a failure action or return an empty Merchant
                  return getMerchantByIdSuccess({ merchant: null }); // or handle it differently
                }
              })
            );
          })
        )
      );
    updateStatus$ = createEffect(() =>
        this.actions$.pipe(
            ofType(updateMerchantStatus),
            mergeMap(({ userId, status }) =>
                this.CrudService.addData('/api/update-status', { userId, status }).pipe(
                    map((updatedData) => {
                        this.toastr.success('The merchant has been updated successfully.');
                        return updateMerchantStatusSuccess({ updatedData })}),
                    catchError((error) => of(updateMerchantStatusFailure({ error })))
                )
            )
        )
    );

    updateData$ = createEffect(() => 
        this.actions$.pipe(
            ofType(updateMerchantlist),
            mergeMap(({ updatedData }) => {
                
                return this.CrudService.updateData(`/merchants/${updatedData.id}`, updatedData).pipe(
                map(() => 
                {
                    console.log('Updated Data:', updatedData);
                    this.toastr.success('The merchant has been updated successfully.');
                    this.router.navigate(['/private/merchants/list']);
                    return  updateMerchantlistSuccess({ updatedData })}),
                    catchError((error) => of(updateMerchantlistFailure({ error })))
                );
            })
        )
    );


   deleteData$ = createEffect(() =>
    
        this.actions$.pipe(
            ofType(deleteMerchantlist),
            tap(action => console.log('Delete action received:', action)),
            mergeMap(({ userId }) =>
                    this.CrudService.deleteData(`/merchants/${userId}`).pipe(
                        map((response: string) => {
                            // If response contains a success message or status, you might want to check it here
                            console.log('API response:', response);
                            return deleteMerchantlistSuccess({ userId });
                          }),
                    catchError((error) => {return  of(deleteMerchantlistFailure({ error }))})
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