import LocationIcon from "@assets/images/location.svg";
import IAppointment from "@interfaces/IAppointment";
import IMerchant from "@interfaces/IMerchant";
import { capitalizeFirstLetter, convertMinsToHrsMins, formatMoney, handleCheckStatus, statusShow } from "@utils/index";
import { Modal } from "antd";
import { FC } from "react";
import { useMediaQuery } from "react-responsive";
import ExtraItem from "./components/ExtraItem";
import GiftCardItem from "./components/GiftCardItem";
import ProductItem from "./components/ProductItem";
import ServiceItem from "./components/ServiceItem";
import moment from "moment";
import "./AppointmentModal.css";

interface IProps {
    appointment: IAppointment;
    isModal: boolean;
    merchant: IMerchant;
    onClose: () => void;
}

const AppointmentModal: FC<IProps> = ({ appointment, isModal, merchant, onClose }) => {
    const isMobile = useMediaQuery({
        query: "(max-width: 767px)",
    });

    const renderModal = () => {
        return (
            <div>
                <div className="text-4 font-semibold leading-normal text-gray-dark">Services & Products</div>
                <div className="py-0 pr-1.5 h-[180px] lg:h-[300px] overflow-auto overflow-x-hidden scrollbar-white">
                    {appointment?.services?.map((service) => {
                        return (
                            <div key={service.serviceId} className="pt-2.5 mt-2.5 mb-3">
                                <ServiceItem service={service} isMobile={isMobile} />
                                {appointment?.extras?.length > 0 &&
                                    appointment?.extras?.map((extra) => {
                                        return <>{extra.bookingServiceId === service.bookingServiceId && <ExtraItem key={extra.extraId} extra={extra} />}</>;
                                    })}
                            </div>
                        );
                    })}
                    {appointment?.products?.map((item) => {
                        return <ProductItem key={item.productId} product={item} isMobile={isMobile} />;
                    })}
                    {appointment?.giftCards?.map((item, index) => {
                        return <GiftCardItem key={index} item={item} isMobile={isMobile} />;
                    })}
                </div>
                <div className="py-0 border-t border-t-white-secondary md:pb-[51px] pb-5">
                    <div className="flex justify-between md:mt-3.5 mt-2">
                        <div className="font-normal text-3.25 tex-black-secondary">Subtotal:</div>
                        <div className="font-bold text-right text-3.25 tex-black-secondary">{formatMoney(appointment.subTotal)}</div>
                    </div>
                    <div className="flex justify-between md:mt-3.25 mt-2">
                        <div className="font-normal text-3.25 tex-black-secondary">Discount:</div>
                        <div className="font-bold text-right text-3.25 tex-black-secondary">{formatMoney(appointment.discount)}</div>
                    </div>
                    <div className="flex justify-between md:mt-3.25 mt-2">
                        <div className="font-normal text-3.25 tex-black-secondary">Tax:</div>
                        <div className="font-bold text-right text-3.25 tex-black-secondary">{formatMoney(appointment.tax)}</div>
                    </div>
                    <div className="flex justify-between md:mt-3.25 mt-2">
                        <div className="font-normal text-5 tex-black-primary">Total:</div>
                        <div className="font-bold text-5 tex-black-primary">{formatMoney(appointment.total)}</div>
                    </div>
                </div>
            </div>
        );
    };

    const handleClose = () => {
        onClose();
    };

    const checkTypeMerchant = (type: string, isWareHouse: boolean) => {
        if (type === "SalonPos") {
            return "S";
        } else {
            if (isWareHouse === true) {
                return "W";
            } else {
                return "R";
            }
        }
    };

    return (
        <Modal
            className="history-modal modal-css"
            open={isModal}
            title={
                <div className="flex flex-wrap m-1 rounded-zero md:pt-6.25 py-3.5 border-b border-b-white-secondary">
                    <div className="w-[calc(100%-16px)]">
                        <div className="flex flex-col-reverse flex-wrap md:flex-row md:flex-nowrap">
                            <div className="font-semibold text-5 leading-6 text-black-dark md:mt-0 mt-3.5">{moment(appointment?.fromTime).format("dddd, MMM DD YYYY, hh:mm A")}</div>
                            <div className={`${statusShow(appointment?.status)} status-title`}>
                                <div className="mr-1 flex justify-center">
                                    <img alt="status-icon" src={handleCheckStatus(appointment?.status)} />
                                </div>
                                <div className="font-semibold text-3.5 text-white">{capitalizeFirstLetter(appointment?.status)}</div>
                            </div>
                        </div>
                        <div className="font-normal text-3.5 leading-4.5 text-black-secondary">
                            {`Duration: ${convertMinsToHrsMins(appointment?.duration)}, end at ${moment(appointment?.toTime).format("hh:mm A")}`}
                        </div>
                        <div className="pt-3.5 flex">
                            <div className="w-14 h-14 rounded-[7px] mr-3">
                                <div className="h-full w-14 rounded-[7px] flex justify-center items-center bg-gray-secondary text-6.25 font-bold text-white">
                                    {checkTypeMerchant(merchant.type, merchant.isWareHouse)}
                                </div>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <div className="md:font-semibold md:text-3.5 text-black-primary w-full text-ellipsis whitespace-nowrap overflow-hidden">{merchant.businessName}</div>
                                <div className="mt-0.75 flex w-full items-start">
                                    <img alt="location-icon" src={LocationIcon} />
                                    <div className="font-normal text-3.5 text-black-secondary ml-1.25 max-w-[240px] md:max-w-max">{merchant.addressFull}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            onOk={handleClose}
            onCancel={handleClose}
            footer={<div></div>}
        >
            {renderModal()}
        </Modal>
    );
};

export default AppointmentModal;
