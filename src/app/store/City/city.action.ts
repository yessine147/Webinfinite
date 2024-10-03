import { createAction, props } from '@ngrx/store';
import { CityListModel } from './city.model';

// fetch all list
export const fetchCitylistData = createAction('[Data] fetch Citylist');
export const fetchCitylistSuccess = createAction('[Data] fetch Citylist success', props<{ CityListdata: CityListModel[] }>())
export const fetchCitylistFail = createAction('[Data fetch Citylist failed]', props<{ error: string }>())


// Update Data
export const updateCityStatus = createAction(
    '[Data] Update City status',
    props<{ userId: string, status: string }>()
    //props<{ updatedData: CityApprovalListModel }>()
);
export const updateCityStatusSuccess = createAction(
    '[Data] Update City Status Success',
    props<{ updatedData: any }>()
);
export const updateCityStatusFailure = createAction(
    '[Data] Update City Status Failure',
    props<{ error: string }>()
);

// Add Data
export const addCitylist = createAction('[Data] Add Citylist',  props<{ newData: CityListModel }>());
export const addCitylistSuccess = createAction('[Data] Add Citylist Success', props<{ newData: any }>());
export const addCitylistFailure = createAction('[Data] Add Citylist Failure', props<{ error: string }>());
//get City by ID
export const getCityById = createAction('[Data] get City', props<{ CityId: string }>());
export const getCityByIdSuccess = createAction('[Data] get City success', props<{ City: any }>());

// Update Data
export const updateCitylist = createAction(
    '[Data] Update Citylist',
    props<{ updatedData: CityListModel }>()
);
export const updateCitylistSuccess = createAction(
    '[Data] Update Citylist Success',
    props<{ updatedData: CityListModel }>()
);
export const updateCitylistFailure = createAction(
    '[Data] Update Citylist Failure',
    props<{ error: string }>()
);

// Delete Data
export const deleteCitylist = createAction(
    '[Data] Delete Citylist',
    props<{ CityId: string }>()
);
export const deleteCitylistSuccess = createAction(
    '[Data] Delete Citylist Success',
    props<{ CityId: string }>()
);
export const deleteCitylistFailure = createAction(
    '[Data] Delete Citylist Failure',
    props<{ error: string }>()
);