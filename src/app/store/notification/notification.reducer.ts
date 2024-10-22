// src/app/Notificationlist.reducer.ts
import { createReducer, on } from '@ngrx/store';
import {  addNotificationlistSuccess, deleteNotificationlistFailure, deleteNotificationlistSuccess, fetchMyNotificationlistSuccess, fetchNotificationlistData, fetchNotificationlistFail, fetchNotificationlistSuccess, getNotificationByIdSuccess, updateNotificationlistSuccess, updateNotificationStatusSuccess } from './notification.action';
import { NotificationListModel } from './notification.model';

export interface NotificationlistState {
  NotificationListdata: any[];
  currentPage: number;
  totalItems: number;
  selectedNotification: any;
  loading: boolean;
  error: any;
}

export const initialState: NotificationlistState = {
  NotificationListdata: [],
  currentPage: 1,
  totalItems: 0,
  selectedNotification: null,
  loading: false,
  error: null,
};

export const NotificationListReducer = createReducer(
  initialState,
  on(fetchNotificationlistData, (state, { page, itemsPerPage }) => ({
    ...state,
    currentPage: page,
    loading: true,
    error: null
  })),
  on(fetchNotificationlistSuccess, (state, { NotificationListdata }) => ({
    ...state,
    NotificationListdata: NotificationListdata.data,
    totalItems: NotificationListdata.totalItems,
    loading: false
  })),
  on(fetchMyNotificationlistSuccess, (state, { NotificationListdata }) => ({
    ...state,
    NotificationListdata: NotificationListdata,
    loading: false
  })),
  on(fetchNotificationlistFail, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  //Handle adding Notification success
  on(addNotificationlistSuccess, (state, { newData }) => ({
    ...state,
    NotificationListdata: [ newData,...state.NotificationListdata],
    loading: false
  })),
  // Handle success of getting Notification by ID and store the Notification object in the state
   on(getNotificationByIdSuccess, (state, { Notification }) => ({
    ...state,
    selectedNotification: Notification
  })),


  // Handle updating Notification list
  on(updateNotificationStatusSuccess, (state, { updatedData }) => {
    return {
      ...state,
      NotificationListdata: state.NotificationListdata.map(item =>
        item.id === updatedData.NotificationId ? { ...item, status: updatedData.status } : item
      )
    };
  }),
// Handle updating Notification status
  on(updateNotificationlistSuccess, (state, { updatedData }) => {
   const NotificationListUpdated = state.NotificationListdata.map(item => item.id === updatedData.id ? updatedData : item );
   console.log('NotificationListdata after update:', NotificationListUpdated);
   return {
      ...state,
      NotificationListdata: NotificationListUpdated
    };
  }),
  // Handle the success of deleting a Notification
  on(deleteNotificationlistSuccess, (state, { notificationId }) => {
    console.log('Deleting Notification with ID:', notificationId);
    console.log('NotificationListdata before deletion:', state.NotificationListdata);
    const updatedNotificationList = state.NotificationListdata.filter(Notification => Notification.id !== notificationId);
    console.log('NotificationListdata after deletion:', updatedNotificationList);
    return { 
    ...state,
    NotificationListdata: updatedNotificationList};
  }),
  // Handle failure of deleting a Notification
  on(deleteNotificationlistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
