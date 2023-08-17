import IBlockTime from "@interfaces/IBlockTime";
import React from "react";
import moment from "moment";
import classNames from "classnames";

interface IProps {
    blockTime: IBlockTime;
    active: boolean;
    onSelecteTime: (blockTime: IBlockTime) => void;
}

const BlockTime: React.FC<IProps> = ({ blockTime, active, onSelecteTime }) => {
    const handleSelectTime = () => {
        onSelecteTime(blockTime);
    };

    return (
        <div
            className={classNames("rounded-[5px] text-center border border-text-divider py-3.25 text-black-dark cursor-pointer", {
                "bg-[#dddddd] text-white cursor-not-allowed": blockTime.isBooked,
                "bg-primary text-white": active,
            })}
            onClick={handleSelectTime}
        >
            <p className="text-sm leading-4.25 font-norma">{moment(blockTime.time, "HH:mm").format("hh:mm A")}</p>
        </div>
    );
};

export default BlockTime;
