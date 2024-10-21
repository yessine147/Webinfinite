import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map, tap } from 'rxjs/operators';

import { of } from 'rxjs';
import { CrudService } from 'src/app/core/services/crud.service';
import {
    fetchCitylistData, fetchCitylistSuccess,
    fetchCitylistFail,
    addCitylistFailure,
    addCitylistSuccess,
    addCitylist,
    updateCitylistFailure,
    updateCitylistSuccess,
    updateCitylist,
    deleteCitylistFailure,
    deleteCitylistSuccess,
    deleteCitylist,
    updateCityStatus,
    updateCityStatusSuccess,
    updateCityStatusFailure,
    getCityById,
    getCityByIdSuccess
} from './city.action';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectCityById } from './city-selector';

@Injectable()
export class CityEffects {
    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchCitylistData),
            tap(() => console.log('Request to fetch City list has been launched')), // Add console log here
            mergeMap(({ page, itemsPerPage }) =>
                this.CrudService.fetchData('/cities',{ limit: itemsPerPage, page: page}).pipe(
                    tap((response : any) => console.log('Fetched data:', response.result)), 
                    map((response) => fetchCitylistSuccess({ CityListdata: response.result })),
                    catchError((error) =>
                        of(fetchCitylistFail({ error }))
                    )
                )
            ),
        ),
    );
  
    addData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addCitylist),
            mergeMap(({ newData }) =>
                this.CrudService.addData('/cities', newData).pipe(
                    map((response) => {
                        this.toastr.success('The new City has been added successfully.');
                        this.router.navigate(['/private/cities']);
                        // Dispatch the action to fetch the updated City list after adding a new City
                        return addCitylistSuccess({newData: response});
                      }),
                    catchError((error) => of(addCitylistFailure({ error })))
                )
            )
        )
    );
    getCityById$ = createEffect(() =>
        this.actions$.pipe(
          ofType(getCityById),
          tap(action => console.log('get City action received:', action)),
          mergeMap(({ CityId }) => {
            // Use the selector to get the City from the City
            return this.store.select(selectCityById(CityId)).pipe(
              map(City => {
                if (City) {
                  console.log('City',City);
                  // Dispatch success action with the City data
                  return getCityByIdSuccess({ City: City });
                } else {
                  console.log('City NULL');
                  // Handle the case where the City is not found, if needed
                  // For example, you might want to dispatch a failure action or return an empty City
                  return getCityByIdSuccess({ City: null }); // or handle it differently
                }
              })
            );
          })
        )
      );
    updateStatus$ = createEffect(() =>
        this.actions$.pipe(
            ofType(updateCityStatus),
            mergeMap(({ userId, status }) =>
                this.CrudService.addData('/api/update-status', { userId, status }).pipe(
                    map((updatedData) => {
                        this.toastr.success('The City has been updated successfully.');
                        return updateCityStatusSuccess({ updatedData })}),
                    catchError((error) => of(updateCityStatusFailure({ error })))
                )
            )
        )
    );

    updateData$ = createEffect(() => 
        this.actions$.pipe(
            ofType(updateCitylist),
            mergeMap(({ updatedData }) => {
               
                return this.CrudService.updateData(`/cities/${updatedData.id}`, updatedData).pipe(
                    map((response : any) => 
                    {
                        console.log('Updated Data:', updatedData);
                        this.toastr.success('The City has been updated successfully.');
                        this.router.navigate(['/private/cities']); 
                        return updateCitylistSuccess({ updatedData : response.result})
                    }),
                    catchError((error) => of(updateCitylistFailure({ error })))
                );
            })
        )
    );


   deleteData$ = createEffect(() =>
    
        this.actions$.pipe(
            ofType(deleteCitylist),
            tap(action => console.log('Delete action received:', action)),
            mergeMap(({ CityId }) =>
                    this.CrudService.deleteData(`/cities/${CityId}`).pipe(
                        map((response: string) => {
                            // If response contains a success message or status, you might want to check it here
                            console.log('API response:', response);
                            return deleteCitylistSuccess({ CityId });
                          }),
                    catchError((error) => {return  of(deleteCitylistFailure({ error }))})
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
        console.log('i am in City effect');
    }

}