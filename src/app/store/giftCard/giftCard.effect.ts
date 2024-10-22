import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map, tap, switchMap } from 'rxjs/operators';

import { of } from 'rxjs';
import { CrudService } from 'src/app/core/services/crud.service';
import {
    fetchGiftCardlistData, fetchGiftCardlistSuccess,
    fetchGiftCardlistFail,
    addGiftCardlistFailure,
    addGiftCardlistSuccess,
    addGiftCardlist,
    updateGiftCardlistFailure,
    updateGiftCardlistSuccess,
    updateGiftCardlist,
    deleteGiftCardlistFailure,
    deleteGiftCardlistSuccess,
    deleteGiftCardlist,
    updateGiftCardStatus,
    updateGiftCardStatusSuccess,
    updateGiftCardStatusFailure,
    getGiftCardById,
    getGiftCardByIdSuccess
} from './giftCard.action';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { selectGiftCardById } from './giftCard-selector';
import { Store } from '@ngrx/store';

@Injectable()
export class GiftCardsEffects {

    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchGiftCardlistData),
            tap(() => console.log('Request to fetch GiftCard list has been launched')), // Add console log here
            mergeMap(({ page, itemsPerPage, status }) =>
                this.CrudService.fetchData('/gift-cards',{ limit: itemsPerPage, page: page, status: status}).pipe(
                    tap((response : any) => console.log('Fetched data:', response.result)), 
                    map((response) => fetchGiftCardlistSuccess({ GiftCardListdata : response.result })),
                    catchError((error) =>
                        of(fetchGiftCardlistFail({ error }))
                    )
                )
            ),
        ),
    );
    
    addData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addGiftCardlist),
            mergeMap(({ newData }) =>
                this.CrudService.addData('/gift-cards', newData).pipe(
                    map((newData) => {
                      const userRole = this.getCurrentUserRole(); 
                      console.log(userRole);// Replace with your logic to get the role
                        if (userRole === 'Admin') {
                            this.toastr.success('The new GiftCard has been added successfully.');
                            this.router.navigate(['/private/giftCards']);
                        } else {
                            this.toastr.success('The new GiftCard Request has been sent to Admin.');
                            this.router.navigate(['/private/giftCards/approve']); // Redirect to pending coupons for non-admins
                        }
                        
                        // Dispatch the action to fetch the updated GiftCard list after adding a new GiftCard
                        return addGiftCardlistSuccess({newData});
                      }),
                    catchError((error) => of(addGiftCardlistFailure({ error })))
                )
            )
        )
    );
   

    updateData$ = createEffect(() =>
        this.actions$.pipe(
          ofType(updateGiftCardlist),
          mergeMap(({ updatedData }) =>
            this.CrudService.updateData(`/gift-cards/${updatedData.id}`, updatedData).pipe(
              map(() => {
                
                this.toastr.success('The GiftCard has been updated successfully.');
                this.router.navigate(['/private/giftCards']);
                return updateGiftCardlistSuccess({ updatedData }); // Make sure to return the action
              }),
              catchError((error) => of(updateGiftCardlistFailure({ error }))) // Catch errors and return the failure action
            )
          )
        )
      );
      

   getGiftCardById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getGiftCardById),
      tap(action => console.log('get GiftCard action received:', action)),
      mergeMap(({ GiftCardId }) => {
        // Use the selector to get the GiftCard from the store
        return this.store.select(selectGiftCardById(GiftCardId)).pipe(
          map(GiftCard => {
            if (GiftCard) {
              console.log('GiftCard',GiftCard);
              // Dispatch success action with the GiftCard data
              return getGiftCardByIdSuccess({ GiftCard });
            } else {
              console.log('GiftCard NULL');
              // Handle the case where the GiftCard is not found, if needed
              // For example, you might want to dispatch a failure action or return an empty GiftCard
              return getGiftCardByIdSuccess({ GiftCard: null }); // or handle it differently
            }
          })
        );
      })
    )
  );
   deleteData$ = createEffect(() =>
    
        this.actions$.pipe(
            ofType(deleteGiftCardlist),
            tap(action => console.log('Delete action received:', action)),
            mergeMap(({ GiftCardId }) =>
                    this.CrudService.deleteData(`/gift-cards/${GiftCardId}`).pipe(
                        map((response: string) => {
                            // If response contains a success message or status, you might want to check it here
                            console.log('API response:', response);
                            return deleteGiftCardlistSuccess({ GiftCardId });
                          }),
                    catchError((error) => {return  of(deleteGiftCardlistFailure({ error }))})
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
    private getCurrentUserRole(): string {
      // Replace with your actual logic to retrieve the user role
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      console.log(currentUser);
      return currentUser ? currentUser.role.name : '';
  }
}