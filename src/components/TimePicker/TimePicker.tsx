import React, { useEffect, useRef, useState } from "react";
import Button from "@components/Button";
import useAppDispatch from "@hooks/useAppDispatch";
import useAppSelector from "@hooks/useAppSelector";
import IBlockTime from "@interfaces/IBlockTime";
import StaffService from "@services/StaffService";
import moment from "moment";
import { selectDateTime } from "@actions/cart";
import { closeModal, getAvailableTimeError, getAvailableTimeRequest, getAvailableTimeSuccess } from "@actions/time";
import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { getTimeAvaible, showToastError } from "@utils/index";
import { Modal, Spin } from "antd";
import "swiper/css";
import BlockTime from "./BlockTime";
import DateItem from "./DateItem";

const TimePicker: React.FC = () => {
    const swiperRef = useRef<SwiperRef | null>(null);

    const dispatch = useAppDispatch();

    const open = useAppSelector((state) => state.time.openModal);
    const loading = useAppSelector((state) => state.time.loading);
    const cartItem = useAppSelector((state) => state.cart.cartItem);

    const [searchParams] = useSearchParams();
    const merchantId = searchParams.get("merchant_id");

    const [today] = useState<Date>(moment().toDate());
    const [date, setDate] = useState<Date>(cartItem?.date || moment().toDate());
    const [selectedDate, setSelectDate] = useState<Date>(cartItem?.date || moment().toDate());

    const [selectTime, setSelectTime] = useState(cartItem?.time || "");
    const [blockTimes, setBlockTimes] = useState<IBlockTime[]>([]);

    useEffect(() => {
        const fetchBlockTimes = async (staffId: number, date: string, merchantId: number) => {
            try {
                const blockTimes = await StaffService.getAvaliableTime(staffId, date, merchantId);
                setBlockTimes(blockTimes);
                dispatch(getAvailableTimeSuccess());
            } catch (error) {
                dispatch(getAvailableTimeError());
            }
        };
        if (loading && open && merchantId && cartItem?.staff?.staffId !== undefined && selectedDate) {
            const date = moment(selectedDate).format("YYYY-MM-DD");
            const staffId = cartItem?.staff?.staffId === -1 ? 0 : cartItem?.staff?.staffId;
            fetchBlockTimes(staffId, date, parseInt(merchantId));
        }
    }, [open, cartItem?.staff?.staffId, loading, merchantId, selectedDate, dispatch]);

    const handleNextMonth = () => {
        setDate((date) => moment(date).add(1, "months").startOf("month").toDate());
    };

    const handlePreviousMonth = () => {
        setDate((date) => moment(date).subtract(1, "months").startOf("month").toDate());
    };

    const handleNextWeek = () => {
        if (swiperRef && swiperRef.current) {
            setDate((date) => moment(date).add(7, "days").toDate());
            swiperRef.current.swiper.slideNext();
        }
    };

    const handlePreviousWeek = () => {
        if (swiperRef && swiperRef.current) {
            setDate((date) => moment(date).subtract(7, "days").toDate());
            swiperRef.current.swiper.slidePrev();
        }
    };

    const handleClose = () => {
        dispatch(closeModal());
        setSelectDate(moment().toDate());
    };

    const getCurrentWeekDays = () => {
        const weekStart = moment(date).subtract(3, "days");
        const days = [];
        for (let i = 0; i <= 6; i++) {
            days.push(moment(weekStart).add(i, "days").toDate());
        }
        return days;
    };

    const handleSelectDate = (item: Date) => {
        setSelectDate(item);
        setSelectTime("");
        dispatch(getAvailableTimeRequest());
    };

    const handleSelectTime = (blockTime: IBlockTime) => {
        if (blockTime.isBooked === false) {
            setSelectTime(blockTime.time);
        }
    };

    const handleSubmit = () => {
        if (selectTime.trim()) {
            dispatch(selectDateTime(new Date(selectedDate), selectTime));
            handleClose();
            setSelectDate(moment().toDate());
        } else {
            showToastError("Please choose your time");
        }
    };

    const checkIsToDay = (date: Date) => {
        return moment(date, "YYYY/MM/DD").isSame(moment(today, "YYYY/MM/DD"), "dates");
    };

    const checkIsActive = (date: Date) => {
        return moment(date, "YYYY/MM/DD").isSame(moment(selectedDate, "YYYY/MM/DD"), "dates");
    };

    const days = getCurrentWeekDays();

    const { morning, afternoon, evening } = getTimeAvaible(blockTimes);

    return (
        <Modal
            className="modal-css modal-category"
            title={<p className="text-5 leading-6 text-black-dark font-semibold">Select Date/Time</p>}
            open={open}
            onOk={handleClose}
            onCancel={handleClose}
            footer={null}
            width={1200}
        >
            <Spin spinning={loading}>
                <div className="w-full pt-7">
                    <div className="w-full flex flex-col items-center justify-center">
                        <div className="w-full flex justify-center items-center gap-x-5">
                            <div onClick={handlePreviousMonth} className="flex items-center cursor-pointer">
                                <CaretLeftOutlined />
                            </div>
                            <p className="text-4.5 leading-5.5 font-semibold text-black-dark">{moment(date).format("MMMM")}</p>
                            <div onClick={handleNextMonth} className="flex items-center cursor-pointer">
                                <CaretRightOutlined />
                            </div>
                        </div>
                        <div className="w-full flex pt-3 items-center justify-center gap-x-4">
                            <div onClick={handlePreviousWeek} className="flex items-center cursor-pointer">
                                <CaretLeftOutlined />
                            </div>
                            <div className="w-[485px] max-w-[90%]">
                                <Swiper loop spaceBetween={16} slidesPerView={1} ref={swiperRef}>
                                    <SwiperSlide>
                                        <div className="flex justify-between">
                                            {days.map((item, index) => {
                                                return <DateItem active={checkIsActive(item)} isToday={checkIsToDay(item)} key={index} item={item} handleSelectDate={handleSelectDate} />;
                                            })}
                                        </div>
                                    </SwiperSlide>
                                    <SwiperSlide>
                                        <div className="flex justify-between">
                                            {days.map((item, index) => {
                                                return <DateItem active={checkIsActive(item)} isToday={checkIsToDay(item)} key={index} item={item} handleSelectDate={handleSelectDate} />;
                                            })}
                                        </div>
                                    </SwiperSlide>
                                </Swiper>
                            </div>
                            <div onClick={handleNextWeek} className="flex items-center cursor-pointer">
                                <CaretRightOutlined />
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 border-t border-text-divider" />
                    <div className="pt-5">
                        <h5 className="text-4.5 leading-5.5 font-semibold text-black-dark">Avaliable hour</h5>
                        <div className="pt-4 pb-6 h-[40vh] lg:h-auto overflow-auto overflow-x-hidden scrollbar-white">
                            <div className="grid lg:grid-cols-3 grid-cols-1 gap-10">
                                <div>
                                    <p className="text-3.75 leading-4.5 font-semibold text-gray-secondary">Morning</p>
                                    <div className="pt-2.5 grid grid-cols-3 gap-x-3 gap-y-2.5">
                                        {morning?.map((item) => {
                                            return <BlockTime key={item.id} blockTime={item} active={selectTime === item.time} onSelecteTime={handleSelectTime} />;
                                        })}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-3.75 leading-4.5 font-semibold text-gray-secondary">Afternoon</p>
                                    <div className="pt-2.5 grid grid-cols-3 gap-x-3 gap-y-2.5">
                                        {afternoon?.map((item) => {
                                            return <BlockTime key={item.id} blockTime={item} active={selectTime === item.time} onSelecteTime={handleSelectTime} />;
                                        })}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-3.75 leading-4.5 font-semibold text-gray-secondary">Evening</p>
                                    <div className="pt-2.5 grid grid-cols-3 gap-x-3 gap-y-2.5">
                                        {evening?.map((item) => {
                                            return <BlockTime key={item.id} blockTime={item} active={selectTime === item.time} onSelecteTime={handleSelectTime} />;
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-text-divider" />
                    <div className="pt-5.5 flex justify-center">
                        <Button className="max-w-xs" variant={"contained"} onClick={handleSubmit}>
                            <span className="font-bold text-base leading-4.75 text-white">Done</span>
                        </Button>
                    </div>
                </div>
            </Spin>
        </Modal>
    );
};

export default TimePicker;
