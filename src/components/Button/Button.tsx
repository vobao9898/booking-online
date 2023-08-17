import React, { FC } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import classNames from "classnames";

interface IProps extends React.HTMLProps<HTMLButtonElement> {
    variant: "text" | "contained" | "outlined";
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    loading?: boolean;
    className?: string;
}

const antIcon = <LoadingOutlined style={{ fontSize: 19, color: "#FFFFFF" }} spin />;

const Button: FC<IProps> = ({ variant, disabled = false, loading = false, type = "button", className = "", children, ...props }) => {
    return (
        <button
            {...props}
            disabled={disabled}
            type={type}
            className={classNames(
                "leading-none py-4 px-8  w-full rounded-md gap-x-2 flex items-center justify-center",
                { "bg-blue-secondary": variant === "contained" },
                {
                    "opacity-50": loading || disabled,
                    "opacity-100": !loading && !disabled,
                },
                className
            )}
        >
            {loading ? <Spin indicator={antIcon} /> : null}
            {children}
        </button>
    );
};

export default Button;
