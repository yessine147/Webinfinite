// src/app/Countrylist.reducer.ts
import { createReducer, on } from '@ngrx/store';
import {  addCountrylistSuccess, deleteCountrylistFailure, deleteCountrylistSuccess, fetchCountrylistData, fetchCountrylistFail, fetchCountrylistSuccess, getCountryByIdSuccess, updateCountrylistSuccess, updateCountryStatusSuccess } from './country.action';

export interface CountrylistState {
  CountryListdata: any[];
  currentPage: number;
  totalItems: number;
  selectedCountry: any,
  loading: boolean;
  error: any;
}

export const initialState: CountrylistState = {
  CountryListdata: [],
  currentPage: 1,
  totalItems: 0,
  selectedCountry: null,
  loading: false,
  error: null,
};

export const CountryListReducer = createReducer(
  initialState,
  on(fetchCountrylistData,  (state, { page, itemsPerPage, status }) => ({
    ...state,
    currentPage: page,
    loading: true,
    error: null
  })),
  on(fetchCountrylistSuccess, (state, { CountryListdata }) => ({
    ...state,
    CountryListdata: CountryListdata.data,
    totalItems: CountryListdata.totalItems,
    loading: false
  })),
  on(fetchCountrylistFail, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  //Handle adding Country success
  on(addCountrylistSuccess, (state, { newData }) => ({
    ...state,
    CountryListdata: [...state.CountryListdata, newData],
    loading: false
  })),
  // Handle success of getting Employee by ID and Country the Employee object in the state
  on(getCountryByIdSuccess, (state, { Country }) => ({
    ...state,
    selectedCountry: Country
  })),
  // Handle updating status  Country list
  on(updateCountryStatusSuccess, (state, { updatedData }) => {
    return {
      ...state,
      CountryListdata: state.CountryListdata.map(item =>
        item.id === updatedData.id ? { ...item, status: updatedData.status } : item
      )
    };
  }),
// Handle updating Country 
  on(updateCountrylistSuccess, (state, { updatedData }) => {
   const CountryListUpdated = state.CountryListdata.map(item => item.id === updatedData.id ? updatedData : item );
   console.log('CountryListdata after update:', CountryListUpdated);
   return {
      ...state,
      CountryListdata: CountryListUpdated
    };
  }),
  // Handle the success of deleting a Country
  on(deleteCountrylistSuccess, (state, { CountryId }) => {
    console.log('Deleting Country with ID:', CountryId);
    console.log('CountryListdata before deletion:', state.CountryListdata);
    const updatedCountryList = state.CountryListdata.filter(Country => Country.id !== CountryId);
    console.log('CountryListdata after deletion:', updatedCountryList);
    return { 
    ...state,
    CountryListdata: updatedCountryList};
  }),
  // Handle failure of deleting a Country
  on(deleteCountrylistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
