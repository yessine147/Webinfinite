import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map, tap } from 'rxjs/operators';

import { of } from 'rxjs';
import { CrudService } from 'src/app/core/services/crud.service';
import {
    fetchCountrylistData, fetchCountrylistSuccess,
    fetchCountrylistFail,
    addCountrylistFailure,
    addCountrylistSuccess,
    addCountrylist,
    updateCountrylistFailure,
    updateCountrylistSuccess,
    updateCountrylist,
    deleteCountrylistFailure,
    deleteCountrylistSuccess,
    deleteCountrylist,
    updateCountryStatus,
    updateCountryStatusSuccess,
    updateCountryStatusFailure,
    getCountryById,
    getCountryByIdSuccess
} from './country.action';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectCountryById } from './country-selector';

@Injectable()
export class countrieslistEffects {
    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchCountrylistData),
            tap(() => console.log('Request to fetch Country list has been launched')), // Add console log here
            mergeMap(({ page, itemsPerPage }) =>
                this.CrudService.fetchData('/countries',{ limit: itemsPerPage, page: page}).pipe(
                    tap((response : any) => console.log('Fetched data:', response.result.data)), 
                    map((response) => fetchCountrylistSuccess({ CountryListdata: response.result.data })),
                    catchError((error) =>
                        of(fetchCountrylistFail({ error }))
                    )
                )
            ),
        ),
    );
  
    addData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addCountrylist),
            mergeMap(({ newData }) =>
                this.CrudService.addData('/countries', newData).pipe(
                    map((response) => {
                        this.toastr.success('The new Country has been added successfully.');
                        this.router.navigate(['/private/countries']);
                        // Dispatch the action to fetch the updated Country list after adding a new Country
                        return addCountrylistSuccess({newData: response});
                      }),
                    catchError((error) => of(addCountrylistFailure({ error })))
                )
            )
        )
    );
    getCountryById$ = createEffect(() =>
        this.actions$.pipe(
          ofType(getCountryById),
          tap(action => console.log('get Country action received:', action)),
          mergeMap(({ CountryId }) => {
            // Use the selector to get the Country from the Country
            return this.store.select(selectCountryById(CountryId)).pipe(
              map(Country => {
                if (Country) {
                  console.log('Country',Country);
                  // Dispatch success action with the Country data
                  return getCountryByIdSuccess({ Country: Country });
                } else {
                  console.log('Country NULL');
                  // Handle the case where the Country is not found, if needed
                  // For example, you might want to dispatch a failure action or return an empty Country
                  return getCountryByIdSuccess({ Country: null }); // or handle it differently
                }
              })
            );
          })
        )
      );
    updateStatus$ = createEffect(() =>
        this.actions$.pipe(
            ofType(updateCountryStatus),
            mergeMap(({ userId, status }) =>
                this.CrudService.addData('/api/update-status', { userId, status }).pipe(
                    map((updatedData) => {
                        this.toastr.success('The Country has been updated successfully.');
                        return updateCountryStatusSuccess({ updatedData })}),
                    catchError((error) => of(updateCountryStatusFailure({ error })))
                )
            )
        )
    );

    updateData$ = createEffect(() => 
        this.actions$.pipe(
            ofType(updateCountrylist),
            mergeMap(({ updatedData }) => {
                
                return this.CrudService.updateData(`/countries/${updatedData.id}`, updatedData).pipe(
                    map((response : any) => {
                        console.log('Updated Data:', updatedData);
                        this.toastr.success('The Country has been updated successfully.');
                        this.router.navigate(['/private/countries']);
                        return updateCountrylistSuccess({ updatedData : response.result})}),
                    catchError((error) => of(updateCountrylistFailure({ error })))
                );
            })
        )
    );


   deleteData$ = createEffect(() =>
    
        this.actions$.pipe(
            ofType(deleteCountrylist),
            tap(action => console.log('Delete action received:', action)),
            mergeMap(({ CountryId }) =>
                    this.CrudService.deleteData(`/countries/${CountryId}`).pipe(
                        map((response: string) => {
                            // If response contains a success message or status, you might want to check it here
                            console.log('API response:', response);
                            return deleteCountrylistSuccess({ CountryId });
                          }),
                    catchError((error) => {return  of(deleteCountrylistFailure({ error }))})
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