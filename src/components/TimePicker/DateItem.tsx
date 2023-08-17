import React from "react";
import moment from "moment";
import classNames from "classnames";

interface IProps {
    item: Date;
    active: boolean;
    isToday: boolean;
    handleSelectDate: (item: Date) => void;
}

const DateItem: React.FC<IProps> = ({ item, active, isToday, handleSelectDate }) => {
    return (
        <div className="flex flex-col gap-y-2.5 cursor-pointer" onClick={() => handleSelectDate(item)}>
            <p className="font-normal text-sm leading-4.25 text-black-dark">{moment(item).format("ddd")}</p>
            <p
                className={classNames(
                    "w-6.5 h-6.5 flex justify-center font-normal text-sm rounded-full leading-4.5 text-black-dark border border-black-primary border-opacity-0 p-1",
                    { "bg-primary text-white": active },
                    { "border-opacity-100": isToday && !active }
                )}
            >
                {moment(item).format("DD")}
            </p>
        </div>
    );
};

export default DateItem;
