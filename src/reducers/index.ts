import { combineReducers } from "redux";
import merchant from "./merchant";
import customer from "./customer";
import auth from "./auth";
import service from "./service";
import category from "./category";
import cart from "./cart";
import staff from "./staff";
import time from "./time";
import appointment from "./appointment";

const rootReducer = combineReducers({
    merchant: merchant,
    customer: customer,
    auth: auth,
    service: service,
    category: category,
    cart: cart,
    staff: staff,
    time: time,
    appointment: appointment,
});
export default rootReducer;
