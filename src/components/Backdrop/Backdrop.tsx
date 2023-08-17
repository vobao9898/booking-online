import React from "react";
import classNames from "classnames";
import "./Backdrop.css";

interface IProps {
    open: boolean;
}

const Backdrop: React.FC<IProps> = ({ open }) => {
    return (
        <div
            className={classNames(
                "backdrop-container fixed top-0 left-0 right-0 bottom-0 bg-[#00000080] flex justify-center items-center text-white z-[1201] transition-all duration-150 ease-in-out",
                {
                    "invisible opacity-0": !open,
                    "visible opacity-100": open,
                }
            )}
        >
            <span className="spiner"></span>
        </div>
    );
};

export default Backdrop;
