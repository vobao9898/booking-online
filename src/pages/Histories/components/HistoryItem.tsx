import LocationIcon from "@assets/images/location.svg";
import { capitalizeFirstLetter, handleCheckStatus, statusShow, formatMoney } from "@utils/index";
import { FC } from "react";
import moment from "moment";
import IMerchant from "@interfaces/IMerchant";

interface IProps {
    id: number;
    status: string;
    fromTime: Date;
    total: string;
    totalService: number;
    merchant: IMerchant;
    onClickItem: (id: number) => void;
}

const HistoryItem: FC<IProps> = ({ status, fromTime, total, totalService, id, merchant, onClickItem }) => {
    const handleClick = () => {
        onClickItem(id);
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
        <div className="flex flex-col bg-white px-5 py-4 md:flex-row md:items-start md:justify-between md:rounded-xl cursor-pointer" onClick={handleClick}>
            <div>
                <div className="flex items-center justify-between space-x-4 md:justify-start">
                    <p className="text-3.75 text-black-primary font-semibold leading-5"> {moment(fromTime).format("dddd, MMM DD YYYY, hh:mm A")}</p>
                    <div className={`flex flex-shrink-0 items-center gap-x-1.25 pt-0.5 pb-0.75 pl-3 pr-2.25 rounded-status ${statusShow(status)}`}>
                        <img src={handleCheckStatus(status)} />
                        <span className="text-sm leading-4.5 text-white font-semibold history-status">{capitalizeFirstLetter(status)}</span>
                    </div>
                </div>
                <div className="pt-2.75 flex gap-x-3">
                    <div className="flex-shrink-0 flex justify-center items-center w-14 h-14 rounded-lg bg-gray-dark">
                        <p className="text-white text-6.25 font-bold">{checkTypeMerchant(merchant.type, merchant.isWareHouse)}</p>
                    </div>
                    <div>
                        <p className="text-black-primary font-semibold text-sm leading-4.5">{merchant.businessName}</p>
                        <div className="pt-0.5 flex gap-1.25 items-start">
                            <div className="mt-0.5">
                                <img src={LocationIcon} />
                            </div>
                            <p className="text-sm leading-4.5 font-normal text-black-secondary">{merchant.addressFull}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="pt-4.25 flex items-center justify-between md:pt-0 md:flex-col-reverse md:items-end">
                <p className="text-black-secondary text-sm leading-4.5 font-normal">{totalService} Services</p>
                <p className="text-black-primary font-bold text-base leading-5.5">{formatMoney(total)}</p>
            </div>
        </div>
    );
};

export default HistoryItem;
