import { addExtra, removeExtra } from "@actions/cart";
import useAppDispatch from "@hooks/useAppDispatch";
import useAppSelector from "@hooks/useAppSelector";
import ICart from "@interfaces/ICart";
import IExtra from "@interfaces/IExtra";
import { convertMinsToHrsMins, formatMoney } from "@utils/index";
import { Checkbox } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import React from "react";
import Divider from "./Divider";

interface IProps {
    extra: IExtra;
}

const ExtraItem: React.FC<IProps> = ({ extra }) => {
    const dispatch = useAppDispatch();
    const cartItem = useAppSelector((state) => state.cart.cartItem);

    const onChange = (e: CheckboxChangeEvent) => {
        if (e.target.checked) {
            dispatch(addExtra(extra));
        } else {
            dispatch(removeExtra(extra.extraId));
        }
    };

    const checkChecked = (cartItem: ICart | null, extra: IExtra) => {
        if (cartItem && cartItem.extras && cartItem.extras.length && extra) {
            const index = cartItem.extras.findIndex((x) => x.extraId === extra.extraId);
            return index !== -1 ? true : false;
        }
        return false;
    };

    const isChecked = checkChecked(cartItem, extra);

    return (
        <div className="flex flex-col gap-y-3 pb-6.75">
            <Divider />
            <div className="w-full flex items-start gap-x-2.75">
                <Checkbox checked={isChecked} onChange={onChange} />
                <div className="w-full flex flex-col gap-y-1">
                    <p className="text-3.75 leading-4.5 font-semibold text-black-dark">{extra.name}</p>
                    <div className="flex justify-between">
                        <span className="text-3.75 leading-4.5 font-normal text-gray-secondary">{convertMinsToHrsMins(extra.duration)}</span>
                        <span className="text-3.75 leading-4.5 font-semibold text-black-dark">{formatMoney(extra.price)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExtraItem;
