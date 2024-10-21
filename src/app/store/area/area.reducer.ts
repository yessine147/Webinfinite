// src/app/Arealist.reducer.ts
import { createReducer, on } from '@ngrx/store';
import {  addArealistSuccess, deleteArealistFailure, deleteArealistSuccess, fetchArealistData, fetchArealistFail, fetchArealistSuccess, getAreaByIdSuccess, updateArealistSuccess, updateAreaStatusSuccess } from './area.action';

export interface ArealistState {
  AreaListdata: any[];
  currentPage: number;
  totalItems: number;
  selectedArea: any,
  loading: boolean;
  error: any;
}

export const initialState: ArealistState = {
  AreaListdata: [],
  currentPage: 1,
  totalItems: 0,
  selectedArea: null,
  loading: false,
  error: null,
};

export const AreaListReducer = createReducer(
  initialState,
  on(fetchArealistData, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(fetchArealistSuccess, (state, { AreaListdata }) => ({
    ...state,
    AreaListdata: AreaListdata.data,
    totalItems: AreaListdata.totalItems,
    loading: false
  })),
  on(fetchArealistFail, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  //Handle adding Area success
  on(addArealistSuccess, (state, { newData }) => ({
    ...state,
    AreaListdata: [...state.AreaListdata, newData],
    loading: false
  })),
  // Handle success of getting Area by ID and Area the Area object in the state
  on(getAreaByIdSuccess, (state, { Area }) => ({
    ...state,
    selectedArea: Area
  })),
  // Handle updating status  Area list
  on(updateAreaStatusSuccess, (state, { updatedData }) => {
    return {
      ...state,
      AreaListdata: state.AreaListdata.map(item =>
        item.id === updatedData.id ? { ...item, status: updatedData.status } : item
      )
    };
  }),
// Handle updating Area 
  on(updateArealistSuccess, (state, { updatedData }) => {
   const AreaListUpdated = state.AreaListdata.map(item => item.id === updatedData.id ? updatedData : item );
   console.log('AreaListdata after update:', AreaListUpdated);
   return {
      ...state,
      AreaListdata: AreaListUpdated
    };
  }),
  // Handle the success of deleting a Area
  on(deleteArealistSuccess, (state, { AreaId }) => {
    console.log('Deleting Area with ID:', AreaId);
    console.log('AreaListdata before deletion:', state.AreaListdata);
    const updatedAreaList = state.AreaListdata.filter(Area => Area.id !== AreaId);
    console.log('AreaListdata after deletion:', updatedAreaList);
    return { 
    ...state,
    AreaListdata: updatedAreaList};
  }),
  // Handle failure of deleting a Area
  on(deleteArealistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
