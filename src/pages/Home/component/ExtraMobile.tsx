import { addExtra, addItemToCart, editItemInCart, removeExtra, selectService } from "@actions/cart";
import { openModal } from "@actions/staff";
import { openModal as openTimeModal } from "@actions/time";
import { checkCanEditStaff, checkCanEditTime, converStrToNumber, convertMinsToHrsMins, formatMoney, showDateTime, showToastError, showToastWarning } from "@utils/index";
import { Avatar, Checkbox, Drawer } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { FC, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import close from "@assets/images/closeWhite.svg";
import left from "@assets/images/left.svg";
import useAppDispatch from "@hooks/useAppDispatch";
import useAppSelector from "@hooks/useAppSelector";
import ICart from "@interfaces/ICart";
import IExtra from "@interfaces/IExtra";
import classNames from "classnames";
import ServiceIcon from "@assets/images/service.png";
import "./Cart/Cart.css";

const DrawerCart: FC = () => {
    const service = useAppSelector((state) => state.cart.service);
    const cartItem = useAppSelector((state) => state.cart.cartItem);
    const isEditCart = useAppSelector((state) => state.cart.isEdit);
    const cart = useAppSelector((state) => state.cart.cart);
    const isAllBooked = useAppSelector((state) => state.cart.isAllBooked);
    const isDeposit = useAppSelector((state) => state.appointment.isDeposit);

    const dispatch = useAppDispatch();

    const isTablet = useMediaQuery({
        query: "(max-width: 375px)",
    });

    const isMobile = useMediaQuery({
        query: "(max-width: 767px)",
    });

    const checkOpen = () => {
        if (isMobile && service) {
            return true;
        }
        return false;
    };

    const open = checkOpen();

    useEffect(() => {
        const element = document.getElementById("extra_scrolls");
        if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
    }, [open]);

    const handleClose = () => {
        dispatch(selectService(null));
    };

    const handleOpenStaffModal = () => {
        dispatch(openModal());
    };

    const handleOpenTimeModal = () => {
        if (cartItem && cartItem.staff) {
            dispatch(openTimeModal());
        } else {
            showToastError("Please choose your staff");
        }
    };

    const onChange = (e: CheckboxChangeEvent, extra: IExtra) => {
        if (e.target.checked) {
            dispatch(addExtra(extra));
        } else {
            dispatch(removeExtra(extra.extraId));
        }
    };

    const checkChecked = (cartItem: ICart | null, extra: IExtra) => {
        if (cartItem && cartItem.extras && cartItem.extras.length && extra) {
            const index = cartItem.extras.findIndex((x) => x.extraId === extra.extraId);
            return index !== -1 ? true : false;
        }
        return false;
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

    const isShowBasketBtn = () => {
        return !isAllBooked && cartItem && cartItem.service && cartItem.staff ? true : false;
    };

    return (
        <Drawer width={isTablet ? "100%" : "375"} headerStyle={{ display: "none" }} className="drawer-css" zIndex={1001} title={null} placement="right" open={open} extra={<></>}>
            <div>
                <div className="h-[100svh]">
                    <div className="w-full h-[200px] relative">
                        <img className="w-full h-full" src={service?.imageUrl ? service?.imageUrl : ServiceIcon} />
                        <div className="flex items-center absolute top-5 left-5 bg-black-primary w-8.25 h-8.25 opacity-50 rounded-full justify-center cursor-pointer" onClick={handleClose}>
                            <img src={close} />
                        </div>
                    </div>
                    <div className="p-4 pt-0 border-b-[3px] border-b-gray-three">
                        <div className="text-4 font-semibold text-black-secondary mt-4.5 w-full overflow-hidden text-ellipsis h-[50%]">{service?.name}</div>
                        <div className="flex justify-between mt-2.75">
                            <div className="text-3.5 text-gray-secondary font-normal">{convertMinsToHrsMins(service?.duration || 0)}</div>
                            <div className="font-bold text-3.5 text-gray-secondary">{formatMoney(service?.price || "")}</div>
                        </div>
                    </div>
                    <div className="md:pb-2 pb-2 overflow-y-scroll overflow-x-hidden h-[calc(86svh-200px-111px)]">
                        <div className="pt-4 px-4 cursor-pointer" id="extra_scrolls">
                            <p className="text-4 font-bold text-left text-btn-edit pb-5">Extra services</p>
                            {service && service.extras && service.extras.length ? (
                                service.extras.map((item) => {
                                    const isChecked = checkChecked(cartItem, item);
                                    return (
                                        <div key={item.extraId}>
                                            <div className="h-18 flex justify-between items-end border-t-[1px] border-t-gray-three mb-2 cursor-pointer pb-2 flex-wrap">
                                                <div className="flex flex-col items-start">
                                                    <div className="flex items-center">
                                                        <Checkbox checked={isChecked} onChange={(e) => onChange(e, item)} />
                                                        <p className="ml-3 text-black-five text-4 font-bold">{item.name}</p>
                                                    </div>
                                                    <p className="text-gray-secondary font-normal text-3.75 mt-1.25 pl-7.5">{convertMinsToHrsMins(item.duration)}</p>
                                                </div>
                                                <p className="text-gray-four text-4 font-bold">{formatMoney(item.price)}</p>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="font-normal text-gray-secondary pb-4">No extra services</p>
                            )}
                        </div>
                        {
                            <>
                                {checkCanEditStaff(cart, isEditCart) ? (
                                    <div className="pt-4 pb-4 px-4 border-t-[3px] border-t-gray-three">
                                        <p className="text-4 font-bold text-left text-btn-edit">Select Staff</p>
                                        <div className="mb-3 mt-3">
                                            <div className="flex justify-between items-center" onClick={handleOpenStaffModal}>
                                                {cartItem?.staff ? (
                                                    <div className="flex items-center gap-x-2.25">
                                                        <Avatar size={40} src={cartItem.staff.imageUrl} />
                                                        <p className="text-3.75 leading-4.5 font-semibold text-black-dark">{cartItem.staff.displayName}</p>
                                                    </div>
                                                ) : (
                                                    <div className="text-gray-five font-semibold">Select Staff</div>
                                                )}

                                                <img className="" src={left} />
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                                {checkCanEditTime(cart, isEditCart, cartItem) ? (
                                    <div className="pt-4 px-4 pb-4 border-t-[3px] border-t-gray-three">
                                        <p className="text-4 font-bold text-left text-btn-edit">Select Date/Time</p>
                                        <div className="mb-3 mt-3">
                                            <div className="flex justify-between items-center" onClick={handleOpenTimeModal}>
                                                <div className="staff-flex">
                                                    <div className="staff-name">
                                                        <div
                                                            className={classNames({
                                                                "text-3.75 leading-4.5 font-semibold text-black-dark": cartItem && cartItem?.time?.trim(),
                                                                " text-gray-five font-semibold": !cartItem?.time?.trim(),
                                                            })}
                                                        >
                                                            {cartItem?.time ? showDateTime(cartItem) : "Select Date/Time"}
                                                        </div>
                                                    </div>
                                                </div>
                                                <img className="staff-left" src={left} />
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                            </>
                        }
                    </div>
                </div>
                <div className="overlay" id="overlay" />
                <div className="mt-6.25 px-3.75 flex flex-wrap justify-between absolute bottom-0 left-0 right-0 h-23 bg-white items-center border-t-[3px] border-t-gray-three">
                    <div className="">
                        <p className="text-black-six font-semibold text-4">{convertMinsToHrsMins(getTotalDuration())}</p>
                        <div className="flex">
                            <p className="flex text-4.5 font-semibold text-black-secondary">
                                Total: <span className="ml-1 text-4.5 font-bold text-black-primary">{formatMoney(getTotalPrice().toString())}</span>
                            </p>
                        </div>
                    </div>
                    {isShowBasketBtn() && (
                        <button
                            className="w-41 h-12 text-3.25 font-semibold cursor-pointer rounded-[3px] bg-btn-edit text-white"
                            onClick={() => {
                                handleSaveCart();
                            }}
                        >
                            {isEditCart ? "Edit to Basket" : "Add to Basket"}
                        </button>
                    )}
                </div>
            </div>
        </Drawer>
    );
};

export default DrawerCart;
