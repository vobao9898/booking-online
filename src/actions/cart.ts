import {
    SELECT_SERVICE,
    SELECT_STAFF,
    ADD_EXTRA,
    REMOVE_EXTRA,
    STAFF_TIME,
    SELECT_DATE_TIME,
    ADD_ITEM_TO_CART,
    REMOVE_ITEM_IN_CART,
    SELECT_ITEM_IN_CART,
    EDIT_ITEM_IN_CART,
    CLEAR_CART,
} from "@constants/cart";
import IBlockTime from "@interfaces/IBlockTime";
import ICart from "@interfaces/ICart";
import IExtra from "@interfaces/IExtra";
import IService from "@interfaces/IService";
import IStaff from "@interfaces/IStaff";

const selectService = (service: IService | null) => {
    return {
        type: SELECT_SERVICE,
        payload: service,
    };
};

const selectStaff = (staff: IStaff, isAllBooked = false) => {
    return {
        type: SELECT_STAFF,
        payload: {
            staff,
            isAllBooked,
        },
    };
};

const addExtra = (extra: IExtra) => {
    return {
        type: ADD_EXTRA,
        payload: extra,
    };
};

const removeExtra = (extraId: number) => {
    return {
        type: REMOVE_EXTRA,
        payload: extraId,
    };
};

const saveStaffTime = (staffTime: IBlockTime[]) => {
    return {
        type: STAFF_TIME,
        payload: staffTime,
    };
};

const selectDateTime = (date: Date, time: string) => {
    return {
        type: SELECT_DATE_TIME,
        payload: {
            date,
            time,
        },
    };
};

const addItemToCart = (data: ICart) => {
    return {
        type: ADD_ITEM_TO_CART,
        payload: data,
    };
};

const removeItemInCart = (cartId: string) => {
    return {
        type: REMOVE_ITEM_IN_CART,
        payload: cartId,
    };
};

const selectItemInCart = (cart: ICart) => {
    return {
        type: SELECT_ITEM_IN_CART,
        payload: cart,
    };
};

const editItemInCart = (cart: ICart) => {
    return {
        type: EDIT_ITEM_IN_CART,
        payload: cart,
    };
};

const clearCart = () => {
    return {
        type: CLEAR_CART,
        payload: null,
    };
};

export { selectService, selectStaff, addExtra, removeExtra, saveStaffTime, selectDateTime, addItemToCart, removeItemInCart, selectItemInCart, editItemInCart, clearCart };
