import { Action } from "redux";
import { SAVE_CATEGORIES } from "@constants/category";
import ICategory from "@interfaces/ICategory";

interface PayloadAction extends Action {
    payload: any;
}

interface IState {
    categories: ICategory[];
}

const initialState: IState = {
    categories: [],
};

const category = (state = initialState, action: PayloadAction) => {
    switch (action.type) {
        case SAVE_CATEGORIES: {
            const newState: IState = {
                ...state,
                categories: action?.payload,
            };
            return newState;
        }
        default:
            return state;
    }
};
export default category;
