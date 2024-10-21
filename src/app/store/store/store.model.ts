export interface StoreListModel {
    
     id?: string;
     name ?: string  ;
     description?:  string ;
     phone?: string;
     merchantId?: string;
     merchant ?:   string;
     cityId?: string;
     city? :  string ;
     images ?:  any[];  
     offers ?:  any[];  
     status? : Status;
     updatedAt? :  string;
     createdAt?: string;

}

export enum Status {

   pending = 1,
   active = 2,
   inactive = 3,
   deleted = 4

  }
