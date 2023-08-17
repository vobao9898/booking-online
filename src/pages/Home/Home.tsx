import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { saveCategories } from "@actions/category";
import { saveServices } from "@actions/service";
import { useMediaQuery } from "react-responsive";
import { paymentDepositRequest, paymentDepositSuccess, paymentDepositError } from "@actions/appointment";
import { clearCart } from "@actions/cart";
import { showToastError } from "@utils/index";
import BookedIcon from "@assets/images/booked-icon.svg";
import useAppDispatch from "@hooks/useAppDispatch";
import useAppSelector from "@hooks/useAppSelector";
import NavMenu from "./component/NavMenu";
import CategorySection from "./component/CategorySection";
import CategoryService from "@services/CategoryService";
import AppointmentService from "@services/AppointmentService";
import Service from "@services/Service";
import ICategory from "@interfaces/ICategory";
import IService from "@interfaces/IService";
import Cart from "./component/Cart/Cart";
import Drawer from "./component/Drawer";
import StaffModal from "@components/StaffModal/StaffModal";
import TimePicker from "@components/TimePicker/TimePicker";
import CartIcon from "@assets/images/cart.svg";
import ExtraMobile from "./component/ExtraMobile";
import Backdrop from "@components/Backdrop/Backdrop";

const Home = () => {
    const dispatch = useAppDispatch();

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const merchantId = searchParams.get("merchant_id");
    const token = searchParams.get("token");

    const categories = useAppSelector((state) => state.category.categories);
    const merchant = useAppSelector((state) => state.merchant.merchant);
    const appointmentId = useAppSelector((state) => state.appointment.appointmentId);
    const depositData = useAppSelector((state) => state.appointment.depositData);
    const loadingAppointment = useAppSelector((state) => state.appointment.loading);
    const cart = useAppSelector((state) => state.cart.cart);
    const openTimePicker = useAppSelector((state) => state.time.openModal);

    const [isDrawer, setIsDrawer] = useState(false);

    const isTablet = useMediaQuery({
        query: "(max-width: 1200px)",
    });

    useEffect(() => {
        const handlePayment = async (appoinmentId: number, depositAmount: string, body: any) => {
            try {
                dispatch(paymentDepositRequest());

                await AppointmentService.payment(appoinmentId, depositAmount, body);
                await AppointmentService.sendNotify(appointmentId);

                dispatch(paymentDepositSuccess());
                dispatch(clearCart());
                navigate(`/success/?merchant_id=${merchantId}&token=${token}`);
            } catch (error: any) {
                dispatch(paymentDepositError());
                showToastError(error);
                throw error;
            }
        };

        if (window && (window as any).CollectJS) {
            (window as any).CollectJS.configure({
                variant: "lightbox",
                callback: async (respPayment: any) => {
                    if (respPayment && appointmentId && depositData) {
                        await handlePayment(appointmentId, depositData.depositAmount, respPayment);
                    } else {
                        showToastError("Something went error");
                    }
                },
            });
        }
    }, [appointmentId, depositData, dispatch, merchantId, navigate, token]);

    useEffect(() => {
        const fetchService = async (id: string) => {
            try {
                const categories = await CategoryService.getCategories(parseInt(id));
                const services = await Service.getServices();

                const activeCategories: ICategory[] = [];
                let activeServices: IService[] = [];

                categories.forEach((cate) => {
                    if (
                        services.findIndex((ser) => ser.categoryId === cate.categoryId) !== -1 &&
                        cate.isDisabled === 0 &&
                        (cate.categoryType?.toLowerCase() === "service" || cate.categoryType?.toLowerCase() === "product")
                    ) {
                        activeCategories.push(cate);
                    }
                });

                activeServices = services.filter((item) => item.isDisabled === 0);

                dispatch(saveCategories(activeCategories));
                dispatch(saveServices(activeServices));
            } catch (error) {
                console.log(error);
            }
        };
        if (merchantId && token) {
            fetchService(merchantId);
        }
    }, [dispatch, merchantId, token]);

    const onCloseDrawer = () => {
        setIsDrawer(false);
    };

    const onOpenDrawer = () => {
        setIsDrawer(true);
    };

    return (
        <div className="flex flex-row w-full h-[100svh] overflow-hidden">
            <div className="h-full w-full overflow-hidden">
                <div className="h-[121px] lg:h-[148px] pt-3.25 px-5 pb-5 lg:p-5 bg-gradient-to-r from-secondary-primary  to-primary xl:pl-20 2xl:pl-37.5">
                    <div className="flex justify-between relative">
                        <div>
                            <p className="text-5 font-normal text-white">Welcome to</p>
                            <h5 className="text-5.75 lg:text-9 font-bold text-white">{merchant?.businessName}</h5>
                            <span className="text-3.5 font-normal text-white">Book your appointment with a few simple steps!</span>
                        </div>
                        <div className="absolute top-0 right-0">
                            <img src={BookedIcon} alt="booked-icon" className="cursor-pointer" onClick={() => navigate(`/histories/?merchant_id=${merchantId}&token=${token}`)} />
                        </div>
                    </div>
                </div>
                <div className="w-full h-[calc(100%-121px)] lg:h-[calc(100%-148px)] bg-gray-primary">
                    <div className="w-full h-14 bg-white pl-5 xl:pl-20 2xl:pl-37.5">
                        <NavMenu />
                    </div>
                    <div id="containerId" className="pb-[450px] px-5 overflow-y-auto scrollbar h-[calc(100%-56px)] flex flex-col gap-y-10 pt-7.25 xl:pl-20 2xl:pl-37.5">
                        {categories.map((item) => {
                            return <CategorySection key={item.categoryId} category={item} />;
                        })}
                    </div>
                </div>
                {isTablet && (
                    <div>
                        <Drawer isDrawer={isDrawer} onCloseDrawer={onCloseDrawer} setIsDrawer={onOpenDrawer}></Drawer>
                        <div
                            className="fixed bottom-10 right-1 h-15 w-15 rounded-full  bg-gradient-to-r from-secondary-primary  to-primary flex items-center justify-center cursor-pointer"
                            onClick={() => setIsDrawer(true)}
                        >
                            <img alt="cart-icon" src={CartIcon} />
                            {cart && cart.length ? (
                                <div className="absolute top-3.5 right-0.5 h-5.5 w-5.5 rounded-full bg-red-primary border-[3px] border-white flex justify-center items-center font-semibold text-white text-3">
                                    {cart.length}
                                </div>
                            ) : null}
                        </div>
                    </div>
                )}
            </div>
            {!isTablet && (
                <div className="flex w-[375px] flex-shrink-0 border-l border-text-divider">
                    <Cart onCloseDrawer={onCloseDrawer} setIsDrawer={onOpenDrawer} />
                </div>
            )}
            <ExtraMobile />
            <StaffModal />
            {openTimePicker ? <TimePicker /> : null}
            <Backdrop open={loadingAppointment} />
        </div>
    );
};

export default Home;
