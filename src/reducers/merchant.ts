import { Action } from "redux";
import IMerchant from "@interfaces/IMerchant";
import { SAVE_MERCHANT } from "@constants/merchant";

interface PayloadAction extends Action {
    payload: any;
}

interface IState {
    merchant: IMerchant | null;
}

const initialState: IState = {
    merchant: null,
};

const merchant = (state = initialState, action: PayloadAction) => {
    switch (action.type) {
        case SAVE_MERCHANT: {
            const newState: IState = {
                ...state,
                merchant: action?.payload,
            };
            return newState;
        }
        default:
            return state;
    }
};
export default merchant;
