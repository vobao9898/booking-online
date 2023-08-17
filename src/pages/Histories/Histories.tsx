import { useState, useEffect } from "react";
import { Spin } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import BackIcon from "@assets/images/back.svg";
import HistoryItem from "./components/HistoryItem";
import AppointmentModal from "./components/AppointmentModal/AppointmentModal";
import IAppointment from "@interfaces/IAppointment";
import AppointmentService from "@services/AppointmentService";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAppSelector from "@hooks/useAppSelector";

const PAGE_SIZE_DEFAULT = 10;

const Histories = () => {
    const merchant = useAppSelector((state) => state.merchant.merchant);
    const customer = useAppSelector((state) => state.customer.customer);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const merchantId = searchParams.get("merchant_id");
    const token = searchParams.get("token");

    const [appointments, setAppointments] = useState<IAppointment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [page_size] = useState<number>(PAGE_SIZE_DEFAULT);
    const [count, setCount] = useState<number>(0);
    const [appointment, setAppointment] = useState<IAppointment | null>(null);
    const [isModal, setIsModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let customerId = 0;
                if (customer) {
                    customerId = customer.customerId;
                }
                const { data, count } = await AppointmentService.getHistoriesByCustomer(customerId, page, page_size);
                // const newAppointments: IAppointment[] = structuredClone(appointments);
                // const temp = newAppointments.concat(data);
                setAppointments(data);
                setCount(count);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };
        if (loading) {
            fetchData();
        }
    }, [appointments, loading, page, page_size]);

    const onClickItem = async (appointmentId: number) => {
        const data = await AppointmentService.getById(appointmentId);
        setAppointment(data);
        setIsModal(true);
    };

    const onCloseModal = () => {
        setIsModal(false);
    };

    const backHome = () => {
        navigate(`/home/?merchant_id=${merchantId}&token=${token}`);
    };
    
    return (
        <div className="relative">
            <Spin style={{ position: "fixed", top: "0%", left: "50%", zIndex: 400, width: "auto" }} spinning={loading}>
                {appointment && merchant && <AppointmentModal isModal={isModal} appointment={appointment} merchant={merchant} onClose={onCloseModal} />}
                <div className="sticky top-0 z-50 right-0 px-5 pt-9 pb-6 bg-gradient-to-r from-secondary-primary to-primary flex justify-center lg:h-40">
                    <div className="max-w-[1216px] w-full flex justify-between items-center md:px-5">
                        <div>
                            <h5 className="font-bold text-5.75 leading-7.75 text-white">My Booked</h5>
                        </div>
                        <div>
                            <button
                                className="flex items-center gap-5 border border-white rounded-md px-6 py-2.5 back-history"
                                onClick={() => {
                                    backHome();
                                }}
                            >
                                <img src={BackIcon} alt="back-icon" />
                                <span className="text-base leading-4.75 font-bold text-white">Back</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-primary flex justify-center pb-10">
                    <div className="w-full max-w-[1216px] md:px-5">
                        <InfiniteScroll
                            dataLength={appointments.length}
                            next={() => {
                                setPage((page) => page + 1);
                                setLoading(true);
                            }}
                            hasMore={appointments.length < count}
                            loader={null}
                        >
                            <div className="flex flex-col gap-y-1 md:mt-6.25 md:gap-y-2.5 list-appointment">
                                {merchant &&
                                    appointments.map((item) => {
                                        return (
                                            <HistoryItem
                                                key={item.appointmentId}
                                                id={item.appointmentId}
                                                status={item.status}
                                                fromTime={item.fromTime}
                                                total={item.total}
                                                totalService={item.services.length}
                                                merchant={merchant}
                                                onClickItem={onClickItem}
                                            />
                                        );
                                    })}
                            </div>
                        </InfiniteScroll>
                    </div>
                </div>
            </Spin>
        </div>
    );
};

export default Histories;
