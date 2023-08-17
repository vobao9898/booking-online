import React, { useEffect, useState } from "react";
import ServiceItem from "./ServiceItem";
import ICategory from "@interfaces/ICategory";
import useAppSelector from "@hooks/useAppSelector";
import IService from "@interfaces/IService";
import QuickCart from "./QuickCart/QuickCart";
import { useMediaQuery } from "react-responsive";

interface IProps {
    category: ICategory;
}

const CategorySection: React.FC<IProps> = ({ category }) => {
    const services = useAppSelector((state) => state.service.services);
    const selectedService = useAppSelector((state) => state.cart.service);
    const [activeServices, setActiveServices] = useState<IService[]>([]);
    const [indexQuickCart, setIndexQuickCart] = useState<number>(-1);

    const fiveColumns = useMediaQuery({
        query: "(min-width: 1700px)",
    });

    const fourColumns = useMediaQuery({
        query: "(min-width: 1024px)",
    });

    const isMobile = useMediaQuery({
        query: "(max-width: 767px)",
    });

    useEffect(() => {
        if (services && services.length && category) {
            const items: IService[] = [];
            services.forEach((item) => {
                if (item.categoryId === category.categoryId) {
                    items.push(item);
                }
            });
            setActiveServices(items);
        }
    }, [services, category]);

    useEffect(() => {
        if (selectedService) {
            const newActiveService = structuredClone(activeServices);
            const index = newActiveService.findIndex((x) => x.serviceId === selectedService.serviceId);
            if (index !== -1) {
                const ITEMS_PER_ROW = fiveColumns ? 5 : fourColumns ? 4 : 2;
                const num = Math.floor(index / ITEMS_PER_ROW);
                if (newActiveService[(num + 1) * ITEMS_PER_ROW] === undefined) {
                    setIndexQuickCart(newActiveService.length);
                } else {
                    setIndexQuickCart((num + 1) * ITEMS_PER_ROW);
                }
            } else {
                setIndexQuickCart(-1);
            }
        } else {
            setIndexQuickCart(-1);
        }
    }, [selectedService, activeServices, fiveColumns, fourColumns]);

    useEffect(() => {
        if (indexQuickCart !== -1 && !isMobile) {
            const element = document.getElementById(`service-${selectedService?.serviceId}`);
            if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [indexQuickCart, selectedService, isMobile]);

    return (
        <div className={`category-section-${category.categoryId}`}>
            <p className="text-5 leading-6 font-semibold text-black-dark">{category.name}</p>
            <div className="pt-4.25 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 3xl:grid-cols-5 gap-y-4 gap-x-6">
                {activeServices.map((item, index) => {
                    return (
                        <React.Fragment key={item.serviceId}>
                            <ServiceItem service={item} />
                            {index + 1 === indexQuickCart && isMobile === false ? (
                                <div id="quick-cart-container" className="col-span-1 sm:col-span-2 lg:col-span-4 xl:col-span-4 3xl:col-span-5">
                                    <QuickCart />
                                </div>
                            ) : null}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default CategorySection;
