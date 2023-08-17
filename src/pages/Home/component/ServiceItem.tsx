import React from "react";
import ServiceIcon from "@assets/images/service.png";
import useAppDispatch from "@hooks/useAppDispatch";
import useAppSelector from "@hooks/useAppSelector";
import { selectService } from "@actions/cart";
import { formatMoney, convertMinsToHrsMins } from "@utils/index";
import IService from "@interfaces/IService";
import classNames from "classnames";

interface IProps {
    service: IService;
}

const ServiceItem: React.FC<IProps> = ({ service }) => {
    const dispatch = useAppDispatch();
    const selectedService = useAppSelector((state) => state.cart.service);
    const cart = useAppSelector((state) => state.cart.cart);

    const checkService = (service: IService) => {
        const data = cart.filter((item) => item.service?.serviceId === service.serviceId);
        if ((selectedService && selectedService.serviceId === service.serviceId) || data.length > 0) {
            return true;
        }
        return false;
    };

    const handleClick = (item: IService) => {
        if (!checkService(item)) {
            dispatch(selectService(item));
        }
    };

    return (
        <div
            id={`service-${service.serviceId}`}
            onClick={() => handleClick(service)}
            className={"cursor-pointer rounded-[10px] flex items-center bg-white gap-x-4.75 pr-3.5 lg:flex-col lg:pr-0 service-item"}
        >
            <div className="w-35 h-32.5 flex-shrink-0 lg:w-full lg:h-36">
                <img className="rounded-l-[10px] w-full h-full lg:rounded-l-none lg:rounded-t-[10px]" src={service.imageUrl ? service.imageUrl : ServiceIcon} />
            </div>
            <div className="h-full w-full lg:px-3.5 pt-4.5 relative pb-4.5 lg:pb-16.25">
                <p
                    className={classNames("text-4 leading-5.25 font-semibold text-black-secondary line-clamp-3 lg:line-clamp-5", {
                        "text-primary": checkService(service),
                    })}
                >
                    {service.name}
                </p>
                <div className="pt-3 flex justify-between items-center lg:pt-6.5 static lg:absolute bottom-5.5 left-3.5 right-3.5">
                    <p className="text-sm leading-4.25 font-normal text-gray-secondary">{convertMinsToHrsMins(service.duration)}</p>
                    <p className="text-sm leading-4.25 font-bold text-gray-secondary">{formatMoney(service.price)}</p>
                </div>
            </div>
        </div>
    );
};

export default ServiceItem;
