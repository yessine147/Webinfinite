// src/app/Couponlist.reducer.ts
import { createReducer, on } from '@ngrx/store';
import {  addCouponlistSuccess, deleteCouponlistFailure, deleteCouponlistSuccess, fetchCouponlistData, fetchCouponlistFail, fetchCouponlistSuccess, getCouponByIdSuccess, updateCouponlistSuccess, updateCouponStatusSuccess } from './coupon.action';
import { CouponListModel } from './coupon.model';

export interface CouponlistState {
  CouponListdata: any[];
  currentPage: number;
  totalItems: number;
  selectedCoupon: any;
  loading: boolean;
  error: any;
}

export const initialState: CouponlistState = {
  CouponListdata: [],
  currentPage: 1,
  totalItems: 0,
  selectedCoupon: null,
  loading: false,
  error: null,
};

export const CouponListReducer = createReducer(
  initialState,
  on(fetchCouponlistData, (state, { page, itemsPerPage }) => ({
    ...state,
    currentPage: page,
    loading: true,
    error: null
  })),
  on(fetchCouponlistSuccess, (state, { CouponListdata }) => ({
    ...state,
    CouponListdata: CouponListdata.data,
    totalItems: CouponListdata.totalItems,
    loading: false
  })),
  on(fetchCouponlistFail, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  //Handle adding Coupon success
  on(addCouponlistSuccess, (state, { newData }) => ({
    ...state,
    CouponListdata: [newData,...state.CouponListdata ],
    loading: false
  })),
  // Handle success of getting coupon by ID and store the coupon object in the state
   on(getCouponByIdSuccess, (state, { coupon }) => ({
    ...state,
    selectedCoupon: coupon
  })),


  // Handle updating Coupon list
  on(updateCouponStatusSuccess, (state, { updatedData }) => {
    return {
      ...state,
      CouponListdata: state.CouponListdata.map(item =>
        item.id === updatedData.couponId ? { ...item, status: updatedData.status } : item
      )
    };
  }),
// Handle updating Coupon status
  on(updateCouponlistSuccess, (state, { updatedData }) => {
   const CouponListUpdated = state.CouponListdata.map(item => item.id === updatedData.id ? updatedData : item );
   console.log('CouponListdata after update:', CouponListUpdated);
   return {
      ...state,
      CouponListdata: CouponListUpdated
    };
  }),
  // Handle the success of deleting a Coupon
  on(deleteCouponlistSuccess, (state, { couponId }) => {
    console.log('Deleting Coupon with ID:', couponId);
    console.log('CouponListdata before deletion:', state.CouponListdata);
    const updatedCouponList = state.CouponListdata.filter(Coupon => Coupon.id !== couponId);
    console.log('CouponListdata after deletion:', updatedCouponList);
    return { 
    ...state,
    CouponListdata: updatedCouponList};
  }),
  // Handle failure of deleting a Coupon
  on(deleteCouponlistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
