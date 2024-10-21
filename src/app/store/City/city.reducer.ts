// src/app/Citylist.reducer.ts
import { createReducer, on } from '@ngrx/store';
import {  addCitylistSuccess, deleteCitylistFailure, deleteCitylistSuccess, fetchCitylistData, fetchCitylistFail, fetchCitylistSuccess, getCityByIdSuccess, updateCitylistSuccess, updateCityStatusSuccess } from './city.action';

export interface CitylistState {
  CityListdata: any[];
  currentPage: number;
  totalItems: number;
  selectedCity: any,
  loading: boolean;
  error: any;
}

export const initialState: CitylistState = {
  CityListdata: [],
  currentPage: 1,
  totalItems: 0,
  selectedCity: null,
  loading: false,
  error: null,
};

export const CityListReducer = createReducer(
  initialState,
  on(fetchCitylistData, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(fetchCitylistSuccess, (state, { CityListdata }) => ({
    ...state,
    CityListdata: CityListdata.data,
    totalItems: CityListdata.totalItems,
    loading: false
  })),
  on(fetchCitylistFail, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  //Handle adding City success
  on(addCitylistSuccess, (state, { newData }) => ({
    ...state,
    CityListdata: [...state.CityListdata, newData],
    loading: false
  })),
  // Handle success of getting City by ID and City the City object in the state
  on(getCityByIdSuccess, (state, { City }) => ({
    ...state,
    selectedCity: City
  })),
  // Handle updating status  City list
  on(updateCityStatusSuccess, (state, { updatedData }) => {
    return {
      ...state,
      CityListdata: state.CityListdata.map(item =>
        item.id === updatedData.id ? { ...item, status: updatedData.status } : item
      )
    };
  }),
// Handle updating City 
  on(updateCitylistSuccess, (state, { updatedData }) => {
   const CityListUpdated = state.CityListdata.map(item => item.id === updatedData.id ? updatedData : item );
   console.log('CityListdata after update:', CityListUpdated);
   return {
      ...state,
      CityListdata: CityListUpdated
    };
  }),
  // Handle the success of deleting a City
  on(deleteCitylistSuccess, (state, { CityId }) => {
    console.log('Deleting City with ID:', CityId);
    console.log('CityListdata before deletion:', state.CityListdata);
    const updatedCityList = state.CityListdata.filter(City => City.id !== CityId);
    console.log('CityListdata after deletion:', updatedCityList);
    return { 
    ...state,
    CityListdata: updatedCityList};
  }),
  // Handle failure of deleting a City
  on(deleteCitylistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
