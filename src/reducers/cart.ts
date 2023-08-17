import IService from "@interfaces/IService";
import ICart from "@interfaces/ICart";
import { SELECT_SERVICE, SELECT_STAFF, ADD_EXTRA, REMOVE_EXTRA, SELECT_DATE_TIME, ADD_ITEM_TO_CART, REMOVE_ITEM_IN_CART, SELECT_ITEM_IN_CART, EDIT_ITEM_IN_CART, CLEAR_CART } from "@constants/cart";
import { Action } from "redux";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import IStaff from "@interfaces/IStaff";
import WaitingListStaffIcon from "@assets/images/staff1.svg";
import AnyStaffIcon from "@assets/images/staff2.svg";
interface PayloadAction extends Action {
    payload: any;
}

interface IState {
    cart: ICart[];
    cartItem: ICart | null;
    service: IService | null;
    isEdit: boolean;
    startTime: Date | null;
    isAllBooked: boolean;
}

const initialState: IState = {
    cart: [],
    cartItem: null,
    service: null,
    isEdit: false,
    startTime: null,
    isAllBooked: false,
};

const getTotalDuration = (cart: ICart) => {
    let total = cart.service?.duration || 0;
    cart.extras?.map((ex) => {
        total += ex.duration;
    });
    return total;
};

const getLastDateTime = (cart: ICart[]) => {
    let date = new Date();
    let time = "";
    if (cart && cart.length) {
        const item = cart[cart.length - 1];
        const durations = getTotalDuration(item);
        (date = moment(`${moment(item.date).format("MMMM DD,yyyy")} ${moment(item.time, "HH:mm").format("hh:mm A")}`)
            .add(durations, "minutes")
            .toDate()),
            (time = moment(item.time, "HH:mm").add(durations, "minutes").format("HH:mm"));
    }
    return {
        date,
        time,
    };
};

const updateDateTime = (carts: ICart[], startTime: Date | null) => {
    const newCarts = [...carts];
    newCarts.forEach((item, index) => {
        if (index !== 0) {
            const { date, time } = getLastDateTime([carts[index - 1]]);
            item.date = date;
            item.time = time;
        } else if (startTime) {
            (item.date = moment(startTime).toDate()), (item.time = moment(startTime).format("HH:mm"));
        }
    });
    return newCarts;
};

const getStaff = (carts: ICart[]): IStaff | undefined => {
    if (carts && carts.length) {
        if (carts[0].staff?.staffId === -1) {
            return {
                staffId: -1,
                displayName: "Waiting list",
                imageUrl: WaitingListStaffIcon,
                tip: "",
            };
        } else if (carts[0].staff?.staffId === 0) {
            return {
                staffId: 0,
                displayName: "Any staff",
                imageUrl: AnyStaffIcon,
                tip: "",
            };
        }
    }
    return undefined;
};

const cart = (state = initialState, action: PayloadAction) => {
    switch (action.type) {
        case SELECT_SERVICE: {
            const { date, time } = getLastDateTime(state.cart);
            const newState: IState = {
                ...state,
                service: action?.payload,
                isEdit: false,
                cartItem: {
                    cartId: uuidv4(),
                    extras: [],
                    service: action?.payload,
                    time: time,
                    date: date,
                    staff: getStaff(state.cart),
                },
            };
            return newState;
        }
        case SELECT_STAFF: {
            const { staff, isAllBooked } = action.payload;

            const cart = state.cart;

            const newCartItem: ICart = {
                ...state.cartItem,
                cartId: state.cartItem?.cartId ? state.cartItem?.cartId : uuidv4(),
                staff: staff,
            };

            if (((cart && cart.length === 1) || cart.length === 0) && staff?.staffId === -1) {
                newCartItem.time = moment().format("hh:mm A");
            }

            if (cart && cart.length && (cart[0].staff?.staffId === 0 || cart[0].staff?.staffId === -1)) {
                if (staff?.staffId !== -1) {
                    newCartItem.time = "";
                } else {
                    newCartItem.time = moment().format("hh:mm A");
                }
            }

            const newState: IState = {
                ...state,
                cartItem: newCartItem,
                isAllBooked: isAllBooked,
            };
            return newState;
        }
        case ADD_EXTRA: {
            const extra = action.payload;
            if (state && state.cartItem) {
                const newCartItem: ICart = { ...state.cartItem };
                newCartItem.extras?.push(extra);
                const newState: IState = {
                    ...state,
                    cartItem: newCartItem,
                };
                return newState;
            }
            return {
                ...state,
            };
        }

        case REMOVE_EXTRA: {
            const extraId = action.payload;
            if (state && state.cartItem && state.cartItem.extras) {
                const newCartItem: ICart = { ...state.cartItem };
                const index = newCartItem.extras?.findIndex((x) => x.extraId === extraId);
                if (index !== -1 && index !== undefined) {
                    newCartItem.extras?.splice(index, 1);
                }
                const newState: IState = {
                    ...state,
                    cartItem: newCartItem,
                };
                return newState;
            }
            return {
                ...state,
            };
        }

        case SELECT_DATE_TIME: {
            const data = action.payload;
            if (state && state.cartItem) {
                const newCartItem: ICart = { ...state.cartItem, time: data.time, date: data.date };
                const newState: IState = {
                    ...state,
                    cartItem: newCartItem,
                };
                return newState;
            }
            return {
                ...state,
            };
        }

        case ADD_ITEM_TO_CART: {
            const data: ICart = action.payload;

            if (state && state.cartItem) {
                const newCart: ICart[] = structuredClone(state.cart);
                let startTime = structuredClone(state.startTime);

                if (newCart && newCart.length === 0) {
                    if (data.time === "") {
                        data.time = moment().format("hh:mm A");
                    }
                    startTime = moment(`${moment(data.date).format("MMMM DD,yyyy")} ${moment(data.time, "HH:mm").format("hh:mm A")}`).toDate();
                }

                if (newCart.length > 0 && newCart[0].staff?.staffId === 0) {
                    data.staff = newCart[0].staff;
                }

                newCart.push(data);

                const newState: IState = {
                    ...state,
                    cartItem: null,
                    service: null,
                    cart: updateDateTime(newCart, startTime),
                    startTime: startTime,
                };
                return newState;
            }
            return {
                ...state,
            };
        }

        case REMOVE_ITEM_IN_CART: {
            const cartId = action.payload;
            if (state && state.cart) {
                const newCart: ICart[] = [...state.cart];
                let startTime = state.startTime;
                let isAllBooked = state.isAllBooked;

                const index = newCart.findIndex((x) => x.cartId === cartId);

                if (index !== -1) {
                    newCart.splice(index, 1);
                }

                if (newCart.length === 0) {
                    startTime = null;
                    isAllBooked = false;
                }

                const newState: IState = {
                    ...state,
                    cart: updateDateTime(newCart, startTime),
                    cartItem: null,
                    service: null,
                    startTime: startTime,
                    isAllBooked: isAllBooked,
                };
                return newState;
            }
            return {
                ...state,
            };
        }

        case SELECT_ITEM_IN_CART: {
            const newCartItem: ICart = structuredClone(action.payload);
            const newService = newCartItem.service;
            const cart = state.cart;
            if (cart && cart.length && cart[0].staff?.staffId !== -1) {
                newCartItem.time = cart[0].time;
            }

            const newState: IState = {
                ...state,
                service: newService || null,
                cartItem: newCartItem,
                isEdit: true,
            };

            return newState;
        }

        case EDIT_ITEM_IN_CART: {
            const cartItem: ICart = action.payload;
            const newCart = [...state.cart];
            let startTime = state.startTime;
            const index = newCart.findIndex((x) => x.cartId === cartItem.cartId);
            if (index !== -1) {
                if (newCart && (newCart[0].staff?.staffId !== -1 || cartItem.staff?.staffId !== -1)) {
                    startTime = moment(`${moment(cartItem.date).format("MMMM DD,yyyy")} ${moment(cartItem.time, "HH:mm").format("hh:mm A")}`).toDate();
                }
                newCart[index] = cartItem;
            }

            const newState: IState = {
                ...state,
                service: null,
                cartItem: null,
                isEdit: false,
                startTime: startTime,
                cart: updateDateTime(newCart, startTime),
            };

            return newState;
        }

        case CLEAR_CART: {
            return {
                ...initialState,
            };
        }

        default:
            return state;
    }
};
export default cart;
