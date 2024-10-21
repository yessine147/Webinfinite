// src/app/Rolelist.reducer.ts
import { createReducer, on } from '@ngrx/store';
import {  addRolelistSuccess, deleteRolelistFailure, deleteRolelistSuccess, fetchRolelistData, fetchRolelistFail, fetchRolelistSuccess, getRoleByIdSuccess, updateRolelistSuccess, updateRoleStatusSuccess } from './role.actions';

export interface RolelistState {
  RoleListdata: any[];
  currentPage: number;
  totalItems: number;
  selectedRole: any;
  loading: boolean;
  error: any;
}

export const initialState: RolelistState = {
  RoleListdata: [],
  currentPage: 1,
  totalItems: 0,
  selectedRole: null,
  loading: false,
  error: null,
};

export const RoleListReducer = createReducer(
  initialState,
  on(fetchRolelistData, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(fetchRolelistSuccess, (state, { RoleListdata }) => ({
    ...state,
    RoleListdata: RoleListdata.data,
    totalItems:RoleListdata.totalItems,
    loading: false
  })),
  on(fetchRolelistFail, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  //Handle adding Role success
  on(addRolelistSuccess, (state, { newData }) => ({
    ...state,
    RoleListdata: [newData,...state.RoleListdata],
    loading: false
  })),
  // Handle success of getting Role by ID and store the Role object in the state
   on(getRoleByIdSuccess, (state, { Role }) => ({
    ...state,
    selectedRole: Role
  })),


  // Handle updating Role list
  on(updateRoleStatusSuccess, (state, { updatedData }) => {
    return {
      ...state,
      RoleListdata: state.RoleListdata.map(item =>
        item.id === updatedData.RoleId ? { ...item, status: updatedData.status } : item
      )
    };
  }),
// Handle updating Role status
  on(updateRolelistSuccess, (state, { updatedData }) => {
   const RoleListUpdated = state.RoleListdata.map(item => item.id === updatedData.id ? updatedData : item );
   console.log('RoleListdata after update:', RoleListUpdated);
   return {
      ...state,
      RoleListdata: RoleListUpdated
    };
  }),
  // Handle the success of deleting a Role
  on(deleteRolelistSuccess, (state, { RoleId }) => {
    console.log('Deleting Role with ID:', RoleId);
    console.log('RoleListdata before deletion:', state.RoleListdata);
    const updatedRoleList = state.RoleListdata.filter(Role => Role.id !== RoleId);
    console.log('RoleListdata after deletion:', updatedRoleList);
    return { 
    ...state,
    RoleListdata: updatedRoleList};
  }),
  // Handle failure of deleting a Role
  on(deleteRolelistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
