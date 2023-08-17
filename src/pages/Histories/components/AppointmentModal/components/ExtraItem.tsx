import IExtra from "@interfaces/IExtra";
import { convertMinsToHrsMins, formatMoney } from "@utils/index";
import React from "react";

interface IProps {
    extra: IExtra;
}

const ExtraItem: React.FC<IProps> = ({ extra }) => {
    return (
        <div className="flex mt-1.25 ">
            <div className="w-full">
                <div className="font-semibold text-3.5 text-black-secondary">{extra.extraName}</div>
                <div className="flex justify-between w-full flex-wrap h-5">
                    <div className="font-normal text-3.5 text-black-secondary">{convertMinsToHrsMins(extra.duration)}</div>
                    <div className="font-semibold text-3.5 text-black-secondary">{formatMoney(extra.price)}</div>
                </div>
            </div>
        </div>
    );
};

export default ExtraItem;
