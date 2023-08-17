import { addItemToCart, editItemInCart, selectService } from "@actions/cart";
import { openModal } from "@actions/staff";
import { openModal as openTimeModal } from "@actions/time";
import { ReactComponent as ArrowRightIcon } from "@assets/images/arrow-right.svg";
import { ReactComponent as CloseIcon } from "@assets/images/white-close-icon.svg";
import Button from "@components/Button/Button";
import useAppDispatch from "@hooks/useAppDispatch";
import useAppSelector from "@hooks/useAppSelector";
import ICart from "@interfaces/ICart";
import { checkCanEditStaff, checkCanEditTime, converStrToNumber, convertMinsToHrsMins, formatMoney, showDateTime, showToastError, showToastWarning } from "@utils/index";
import { Avatar } from "antd";
import classNames from "classnames";
import Divider from "./Divider";
import ExtraItem from "./ExtraItem";

const QuickCart = () => {
    const dispatch = useAppDispatch();
    const service = useAppSelector((state) => state.cart.service);
    const cartItem = useAppSelector((state) => state.cart.cartItem);
    const cart = useAppSelector((state) => state.cart.cart);
    const isEditCart = useAppSelector((state) => state.cart.isEdit);
    const isAllBooked = useAppSelector((state) => state.cart.isAllBooked);
    const isDeposit = useAppSelector((state) => state.appointment.isDeposit);

    const handleClose = () => {
        dispatch(selectService(null));
    };

    const getTotalDuration = () => {
        if (!cartItem || !cartItem.service) return 0;

        let total = cartItem.service.duration;

        if (cartItem.extras && cartItem.extras.length) {
            cartItem.extras.map((ex) => {
                total += ex.duration;
            });
        }

        return total;
    };

    const getTotalPrice = () => {
        if (!cartItem || !cartItem.service) return 0;

        let total = converStrToNumber(cartItem.service.price);

        if (cartItem.extras && cartItem.extras.length) {
            cartItem.extras.map((ex) => {
                total += converStrToNumber(ex.price);
            });
        }

        return total;
    };

    const handleOpenStaffModal = () => {
        dispatch(openModal());
    };

    const handleOpenTimeModal = () => {
        if (cartItem && cartItem.staff) {
            if (isEditCart) {
                dispatch(openTimeModal());
            } else if (!(cart && cart.length)) {
                dispatch(openTimeModal());
            }
        } else {
            showToastError("Please choose your staff");
        }
    };

    const validateCart = (cart: ICart | null) => {
        if (cart?.staff) {
            if ((cart?.date && cart.time) || cart?.staff?.staffId === -1) {
                return true;
            } else {
                showToastError("Please choose your date time");
            }
        } else {
            showToastError("Please choose your staff");
        }
        return false;
    };

    const handleSaveCart = () => {
        if (isDeposit) {
            showToastWarning("Please pay deposit!");
        } else {
            const isValidCart = validateCart(cartItem);
            if (isValidCart && cartItem) {
                if (isEditCart) {
                    dispatch(editItemInCart(cartItem));
                } else {
                    dispatch(addItemToCart(cartItem));
                }
            }
        }
    };

    return (
        <div className="relative rounded-[19px] shadow-quick-cart bg-white pl-8 py-5 pr-5">
            <div onClick={handleClose} className="absolute right-4 top-4 bg-black-primary w-6 h-6 rounded-full flex justify-center items-center opacity-30 cursor-pointer">
                <CloseIcon width={10} height={10} />
            </div>
            <div className="grid grid-cols-3 gap-x-16">
                <div className="flex flex-col">
                    <p className="text-4 leading-4.75 font-semibold text-primary">Extra Services</p>
                    <div className="pt-3 w-full">
                        {service && service.extras && service.extras.length ? (
                            service.extras.map((ex) => {
                                return ex.isDisabled === 0 ? <ExtraItem key={ex.extraId} extra={ex} /> : null;
                            })
                        ) : (
                            <>
                                <Divider />
                                <p className="pt-4 leading-10 pb-4 font-normal text-gray-secondary">No extra services</p>
                            </>
                        )}
                    </div>
                </div>
                <div>
                    <p className="text-4 leading-4.75 font-semibold text-primary">Select Staff</p>
                    <div className="pt-3 w-full">
                        <Divider />
                        <div onClick={handleOpenStaffModal} className="cursor-pointer pt-4 flex justify-between items-center">
                            {checkCanEditStaff(cart, isEditCart) ? (
                                <>
                                    {cartItem?.staff ? (
                                        <div className="flex items-center gap-x-2.25">
                                            <Avatar size={40} src={cartItem.staff.imageUrl} />
                                            <p className="text-3.75 leading-4.5 font-semibold text-black-dark">{cartItem.staff.displayName}</p>
                                        </div>
                                    ) : (
                                        <p className="leading-10 text-gray-five font-semibold">Select staff</p>
                                    )}
                                    <div>
                                        <ArrowRightIcon />
                                    </div>
                                </>
                            ) : null}
                        </div>
                    </div>
                </div>
                <div>
                    <p className="text-4 leading-4.75 font-semibold text-primary">Select Date/Time</p>
                    <div className="pt-3 w-full">
                        <Divider />
                        {checkCanEditTime(cart, isEditCart, cartItem) ? (
                            <>
                                <div onClick={handleOpenTimeModal} className="cursor-pointer pt-6.5 flex justify-between items-center">
                                    <p
                                        className={classNames({
                                            "text-3.75 leading-4.5 font-semibold text-black-dark": cartItem && cartItem?.time?.trim(),
                                            "text-gray-five font-semibold": !cartItem?.time?.trim(),
                                        })}
                                    >
                                        {cartItem ? showDateTime(cartItem) : "Select Date/Time"}
                                    </p>
                                    <div>
                                        <ArrowRightIcon />
                                    </div>
                                </div>
                            </>
                        ) : null}
                    </div>
                </div>
            </div>
            <Divider />
            <div className="pt-4 grid grid-cols-3 gap-x-16 items-center">
                <div>
                    <p className="text-4 leading-4.5 font-semibold text-black-dark">Total duration: {convertMinsToHrsMins(getTotalDuration())}</p>
                </div>
                <div>
                    <p className="text-4 leading-4.5 font-semibold text-black-dark">Total: {formatMoney(getTotalPrice().toString())}</p>
                </div>
                <div>
                    {!isAllBooked ? (
                        <Button variant="contained" onClick={handleSaveCart}>
                            <span className="text-4 leading-4.75 font-bold text-white">{isEditCart ? "Save" : "Add to Basket"}</span>
                        </Button>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default QuickCart;
