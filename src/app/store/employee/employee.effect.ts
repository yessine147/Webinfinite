import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map, tap } from 'rxjs/operators';

import { of } from 'rxjs';
import { CrudService } from 'src/app/core/services/crud.service';
import { addEmployeelist, addEmployeelistFailure, addEmployeelistSuccess, deleteEmployeelist, deleteEmployeelistFailure, deleteEmployeelistSuccess, fetchEmployeelistData, fetchEmployeelistFail, fetchEmployeelistSuccess, getEmployeeById, getEmployeeByIdSuccess, updateEmployeelist, updateEmployeelistFailure, updateEmployeelistSuccess, updateEmployeeStatus, updateEmployeeStatusFailure, updateEmployeeStatusSuccess } from './employee.action';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { selectEmployeeById } from './employee-selector';
import { Store } from '@ngrx/store';

@Injectable()
export class EmployeeslistEffects {
  

    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchEmployeelistData),
            tap(() => console.log('Request to fetch Employee list has been launched')), // Add console log here
            mergeMap(({ page, itemsPerPage, role }) =>
                this.CrudService.fetchData('/users', { limit:itemsPerPage , page: page, role: role}).pipe(
                    tap((response : any) => console.log('Fetched data:', response.result)), 
                    map((response) => fetchEmployeelistSuccess({ EmployeeListdata : response.result })),
                    catchError((error) =>
                        of(fetchEmployeelistFail({ error }))
                    )
                )
            ),
        ),
    );users
  
    addData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addEmployeelist),
            mergeMap(({ newData }) =>
                this.CrudService.addData('/users', newData).pipe(
                    map((newData) => {
                        this.toastr.success('The new Employee has been added successfully.');
                        this.router.navigate(['/private/employees']);
                        // Dispatch the action to fetch the updated Employee list after adding a new Employee
                        return addEmployeelistSuccess({newData});
                      }),
                    catchError((error) => of(addEmployeelistFailure({ error })))
                )
            )
        )
    );
    updateStatus$ = createEffect(() =>
        this.actions$.pipe(
            ofType(updateEmployeeStatus),
            mergeMap(({ employeeId, status }) =>
                this.CrudService.addData('/api/update-status', { employeeId, status }).pipe(
                    map((updatedData) => {
                        this.toastr.success('The Employee has been updated successfully.');
                        return updateEmployeeStatusSuccess({ updatedData })}),
                    catchError((error) => of(updateEmployeeStatusFailure({ error })))
                )
            )
        )
    );

    updateData$ = createEffect(() =>
        this.actions$.pipe(
          ofType(updateEmployeelist),
          mergeMap(({ updatedData }) =>
            this.CrudService.updateData(`/users/${updatedData.id}`, updatedData).pipe(
              map(() => {
                this.toastr.success('The Employee has been updated successfully.');
                this.router.navigate(['/private/employees']);
                return updateEmployeelistSuccess({ updatedData }); // Make sure to return the action
              }),
              catchError((error) => of(updateEmployeelistFailure({ error }))) // Catch errors and return the failure action
            )
          )
        )
      );
      

      getEmployeeById$ = createEffect(() =>
        this.actions$.pipe(
          ofType(getEmployeeById),
          tap(action => console.log('get Employee action received:', action)),
          mergeMap(({ employeeId }) => {
            // Use the selector to get the Employee from the store
            return this.store.select(selectEmployeeById(employeeId)).pipe(
              map(Employee => {
                if (Employee) {
                  console.log('Employee',Employee);
                  // Dispatch success action with the Employee data
                  return getEmployeeByIdSuccess({ employee: Employee });
                } else {
                  console.log('Employee NULL');
                  // Handle the case where the Employee is not found, if needed
                  // For example, you might want to dispatch a failure action or return an empty Employee
                  return getEmployeeByIdSuccess({ employee: null }); // or handle it differently
                }
              })
            );
          })
        )
      );
   deleteData$ = createEffect(() =>
    
        this.actions$.pipe(
            ofType(deleteEmployeelist),
            tap(action => console.log('Delete action received:', action)),
            mergeMap(({ employeeId }) =>
                    this.CrudService.deleteData(`/users/${employeeId}`).pipe(
                        map((response: string) => {
                            // If response contains a success message or status, you might want to check it here
                            console.log('API response:', response);
                            return deleteEmployeelistSuccess({ employeeId });
                          }),
                    catchError((error) => {return  of(deleteEmployeelistFailure({ error }))})
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