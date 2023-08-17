import ServiceDefaultIcon from "@assets/images/service.png";
import IGiftCard from "@interfaces/IGiftCard";
import { formatMoney } from "@utils/index";
import React from "react";

interface IProps {
    item: IGiftCard;
    isMobile: boolean;
}

const GiftCardItem: React.FC<IProps> = ({ item, isMobile }) => {
    const handleAmount = (a: string, b: number) => {
        const result = Number(a.replace(/[^0-9.]+/g, ""));
        return formatMoney((result * b).toString()).replace("$", "$ ");
    };

    return (
        <div className="pt-2.5 mt-2.5 mb-2.5 border-t border-t-white-secondary">
            <div className="w-full flex">
                <div className="flex w-full overflow-hidden">
                    <div className="mr-3 h-14 w-14 rounded-[7px]">
                        <img alt={item.name} src={item.imageUrl ? item.imageUrl : ServiceDefaultIcon} className="h-14 w-14 rounded-[7px]" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <div className="flex justify-between">
                            <div className="font-semibold text-3.5 text-black-primary whitespace-nowrap overflow-hidden text-ellipsis">{item?.name}</div>
                            <div
                                className="font-bold text-3.5 text-right text-black-secondary flex items-center"
                                style={{
                                    display: isMobile ? "unset" : "none",
                                    marginLeft: "5px",
                                }}
                            >
                                {formatMoney(item.price)}
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div className="flex justify-between md:justify-start w-full md:w-auto">
                                <div className="font-normal text-3.5 text-black-secondary mr-0 md:mr-22 min-w-25">Quantity: {item.quantity}</div>
                            </div>
                            <div className="font-bold text-3.5 text-right text-black-secondary flex items-center" style={{ display: isMobile ? "none" : "unset" }}>
                                {handleAmount(item.price, item.quantity)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GiftCardItem;
