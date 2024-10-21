// src/app/GiftCardlist.reducer.ts
import { createReducer, on } from '@ngrx/store';
import {  addGiftCardlistSuccess, deleteGiftCardlistFailure, deleteGiftCardlistSuccess, fetchGiftCardlistData, fetchGiftCardlistFail, fetchGiftCardlistSuccess, getGiftCardByIdSuccess, updateGiftCardlistSuccess, updateGiftCardStatusSuccess } from './giftCard.action';
import { GiftCardListModel } from './giftCard.model';

export interface GiftCardlistState {
  GiftCardListdata: any[];
  currentPage: number;
  totalItems: number;
  selectedGiftCard: any;
  loading: boolean;
  error: any;
}

export const initialState: GiftCardlistState = {
  GiftCardListdata: [],
  currentPage: 1,
  totalItems: 0,
  selectedGiftCard: null,
  loading: false,
  error: null,
};

export const GiftCardListReducer = createReducer(
  initialState,
  on(fetchGiftCardlistData, (state, { page, itemsPerPage }) => ({
    ...state,
    currentPage: page,
    loading: true,
    error: null
  })),
  on(fetchGiftCardlistSuccess, (state, { GiftCardListdata }) => ({
    ...state,
    GiftCardListdata: GiftCardListdata.data,
    totalItems: GiftCardListdata.totalItems,
    loading: false
  })),
  on(fetchGiftCardlistFail, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  //Handle adding GiftCard success
  on(addGiftCardlistSuccess, (state, { newData }) => ({
    ...state,
    GiftCardListdata: [newData,...state.GiftCardListdata ],
    loading: false
  })),
  // Handle success of getting GiftCard by ID and store the GiftCard object in the state
   on(getGiftCardByIdSuccess, (state, { GiftCard }) => ({
    ...state,
    selectedGiftCard: GiftCard
  })),


  // Handle updating GiftCard list
  on(updateGiftCardStatusSuccess, (state, { updatedData }) => {
    return {
      ...state,
      GiftCardListdata: state.GiftCardListdata.map(item =>
        item.id === updatedData.GiftCardId ? { ...item, status: updatedData.status } : item
      )
    };
  }),
// Handle updating GiftCard status
  on(updateGiftCardlistSuccess, (state, { updatedData }) => {
   const GiftCardListUpdated = state.GiftCardListdata.map(item => item.id === updatedData.id ? updatedData : item );
   console.log('GiftCardListdata after update:', GiftCardListUpdated);
   return {
      ...state,
      GiftCardListdata: GiftCardListUpdated
    };
  }),
  // Handle the success of deleting a GiftCard
  on(deleteGiftCardlistSuccess, (state, { GiftCardId }) => {
    console.log('Deleting GiftCard with ID:', GiftCardId);
    console.log('GiftCardListdata before deletion:', state.GiftCardListdata);
    const updatedGiftCardList = state.GiftCardListdata.filter(GiftCard => GiftCard.id !== GiftCardId);
    console.log('GiftCardListdata after deletion:', updatedGiftCardList);
    return { 
    ...state,
    GiftCardListdata: updatedGiftCardList};
  }),
  // Handle failure of deleting a GiftCard
  on(deleteGiftCardlistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
