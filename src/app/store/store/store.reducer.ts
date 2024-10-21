// src/app/Storelist.reducer.ts
import { createReducer, on } from '@ngrx/store';
import {  addStorelistSuccess, deleteStorelistFailure, deleteStorelistSuccess, fetchStorelistData, fetchStorelistFail, fetchStorelistSuccess, getStoreByIdSuccess, updateStorelistSuccess, updateStoreStatusSuccess } from './store.action';

export interface StorelistState {
  StoreListdata: any[];
  currentPage: number;
  totalItems: number;
  selectedStore: any,
  loading: boolean;
  error: any;
}

export const initialState: StorelistState = {
  StoreListdata: [],
  currentPage: 1,
  totalItems: 0,
  selectedStore: null,
  loading: false,
  error: null,
};

export const StoreListReducer = createReducer(
  initialState,
  on(fetchStorelistData,(state, { page, itemsPerPage }) => ({
    ...state,
    currentPage: page,
    loading: true,
    error: null
  })),
  on(fetchStorelistSuccess, (state, { StoreListdata }) => ({
    ...state,
    StoreListdata: StoreListdata.data,
    totalItems: StoreListdata.totalItems,
    loading: false
  })),
  on(fetchStorelistFail, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  //Handle adding Store success
  on(addStorelistSuccess, (state, { newData }) => ({
    ...state,
    StoreListdata: [newData,...state.StoreListdata ],
    loading: false
  })),
  // Handle success of getting Employee by ID and store the Employee object in the state
  on(getStoreByIdSuccess, (state, { Store }) => ({
    ...state,
    selectedStore: Store
  })),
  // Handle updating Store list
  on(updateStoreStatusSuccess, (state, { updatedData }) => {
    return {
      ...state,
      StoreListdata: state.StoreListdata.map(item =>
        item.id === updatedData.id ? { ...item, status: updatedData.status } : item
      )
    };
  }),
// Handle updating Store status
  on(updateStorelistSuccess, (state, { updatedData }) => {
   const StoreListUpdated = state.StoreListdata.map(item => item.id === updatedData.id ? updatedData : item );
   console.log('StoreListdata after update:', StoreListUpdated);
   return {
      ...state,
      StoreListdata: StoreListUpdated
    };
  }),
  // Handle the success of deleting a Store
  on(deleteStorelistSuccess, (state, { storeId }) => {
    console.log('Deleting Store with ID:', storeId);
    console.log('StoreListdata before deletion:', state.StoreListdata);
    const updatedStoreList = state.StoreListdata.filter(Store => Store.id !== storeId);
    console.log('StoreListdata after deletion:', updatedStoreList);
    return { 
    ...state,
    StoreListdata: updatedStoreList};
  }),
  // Handle failure of deleting a Store
  on(deleteStorelistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
