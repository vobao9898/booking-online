import React from "react";
import IService from "@interfaces/IService";
import ServiceDefaultIcon from "@assets/images/service.png";
import IStaff from "@interfaces/IStaff";
import { convertMinsToHrsMins, formatMoney } from "@utils/index";

interface IProps {
    service: IService;
    isMobile: boolean;
}

const ServiceItem: React.FC<IProps> = ({ service, isMobile }) => {
    const getStaffName = (staff: IStaff, staffId: number) => {
        let displayName = staff.displayName;
        if (staffId === -1) displayName = "Waiting list";
        if (staffId === 0) displayName = "Any Staff";
        return displayName;
    };

    return (
        <div className="w-full flex">
            <div className="flex w-full overflow-hidden items-center gap-x-3">
                <div className="h-14 w-14 rounded-[7px]">
                    <img alt={service.serviceName} src={service.imageUrl ? service.imageUrl : ServiceDefaultIcon} className="h-14 w-14 rounded-[7px]" />
                </div>
                <div className="flex-1 overflow-hidden flex flex-col gap-y-0.75">
                    <div className="flex justify-between gap-x-4">
                        <div className="font-semibold text-3.5 text-black-primary whitespace-nowrap overflow-hidden text-ellipsis">{service.serviceName}</div>
                        <div
                            className="font-bold text-3.5 text-right text-black-secondary flex items-center flex-shrink-0"
                            style={{
                                display: isMobile ? "unset" : "none",
                            }}
                        >
                            {formatMoney(service.price)}
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div className="flex justify-between md:justify-start w-full md:w-auto">
                            <div className="font-normal text-3.5 leading-4.5 text-black-secondary mr-0 md:mr-22 min-w-25">{convertMinsToHrsMins(service.duration)}</div>
                            <div className="font-normal text-3.5 leading-4.5 text-black-secondary">{`with ${getStaffName(service.staff, service.staffId)}`}</div>
                        </div>
                        <div className="font-bold text-3.5 leading-4.5 text-right text-black-secondary flex items-center" style={{ display: isMobile ? "none" : "unset" }}>
                            {formatMoney(service.price)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceItem;
