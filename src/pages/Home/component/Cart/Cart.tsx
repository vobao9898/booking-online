import addNote from "@assets/images/addNote.png";
import close from "@assets/images/close.svg";
import noItem from "@assets/images/noItem.svg";
import noteReview from "@assets/images/note_review.png";
import Button from "@components/Button";
import useAppDispatch from "@hooks/useAppDispatch";
import useAppSelector from "@hooks/useAppSelector";
import ICart from "@interfaces/ICart";
import AppointmentService from "@services/AppointmentService";
import CartItem from "./components/CartItem";
import { converStrToNumber, convertMinsToHrsMins, formatMoney, getDepositType } from "@utils/index";
import { Input, Modal } from "antd";
import { FC, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ReactComponent as BackIcon } from "@assets/images/back-icon.svg";
import { removeItemInCart, selectItemInCart, clearCart } from "@actions/cart";
import { createAppointmentRequest, createAppointmentSuccess, createAppointmentError, cancelDepositRequest, cancelDepositSuccess, cancelDepositError } from "@actions/appointment";
import "./Cart.css";

interface IProps {
    onCloseDrawer: () => void;
    setIsDrawer: () => void;
}

const Cart: FC<IProps> = ({ onCloseDrawer, setIsDrawer }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const merchantId = searchParams.get("merchant_id");
    const token = searchParams.get("token");

    const merchant = useAppSelector((state) => state.merchant.merchant);
    const cart = useAppSelector((state) => state.cart.cart);
    const customer = useAppSelector((state) => state.customer.customer);
    const loading = useAppSelector((state) => state.appointment.loading);
    const isDeposit = useAppSelector((state) => state.appointment.isDeposit);
    const depositData = useAppSelector((state) => state.appointment.depositData);
    const isEditCart = useAppSelector((state) => state.cart.isEdit);
    const appointmentId = useAppSelector((state) => state.appointment.appointmentId);

    const dispatch = useAppDispatch();

    const [heightTab, setHeightTab] = useState("25px");
    const [heightDeposit, setHeightDeposit] = useState("138px");
    const [data, setData] = useState<ICart[]>([]);
    const [isNote, setIsNote] = useState(false);
    const [textNote, setTextNote] = useState("");
    const [textNotes, setTextNotes] = useState("");

    const isTablet = useMediaQuery({
        query: "(max-width: 1200px)",
    });

    useEffect(() => {
        const element: any = document.getElementById("headerTab");
        if (element) {
            setHeightTab(`${element.offsetHeight}px`);
        }
    }, [textNote, textNotes]);

    useEffect(() => {
        const element: any = document.getElementById("deposit");
        if (element) {
            setHeightDeposit(`${element.offsetHeight}px`);
        }
    }, [depositData]);

    useEffect(() => {
        setData(cart);
    }, [cart]);

    const onOpenModalNote = () => {
        setIsNote(true);
        setTextNote(textNotes);
    };

    const onCloseModalNote = () => {
        setIsNote(false);
        setTextNote("");
    };

    const handleRemove = (cartId: string) => {
        dispatch(removeItemInCart(cartId));
        if (cart.length === 1) {
            setTextNote("");
            setTextNotes("");
        }
    };

    const handleEdit = (cart: ICart) => {
        dispatch(selectItemInCart(cart));
        setIsDrawer();
    };

    const getTotalDuration = (cart: ICart[]) => {
        let total = 0;
        cart.map((ca) => {
            total += ca.service?.duration || 0;
            ca.extras?.map((ex) => {
                total += ex.duration;
            });
        });
        return total;
    };

    const getTotalPrice = (cart: ICart[]) => {
        let total = 0;
        cart.map((ca) => {
            total += ca.service?.price ? converStrToNumber(ca.service?.price) : 0;
            ca.extras?.map((ex) => {
                total += converStrToNumber(ex.price);
            });
        });
        return total;
    };

    const handleSubmit = async () => {
        if (customer && merchantId) {
            if (isDeposit) {
                (window as any).CollectJS.startPaymentRequest();
            } else {
                try {
                    dispatch(createAppointmentRequest());
                    const depositData = await AppointmentService.checkDeposit(cart, customer, parseInt(merchantId));
                    const appointmentId = await AppointmentService.create(parseInt(merchantId), cart, customer, textNotes);
                    setTextNote("");
                    setTextNotes("");
                    if (converStrToNumber(depositData.depositAmount) === 0) {
                        await AppointmentService.sendNotify(appointmentId || 0);
                        navigate(`/success/?merchant_id=${merchantId}&token=${token}`);
                        dispatch(createAppointmentSuccess(false));
                        dispatch(clearCart());
                    } else {
                        dispatch(createAppointmentSuccess(true, depositData, appointmentId));
                    }
                } catch (error) {
                    dispatch(createAppointmentError());
                }
            }
        }
    };

    const handleCancelDeposit = async () => {
        if (appointmentId) {
            try {
                dispatch(cancelDepositRequest());
                await AppointmentService.cancelPayDeposit(appointmentId);
                dispatch(cancelDepositSuccess());
            } catch (error) {
                dispatch(cancelDepositError());
            }
        }
    };

    const renderFooter = () => {
        return (
            <div className="py-3 px-4 md:px-6 flex flex-col justify-between border-t border-t-border-extra ">
                <div className="flex justify-between">
                    <p className="text-3.5 text-black-four font-normal">Total duration:</p>
                    <p className="text-3.5 text-black-four font-normal">{convertMinsToHrsMins(getTotalDuration(data))}</p>
                </div>
                <div className="flex justify-between">
                    <p className="text-4 text-black-five font-semibold">Total:</p>
                    <p className="text-4 text-black-five font-semibold">{formatMoney(getTotalPrice(data).toString())}</p>
                </div>
            </div>
        );
    };

    const renderFooterDeposit = () => {
        return (
            <div className="py-3 px-4 md:px-6 flex flex-col justify-between border-t border-t-border-extra ">
                <div className="flex justify-between">
                    <p className="text-3.5 text-black-four font-normal">Total duration:</p>
                    <p className="text-3.5 text-black-four font-normal">{convertMinsToHrsMins(getTotalDuration(data))}</p>
                </div>
                <div className="flex justify-between">
                    <p className="text-4 text-black-four font-normal">Subtotal:</p>
                    <p className="text-4 text-black-four font-normal">{formatMoney(depositData?.subTotal || "")}</p>
                </div>
                <div className="flex justify-between">
                    <p className="text-4 text-black-four font-normal">Discount:</p>
                    <p className="text-4 text-black-four font-normal">{formatMoney(depositData?.discount || "")}</p>
                </div>
                <div className="flex justify-between">
                    <p className="text-4 text-black-four font-normal">Tax:</p>
                    <p className="text-4 text-black-four font-normal">{formatMoney(depositData?.tax || "")}</p>
                </div>
                <div className="flex justify-between">
                    <p className="text-4 text-black-five font-semibold">Total:</p>
                    <p className="text-4 text-black-five font-semibold">{formatMoney(depositData?.total || "")}</p>
                </div>
                <div className="flex justify-between">
                    <p className="text-4 text-black-five font-semibold">Deposit amount: {getDepositType(merchant?.depositPercent, merchant?.depositFixedAmount)}</p>
                    <p className="text-4 text-black-five font-semibold">{formatMoney(depositData?.depositAmount || "")}</p>
                </div>
            </div>
        );
    };

    return (
        <>
            <Modal
                open={isNote}
                title={
                    <div className="flex">
                        <div className="title-modal">Add note</div>
                    </div>
                }
                onCancel={onCloseModalNote}
                footer={
                    <div className="flex justify-center">
                        <button
                            className="button-modal md:w-[340px] w-full"
                            id="add-staff"
                            onClick={() => {
                                setTextNotes(textNote);
                                setIsNote(false);
                            }}
                        >
                            Done
                        </button>
                    </div>
                }
            >
                <div>
                    <Input.TextArea
                        autoSize={{ minRows: 4, maxRows: 4 }}
                        placeholder="Notes"
                        onChange={(e) => {
                            setTextNote(e.target.value);
                        }}
                        value={textNote}
                    />
                </div>
            </Modal>
            <div className="w-full h-[100svh] overflow-hidden cart-container">
                <div className="md:pt-6 pt-6 pb-3.5 px-4 md:px-6 border-b-[1px] border-b-white-secondary">
                    <div className="">
                        <div className="flex justify-between items-center">
                            <div className="flex flex-col">
                                <div className="text-black-primary text-5 font-semibold leading-6">My Basket</div>
                                <div className="text-black-three text-3.75 font-normal leading-4.5 mt-1.5">{cart.length} item in basket</div>
                            </div>
                            {isDeposit && (
                                <button onClick={handleCancelDeposit} className="flex flex-row items-center space-x-1 pt-1.75 pb-2 px-3.75 border border-primary rounded-md">
                                    <BackIcon />
                                    <span className="text-3.5 font-semibold text-primary">Back</span>
                                </button>
                            )}
                            {isTablet && !isDeposit && <img alt="close-icon" src={close} onClick={onCloseDrawer} className="cursor-pointer h-3 w-3"></img>}
                        </div>
                    </div>
                </div>
                {data.length > 0 ? (
                    <div>
                        <div className={`overflow-scroll bg-white overflow-x-hidden scrollbar-white`} style={{ height: `calc(100svh - 87px - ${heightTab} - ${heightDeposit})` }}>
                            {data.map((item) => {
                                return <CartItem key={item.cartId} item={item} onEdit={handleEdit} onRemove={handleRemove} handleCloseDrawer={onCloseDrawer} />;
                            })}
                        </div>
                        <div id="headerTab">
                            <div className="h-6.25 w-full flex justify-between mb-1.25 cursor-pointer pt-1.25 px-4 md:px-6" onClick={onOpenModalNote}>
                                <div className="flex items-center">
                                    <img src={addNote} alt="" className="h-5 w-5" />
                                    <div className="text-3.25 text-black font-semibold ml-1.25">Notes</div>
                                </div>
                                <div className="text-3.25 text-black font-semibold ml-1.25">
                                    <img src={noteReview} alt="" className="h-5 w-5" />
                                </div>
                            </div>
                            {textNotes.trim() && <div className="max-h-11.25 min-h-5.75 text-3.25 overflow-auto overflow-x-hidden mb-1.25 px-4 md:px-6 scrollbar-white">{textNotes}</div>}
                        </div>
                        <div className="pb-5" id="deposit">
                            {isDeposit ? renderFooterDeposit() : renderFooter()}
                            <div className="flex justify-center px-4 md:px-6">
                                <Button
                                    disabled={isEditCart}
                                    className="font-semibold h-12 w-full bg-blue-secondary rounded-md text-4 text-white text-center cursor-pointer"
                                    onClick={handleSubmit}
                                    variant="contained"
                                    loading={loading}
                                >
                                    {isDeposit ? "Pay" : "Confirm"}
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-[calc(100%-83px)] flex justify-center items-center">
                        <img alt="no-item-icon" src={noItem} />
                    </div>
                )}
            </div>
        </>
    );
};

export default Cart;
