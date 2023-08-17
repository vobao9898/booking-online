import IStaff from "@interfaces/IStaff";
import React from "react";
import classNames from "classnames";
import Avatar from "@components/Avatar";
import { ReactComponent as CheckBlueIcon } from "@assets/images/check-blue.svg";

interface IProps {
    staff: IStaff;
    active: boolean;
    onSelectStaff: (staff: IStaff) => void;
}

const StaffItem: React.FC<IProps> = ({ staff, active, onSelectStaff }) => {
    const handleClick = () => {
        onSelectStaff(staff);
    };

    return (
        <div
            onClick={handleClick}
            className={classNames("flex items-center gap-x-2.75 py-2 px-2.75 cursor-pointer border boder-[#EDEDED] rounded-md", {
                "border-primary": active,
            })}
        >
            <Avatar className="flex-shrink-0" src={staff.imageUrl} />
            <div className="flex justify-between items-center w-full">
                <p className="text-4 leading-4.75 font-normal text-black-dark">{staff.displayName}</p>
                <div className={classNames({ "opacity-0": !active }, { "opacity-100": active })}>
                    <CheckBlueIcon />
                </div>
            </div>
        </div>
    );
};

export default StaffItem;
