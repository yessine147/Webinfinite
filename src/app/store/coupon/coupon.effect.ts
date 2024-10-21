import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map, tap, switchMap } from 'rxjs/operators';

import { of } from 'rxjs';
import { CrudService } from 'src/app/core/services/crud.service';
import {
    fetchCouponlistData, fetchCouponlistSuccess,
    fetchCouponlistFail,
    addCouponlistFailure,
    addCouponlistSuccess,
    addCouponlist,
    updateCouponlistFailure,
    updateCouponlistSuccess,
    updateCouponlist,
    deleteCouponlistFailure,
    deleteCouponlistSuccess,
    deleteCouponlist,
    updateCouponStatus,
    updateCouponStatusSuccess,
    updateCouponStatusFailure,
    getCouponById,
    getCouponByIdSuccess
} from './coupon.action';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { selectCouponById } from './coupon-selector';
import { Store } from '@ngrx/store';

@Injectable()
export class CouponslistEffects {
   // path : string = '/assets/data/coupon.json';

    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchCouponlistData),
            tap(() => console.log('Request to fetch Coupon list has been launched')), // Add console log here
            mergeMap(({ page, itemsPerPage, status }) =>
                this.CrudService.fetchData('/coupons',{ limit: itemsPerPage, page: page, status: status}).pipe(
                    tap((response : any) => console.log('Fetched data:', response.result)), 
                    map((response) => fetchCouponlistSuccess({ CouponListdata : response.result })),
                    catchError((error) =>
                        of(fetchCouponlistFail({ error }))
                    )
                )
            ),
        ),
    );
    
    addData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addCouponlist),
            mergeMap(({ newData }) =>
                this.CrudService.addData('/coupons', newData).pipe(
                    map((newData) => {
                        
                        
                        this.toastr.success('The new Coupon has been added successfully.');
                        this.router.navigate(['/private/coupons']);
                        // Dispatch the action to fetch the updated Coupon list after adding a new Coupon
                        return addCouponlistSuccess({newData});
                      }),
                    catchError((error) => of(addCouponlistFailure({ error })))
                )
            )
        )
    );
    updateStatus$ = createEffect(() =>
        this.actions$.pipe(
            ofType(updateCouponStatus),
            mergeMap(({ couponId, status }) =>
                this.CrudService.addData('/api/update-status', { couponId, status }).pipe(
                    map((updatedData) => {
                        this.toastr.success('The Coupon has been updated successfully.');
                        return updateCouponStatusSuccess({ updatedData })}),
                    catchError((error) => of(updateCouponStatusFailure({ error })))
                )
            )
        )
    );

    updateData$ = createEffect(() =>
        this.actions$.pipe(
          ofType(updateCouponlist),
          mergeMap(({ updatedData }) =>
            this.CrudService.updateData(`/coupons/${updatedData.id}`, updatedData).pipe(
              map(() => {
                
                this.toastr.success('The Coupon has been updated successfully.');
                this.router.navigate(['/private/coupons']);
                return updateCouponlistSuccess({ updatedData }); // Make sure to return the action
              }),
              catchError((error) => of(updateCouponlistFailure({ error }))) // Catch errors and return the failure action
            )
          )
        )
      );
      

   getCouponById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getCouponById),
      tap(action => console.log('get coupon action received:', action)),
      mergeMap(({ couponId }) => {
        // Use the selector to get the coupon from the store
        return this.store.select(selectCouponById(couponId)).pipe(
          map(coupon => {
            if (coupon) {
              console.log('COUPON',coupon);
              // Dispatch success action with the coupon data
              return getCouponByIdSuccess({ coupon });
            } else {
              console.log('COUPON NULL');
              // Handle the case where the coupon is not found, if needed
              // For example, you might want to dispatch a failure action or return an empty coupon
              return getCouponByIdSuccess({ coupon: null }); // or handle it differently
            }
          })
        );
      })
    )
  );
   deleteData$ = createEffect(() =>
    
        this.actions$.pipe(
            ofType(deleteCouponlist),
            tap(action => console.log('Delete action received:', action)),
            mergeMap(({ couponId }) =>
                    this.CrudService.deleteData(`/coupons/${couponId}`).pipe(
                        map((response: string) => {
                            // If response contains a success message or status, you might want to check it here
                            console.log('API response:', response);
                            return deleteCouponlistSuccess({ couponId });
                          }),
                    catchError((error) => {return  of(deleteCouponlistFailure({ error }))})
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