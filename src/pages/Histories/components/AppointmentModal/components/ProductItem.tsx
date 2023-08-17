import IProduct from "@interfaces/IProduct";
import ServiceDefaultIcon from "@assets/images/service.png";
import React from "react";
import { formatMoney } from "@utils/index";

interface IProps {
    product: IProduct;
    isMobile: boolean;
}

const ProductItem: React.FC<IProps> = ({ product, isMobile }) => {
    const handleAmount = (a: string, b: number) => {
        const result = Number(a.replace(/[^0-9.]+/g, ""));
        return formatMoney((result * b).toString()).replace("$", "$ ");
    };

    return (
        <div className="pt-2.5 mt-2.5 mb-2.5 border-t-[1px] border-t-white-secondary">
            <div className="">
                <div className="w-full flex">
                    <div className="flex w-full overflow-hidden">
                        <div className="mr-3 h-14 w-14 rounded-[7px]">
                            <img alt={product.productName} src={product.imageUrl ? product.imageUrl : ServiceDefaultIcon} className="rounded-[7px] h-14 w-14" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <div className="flex justify-between">
                                <div className="font-semibold text-3.5 text-black-primary whitespace-nowrap overflow-hidden text-ellipsis">{product?.productName}</div>
                                <div
                                    className="font-bold text-3.5 text-right text-black-secondary flex items-center"
                                    style={{
                                        display: isMobile ? "unset" : "none",
                                        marginLeft: "5px",
                                    }}
                                >
                                    {formatMoney(product.price)}
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <div className="flex justify-between md:justify-start w-full md:w-auto">
                                    <div className="font-normal text-3.5 text-black-secondary mr-0 md:mr-22 min-w-25">Quantity: {product?.quantity}</div>
                                </div>
                                <div className="font-bold text-3.5 text-right text-black-secondary flex items-center" style={{ display: isMobile ? "none" : "unset" }}>
                                    {handleAmount(product.price, product.quantity)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductItem;
