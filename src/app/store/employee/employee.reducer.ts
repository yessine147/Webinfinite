// src/app/Employeelist.reducer.ts
import { createReducer, on } from '@ngrx/store';
import {  addEmployeelist, addEmployeelistFailure, addEmployeelistSuccess, deleteEmployeelist, deleteEmployeelistFailure, deleteEmployeelistSuccess, fetchEmployeelistData, fetchEmployeelistFail, fetchEmployeelistSuccess, getEmployeeById, getEmployeeByIdFailure, getEmployeeByIdSuccess, updateEmployeelist, updateEmployeelistFailure, updateEmployeelistSuccess } from './employee.action';
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
    loading: false,
    error: null
  })),
  on(fetchEmployeelistFail, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  //Handle adding Employee 
  on(addEmployeelist, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  //Handle adding Employee success
  on(addEmployeelistSuccess, (state, { newData }) => ({
    ...state,
    EmployeeListdata: [...state.EmployeeListdata, newData],
    loading: false
  })),
   //Handle adding Employee failure
   on(addEmployeelistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false, 
  })),
  //Handle getting Employee by id
  on(getEmployeeById, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  // Handle success of getting Employee by ID and store the Employee object in the state
   on(getEmployeeByIdSuccess, (state, { employee }) => ({
    ...state,
    selectedEmployee: employee,
    loading: false,
    error: null
  })),
// Handle success of getting Employee by ID and store the Employee object in the state
on(getEmployeeByIdFailure, (state, { error }) => ({
  ...state,
  error,
  loading: false, 
})),
// Handle updating Employee list
on(updateEmployeelist, (state) => ({
  ...state,
  loading: true,
  error: null 
})),
 
// Handle updating Employee success
  on(updateEmployeelistSuccess, (state, { updatedData }) => {
   const EmployeeListUpdated = state.EmployeeListdata.map(item => item.id === updatedData.id ? updatedData : item );
   console.log('EmployeeListdata after update:', EmployeeListUpdated);
   return {
      ...state,
      EmployeeListdata: EmployeeListUpdated
    };
  }),
  // Handle updating Employee failure
  on(updateEmployeelistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false 
  })),
  // Handle deleting Employee 
  on(deleteEmployeelist, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  // Handle the success of deleting a Employee
  on(deleteEmployeelistSuccess, (state, { employeeId }) => {
    const updatedEmployeeList = state.EmployeeListdata.filter(Employee => Employee.id !== employeeId);
    console.log('EmployeeListdata after deletion:', updatedEmployeeList);
    return { 
    ...state,
    EmployeeListdata: updatedEmployeeList,
    loading: false,
    error: null};
  }),
  // Handle failure of deleting a Employee
  on(deleteEmployeelistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
