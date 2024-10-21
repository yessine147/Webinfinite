import { ActionReducerMap } from "@ngrx/store";
import { EcoOrderState, OrderReducer } from "./orders/order.reducer";
import { AuthenticationState, authenticationReducer } from "./Authentication/authentication.reducer";
import { CartReducer, CartState } from "./Cart/cart.reducer";
import { UserReducer, UserState } from "./UserGrid/user.reducer";
import { UserListReducer, UserlistState } from "./UserList/userlist.reducer";
import { CandidateReducer, CandidateState } from "./Candidate/candidate.reducer";
import { InvoiceDataReducer, InvoiceDataState } from "./Invoices/invoices.reducer";
import { ChatReducer, ChatState } from "./Chat/chat.reducer";
import { OrderdataState, OrdersReducer } from "./Crypto/crypto.reducer";
import { LayoutState, layoutReducer } from "./layouts/layouts.reducer";
import { CustomerReducer, CustomerState } from "./customer/customer.reducer";
import { MailReducer, MailState } from "./Email/email.reducer";
import { MerchantListReducer, MerchantlistState } from "./merchantsList/merchantlist1.reducer";
import { CouponListReducer, CouponlistState } from "./coupon/coupon.reducer";
import { EmployeeListReducer, EmployeelistState } from "./employee/employee.reducer";
import { StoreListReducer, StorelistState } from "./store/store.reducer";
import { CountryListReducer, CountrylistState } from "./country/country.reducer";
import { AreaListReducer, ArealistState } from "./area/area.reducer";
import { CityListReducer, CitylistState } from "./City/city.reducer";
import { NotificationListReducer, NotificationlistState } from "./notification/notification.reducer";
import { RoleListReducer, RolelistState } from "./Role/role.reducer";
import { SectionListReducer, SectionlistState } from "./section/section.reducer";
import { GiftCardListReducer, GiftCardlistState } from "./giftCard/giftCard.reducer";


export interface RootReducerState {
    layout: LayoutState;
    auth: AuthenticationState;
    EcoOrderList: EcoOrderState;
    CartList: CartState;
    usergrid: UserState;
    userList: UserlistState;
    CandidateList: CandidateState;
    InvoiceList: InvoiceDataState;
    chatList: ChatState;
    Order: OrderdataState;
    Customer: CustomerState;
    Maillist: MailState;
    MerchantList: MerchantlistState;
    CouponList: CouponlistState;
    EmployeeList: EmployeelistState;
    StoreList: StorelistState;
    CountryList: CountrylistState;
    AreaList: ArealistState;
    CityList: CitylistState;
    NotificationList: NotificationlistState;
    RoleList: RolelistState;
    SectionList: SectionlistState;
    GiftCardList: GiftCardlistState;
    
}

export const rootReducer: ActionReducerMap<RootReducerState> = {
    layout: layoutReducer,
    auth: authenticationReducer,
    EcoOrderList: OrderReducer,
    CartList: CartReducer,
    usergrid: UserReducer,
    userList: UserListReducer,
    CandidateList: CandidateReducer,
    InvoiceList: InvoiceDataReducer,
    chatList: ChatReducer,
    Order: OrdersReducer,
    Customer: CustomerReducer,
    Maillist: MailReducer,
    MerchantList:MerchantListReducer,
    CouponList: CouponListReducer,
    EmployeeList: EmployeeListReducer,
    StoreList: StoreListReducer,
    CountryList: CountryListReducer,
    AreaList: AreaListReducer,
    CityList: CityListReducer,
    NotificationList: NotificationListReducer,
    RoleList: RoleListReducer,
    SectionList: SectionListReducer,
    GiftCardList: GiftCardListReducer

}