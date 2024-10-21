// src/app/Employeelist.reducer.ts
import { createReducer, on } from '@ngrx/store';
import {  addEmployeelistSuccess, deleteEmployeelistFailure, deleteEmployeelistSuccess, fetchEmployeelistData, fetchEmployeelistFail, fetchEmployeelistSuccess, getEmployeeByIdSuccess, updateEmployeelistSuccess, updateEmployeeStatusSuccess } from './employee.action';
import { EmployeeListModel } from './employee.model';

export interface EmployeelistState {
  EmployeeListdata: any[];
  totalItems: number;
  selectedEmployee: any;
  loading: boolean;
  error: any;
}

export const initialState: EmployeelistState = {
  EmployeeListdata: [],
  totalItems: 0,
  selectedEmployee: null,
  loading: false,
  error: null,
};

export const EmployeeListReducer = createReducer(
  initialState,
  on(fetchEmployeelistData, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(fetchEmployeelistSuccess, (state, { EmployeeListdata }) => ({
    ...state,
    EmployeeListdata: EmployeeListdata.data,
    totalItems:EmployeeListdata.totalItems,
    loading: false
  })),
  on(fetchEmployeelistFail, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  //Handle adding Employee success
  on(addEmployeelistSuccess, (state, { newData }) => ({
    ...state,
    EmployeeListdata: [...state.EmployeeListdata, newData],
    loading: false
  })),
  // Handle success of getting Employee by ID and store the Employee object in the state
   on(getEmployeeByIdSuccess, (state, { employee }) => ({
    ...state,
    selectedEmployee: employee
  })),


  // Handle updating Employee list
  on(updateEmployeeStatusSuccess, (state, { updatedData }) => {
    return {
      ...state,
      EmployeeListdata: state.EmployeeListdata.map(item =>
        item.id === updatedData.EmployeeId ? { ...item, status: updatedData.status } : item
      )
    };
  }),
// Handle updating Employee status
  on(updateEmployeelistSuccess, (state, { updatedData }) => {
   const EmployeeListUpdated = state.EmployeeListdata.map(item => item.id === updatedData.id ? updatedData : item );
   console.log('EmployeeListdata after update:', EmployeeListUpdated);
   return {
      ...state,
      EmployeeListdata: EmployeeListUpdated
    };
  }),
  // Handle the success of deleting a Employee
  on(deleteEmployeelistSuccess, (state, { employeeId }) => {
    console.log('Deleting Employee with ID:', employeeId);
    console.log('EmployeeListdata before deletion:', state.EmployeeListdata);
    const updatedEmployeeList = state.EmployeeListdata.filter(Employee => Employee.id !== employeeId);
    console.log('EmployeeListdata after deletion:', updatedEmployeeList);
    return { 
    ...state,
    EmployeeListdata: updatedEmployeeList};
  }),
  // Handle failure of deleting a Employee
  on(deleteEmployeelistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
