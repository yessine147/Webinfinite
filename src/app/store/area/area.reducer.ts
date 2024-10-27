// src/app/Arealist.reducer.ts
import { createReducer, on } from '@ngrx/store';
import {  addArealist, addArealistFailure, addArealistSuccess, deleteArealist, deleteArealistFailure, deleteArealistSuccess, fetchArealistData, fetchArealistFail, fetchArealistSuccess, getAreaById, getAreaByIdFailure, getAreaByIdSuccess, updateArealist, updateArealistFailure, updateArealistSuccess } from './area.action';

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
    loading: false,
    error: null

  })),
  on(fetchArealistFail, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  
  //Handle adding Area 
  on(addArealist, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  //Handle adding Area success
  on(addArealistSuccess, (state, { newData }) => ({
    ...state,
    AreaListdata: [...state.AreaListdata, newData],
    loading: false
  })),
   //Handle adding Area failure
   on(addArealistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false 
  })),
  //Handle getting Area by id
  on(getAreaById, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  // Handle success of getting Area by ID and Area the Area object in the state
  on(getAreaByIdSuccess, (state, { Area }) => ({
    ...state,
    selectedArea: Area
  })),
   // Handle success of getting Area by ID and store the Area object in the state
   on(getAreaByIdFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false, 
  })),
  // Handle updating Area list
  on(updateArealist, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  

// Handle updating Area 
  on(updateArealistSuccess, (state, { updatedData }) => {
   const AreaListUpdated = state.AreaListdata.map(item => item.id === updatedData.id ? updatedData : item );
   console.log('AreaListdata after update:', AreaListUpdated);
   return {
      ...state,
      AreaListdata: AreaListUpdated
    };
  }),
   // Handle updating Area failure
   on(updateArealistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false 
  })),
  // Handle deleting Area 
  on(deleteArealist, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  // Handle the success of deleting a Area
  on(deleteArealistSuccess, (state, { AreaId }) => {
    const updatedAreaList = state.AreaListdata.filter(Area => Area.id !== AreaId);
    return { 
    ...state,
    AreaListdata: updatedAreaList,
    loading: false,
    error: null};
  }),
  // Handle failure of deleting a Area
  on(deleteArealistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
