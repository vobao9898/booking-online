import EditIcon from "@assets/images/edit.svg";
import ServiceIcon from "@assets/images/service.png";
import TrashIcon from "@assets/images/trash.svg";
import useAppSelector from "@hooks/useAppSelector";
import ICart from "@interfaces/ICart";
import { convertMinsToHrsMins, showDateTime, formatMoney } from "@utils/index";
import { Popconfirm } from "antd";
import React from "react";
import { useMediaQuery } from "react-responsive";

interface IProps {
    item: ICart;
    onRemove: (cartId: string) => void;
    onEdit: (item: ICart) => void;
    handleCloseDrawer: () => void;
}

const CartItem: React.FC<IProps> = ({ item, onRemove, onEdit, handleCloseDrawer }) => {
    const isDrawerBasket = useMediaQuery({
        query: "(min-width: 768px) and (max-width: 1200px)",
    });

    const isDeposit = useAppSelector((state) => state.appointment.isDeposit);

    const handleRemove = () => {
        onRemove(item.cartId);
    };

    const handleEdit = () => {
        onEdit(item);
        if (isDrawerBasket) handleCloseDrawer();
    };

    return (
        <div className="pt-4 pb-7 px-4 sm-px-6 border-t-[1px] border-t-border-extra">
            <div className="flex items-center">
                <img src={item.service?.imageUrl || ServiceIcon} alt="" className="flex-shrink-0 cursor-pointer rounded-[5px] h-25.25 w-25.25" />
                <div className="flex ml-3 h-[101px] w-[calc(100%-108px)] flex-col py-1 justify-between">
                    <p className="font-semibold text-4 leading-5.25 text-black-secondary text-ellipsis pr-2.5  overflow-hidden whitespace-nowrap">{item.service?.name}</p>
                    <div className="flex justify-between overflow-hidden flex-wrap">
                        <p className="font-normal leading-4.25 text-3.5 text-gray-secondary">{item.service?.duration && convertMinsToHrsMins(item.service?.duration)}</p>
                        <p className="font-bold text-3.5 text-black-secondary">{formatMoney(item.service?.price || "")}</p>
                    </div>
                    <p className="font-semibold text-3.5 leading-4 text-black-secondary">
                        <span className="font-normal">With:</span> {item.staff?.displayName}
                    </p>
                    <p className="font-semibold text-3.5 text-black-secondary">{showDateTime(item, false)}</p>
                </div>
            </div>
            {item.extras &&
                item.extras?.length > 0 &&
                item.extras?.map((ex) => {
                    return (
                        <div key={ex.extraId}>
                            <div className="flex mt-1.25">
                                <div className="w-full">
                                    <div>
                                        <div className="mt-1 border-b-[1px] border-b-border-extra">
                                            <div className="font-semibold text-3.5 text-black-secondary">{ex.name}</div>
                                            <div className="h-5 flex justify-between mb-1.25 flex-wrap">
                                                <div className="font-normal text-3.5 text-black-secondary">{ex?.duration && convertMinsToHrsMins(ex?.duration)}</div>
                                                <div className="font-semibold text-3.5 text-black-secondary">{formatMoney(ex.price)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            <div className="flex items-center justify-between space-x-3 mt-2.5">
                {!isDeposit ? (
                    <>
                        <div onClick={handleEdit} className="w-full h-9.25 border border-btn-edit rounded-md flex items-center justify-center cursor-pointer">
                            <div className="flex">
                                <img alt="edit-icon" src={EditIcon} />
                                <div className="font-semibold text-3.5 text-btn-edit ml-1.25">Edit</div>
                            </div>
                        </div>
                        <Popconfirm placement="bottomLeft" title={"Are you sure want to remove this service?"} onConfirm={handleRemove} okText="Yes" cancelText="No" className="btn-delete">
                            <div className="border border-black-three w-full h-9.25 flex items-center justify-center cursor-pointer rounded-md">
                                <div className="flex items-center">
                                    <img alt="" src={TrashIcon} className="cursor-pointer h-3.5" />
                                    <div className="font-semibold text-3.5 text-black-three ml-1">Delete</div>
                                </div>
                            </div>
                        </Popconfirm>
                    </>
                ) : null}
            </div>
        </div>
    );
};

export default CartItem;
