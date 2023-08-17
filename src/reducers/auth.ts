import { Action } from "redux";
import { SAVE_TOKEN } from "@constants/auth";

interface PayloadAction extends Action {
    payload: any;
}

interface IState {
    token: string;
}

const initialState: IState = {
    token: "",
};

const auth = (state = initialState, action: PayloadAction) => {
    switch (action.type) {
        case SAVE_TOKEN: {
            const token = action.payload;
            return {
                ...state,
                token: token,
            };
        }
        default:
            return state;
    }
};
export default auth;
