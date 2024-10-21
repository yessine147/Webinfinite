import { createAction, props } from '@ngrx/store';
import { CouponListModel } from './coupon.model';

// fetch all list
export const fetchCouponlistData = createAction('[Data] fetch Couponlist',props<{ page: number; itemsPerPage: number, status?: string }>());
export const fetchCouponlistSuccess = createAction('[Data] fetch Couponlist success', props<{ CouponListdata: CouponListModel[] }>())
export const fetchCouponlistFail = createAction('[Data fetch Couponlist failed]', props<{ error: string }>())


// Update Data
export const updateCouponStatus = createAction(
    '[Data] Update Coupon status',
    props<{ couponId: string, status: string }>()
    //props<{ updatedData: CouponApprovalListModel }>()
);
export const updateCouponStatusSuccess = createAction(
    '[Data] Update Coupon Status Success',
    props<{ updatedData: any }>()
);
export const updateCouponStatusFailure = createAction(
    '[Data] Update Coupon Status Failure',
    props<{ error: string }>()
);

// Add Data
export const addCouponlist = createAction('[Data] Add Couponlist',  props<{ newData: CouponListModel }>());
export const addCouponlistSuccess = createAction('[Data] Add Couponlist Success', props<{ newData: any }>());
export const addCouponlistFailure = createAction('[Data] Add Couponlist Failure', props<{ error: string }>());
//get coupon by ID
export const getCouponById = createAction('[Data] get Coupon', props<{ couponId: string }>());
export const getCouponByIdSuccess = createAction('[Data] get Coupon success', props<{ coupon: any }>());

// Update Data
export const updateCouponlist = createAction(
    '[Data] Update Couponlist',
    props<{ updatedData: CouponListModel }>()
);
export const updateCouponlistSuccess = createAction(
    '[Data] Update Couponlist Success',
    props<{ updatedData: CouponListModel }>()
);
export const updateCouponlistFailure = createAction(
    '[Data] Update Couponlist Failure',
    props<{ error: string }>()
);

// Delete Data
export const deleteCouponlist = createAction(
    '[Data] Delete Couponlist',
    props<{ couponId: string }>()
);
export const deleteCouponlistSuccess = createAction(
    '[Data] Delete Couponlist Success',
    props<{ couponId: string }>()
);
export const deleteCouponlistFailure = createAction(
    '[Data] Delete Couponlist Failure',
    props<{ error: string }>()
);