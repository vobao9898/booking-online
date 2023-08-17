import { Action } from "redux";
import ICustomer from "@interfaces/ICustomer";
import { SAVE_CUSTOMER } from "@constants/customer";

interface PayloadAction extends Action {
    payload: any;
}

interface IState {
    customer: ICustomer | null;
}

const initialState: IState = {
    customer: null,
};

const customer = (state = initialState, action: PayloadAction) => {
    switch (action.type) {
        case SAVE_CUSTOMER: {
            const newState: IState = {
                ...state,
                customer: action?.payload,
            };
            return newState;
        }
        default:
            return state;
    }
};
export default customer;
