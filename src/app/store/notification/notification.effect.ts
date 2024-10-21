import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map, tap, switchMap } from 'rxjs/operators';

import { of } from 'rxjs';
import { CrudService } from 'src/app/core/services/crud.service';
import {
    fetchNotificationlistData, fetchNotificationlistSuccess,
    fetchNotificationlistFail,
    addNotificationlistFailure,
    addNotificationlistSuccess,
    addNotificationlist,
    updateNotificationlistFailure,
    updateNotificationlistSuccess,
    updateNotificationlist,
    deleteNotificationlistFailure,
    deleteNotificationlistSuccess,
    deleteNotificationlist,
    updateNotificationStatus,
    updateNotificationStatusSuccess,
    updateNotificationStatusFailure,
    getNotificationById,
    getNotificationByIdSuccess,
    fetchMyNotificationlistData
} from './notification.action';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { selectNotificationById } from './notification-selector';
import { Store } from '@ngrx/store';

@Injectable()
export class NotificationsEffects {
   // path : string = '/assets/data/Notification.json';

    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchNotificationlistData),
            tap(() => console.log('Request to fetch Notification list has been launched')), // Add console log here
            mergeMap(({ page, itemsPerPage }) =>
                this.CrudService.fetchData('/notifications/',{ limit: itemsPerPage, page: page}).pipe(
                    tap((response : any) => console.log('Fetched data:', response.result)), 
                    map((response) => fetchNotificationlistSuccess({ NotificationListdata : response.result })),
                    catchError((error) =>
                        of(fetchNotificationlistFail({ error }))
                    )
                )
            ),
        ),
    );
    fetchDataNotif$ = createEffect(() =>
      this.actions$.pipe(
          ofType(fetchMyNotificationlistData),
          tap(() => console.log('Request to fetch My Notification list')), // Add console log here
          mergeMap(() =>
              this.CrudService.fetchData('/notifications/my-notifications ').pipe(
                  tap((response : any) => console.log('Fetched data:', response.result.rows)), 
                  map((response) => fetchNotificationlistSuccess({ NotificationListdata : response.result.notifications })),
                  catchError((error) =>
                      of(fetchNotificationlistFail({ error }))
                  )
              )
          ),
      ),
  );

    addData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addNotificationlist),
            mergeMap(({ newData }) =>
                this.CrudService.addData('/notifications/schedule-notif/web', newData).pipe(
                    map((newData) => {
                        
                        this.router.navigate(['/private/notifications']);
                        this.toastr.success('The new Notification has been added .');
                        // Dispatch the action to fetch the updated Notification list after adding a new Notification
                        return addNotificationlistSuccess({newData});
                      }),
                    catchError((error) => of(addNotificationlistFailure({ error })))
                )
            )
        )
    );
    updateStatus$ = createEffect(() =>
        this.actions$.pipe(
            ofType(updateNotificationStatus),
            mergeMap(({ NotificationId, status }) =>
                this.CrudService.addData('/api/update-status', { NotificationId, status }).pipe(
                    map((updatedData) => {
                        this.toastr.success('The Notification has been updated successfully.');
                        return updateNotificationStatusSuccess({ updatedData })}),
                    catchError((error) => of(updateNotificationStatusFailure({ error })))
                )
            )
        )
    );

    updateData$ = createEffect(() =>
        this.actions$.pipe(
          ofType(updateNotificationlist),
          mergeMap(({ updatedData }) =>
            this.CrudService.updateData(`/notifications/${updatedData.id}`, updatedData).pipe(
              map(() => {
                this.router.navigate(['/private/notifications']);
                this.toastr.success('The Notification has been updated successfully.');
                return updateNotificationlistSuccess({ updatedData }); // Make sure to return the action
              }),
              catchError((error) => of(updateNotificationlistFailure({ error }))) // Catch errors and return the failure action
            )
          )
        )
      );
      

   getNotificationById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getNotificationById),
      tap(action => console.log('get Notification action received:', action)),
      mergeMap(({ notificationId }) => {
        // Use the selector to get the Notification from the store
        return this.store.select(selectNotificationById(notificationId)).pipe(
          map(Notification => {
            if (Notification) {
              console.log('Notification',Notification);
              // Dispatch success action with the Notification data
              return getNotificationByIdSuccess({ Notification });
            } else {
              console.log('Notification NULL');
              // Handle the case where the Notification is not found, if needed
              // For example, you might want to dispatch a failure action or return an empty Notification
              return getNotificationByIdSuccess({ Notification: null }); // or handle it differently
            }
          })
        );
      })
    )
  );
   deleteData$ = createEffect(() =>
    
        this.actions$.pipe(
            ofType(deleteNotificationlist),
            tap(action => console.log('Delete action received:', action)),
            mergeMap(({ notificationId }) =>
                    this.CrudService.deleteData(`/notifications/${notificationId}`).pipe(
                        map((response: string) => {
                            // If response contains a success message or status, you might want to check it here
                            console.log('API response:', response);
                            this.toastr.success('The Notification has been deleted successfully.');
                            return deleteNotificationlistSuccess({ notificationId });
                          }),
                    catchError((error) => {return  of(deleteNotificationlistFailure({ error }))})
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