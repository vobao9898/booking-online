import { selectStaff } from "@actions/cart";
import { closeModal, getStaffsError, getStaffsRequest, getStaffsSuccess } from "@actions/staff";
import { ReactComponent as SearchIcon } from "@assets/images/search.svg";
import { showToastError } from "@utils/index";
import { Modal, Spin } from "antd";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import WaitingListStaffIcon from "@assets/images/staff1.svg";
import AnyStaffIcon from "@assets/images/staff2.svg";
import Button from "@components/Button/Button";
import useAppDispatch from "@hooks/useAppDispatch";
import useAppSelector from "@hooks/useAppSelector";
import IStaff from "@interfaces/IStaff";
import StaffService from "@services/StaffService";
import StaffItem from "./components/StaffItem";
import moment from "moment";

const ANONYMOUS_STAFFS: IStaff[] = [
    {
        staffId: -1,
        displayName: "Waiting list",
        imageUrl: WaitingListStaffIcon,
        tip: "",
    },
    {
        staffId: 0,
        displayName: "Any staff",
        imageUrl: AnyStaffIcon,
        tip: "",
    },
];

const StaffModal = () => {
    const dispatch = useAppDispatch();

    const open = useAppSelector((state) => state.staff.openModal);
    const loading = useAppSelector((state) => state.staff.loading);
    const service = useAppSelector((state) => state.cart.service);
    const cartItem = useAppSelector((state) => state.cart.cartItem);
    const cart = useAppSelector((state) => state.cart.cart);
    const isEdit = useAppSelector((state) => state.cart.isEdit);

    const [staffs, setStaffs] = useState<IStaff[]>([]);
    const [search, setSearch] = useState<string>("");
    const [selectedStaff, setSelectedStaff] = useState<IStaff | null>(null);

    const [searchParams] = useSearchParams();

    const merchantId = searchParams.get("merchant_id");

    useEffect(() => {
        setSearch("");
    }, [open]);

    useEffect(() => {
        const fetchStaffs = async (serviceId: number, merchantId: number) => {
            try {
                dispatch(getStaffsRequest());
                const data = await StaffService.getStaffByService(serviceId, merchantId);
                setStaffs(data);
                dispatch(getStaffsSuccess());
            } catch (error) {
                dispatch(getStaffsError());
            }
        };

        if (loading && service && service.serviceId && merchantId && parseInt(merchantId)) {
            fetchStaffs(service.serviceId, parseInt(merchantId));
            if (cartItem && cartItem.staff === null) {
                setSelectedStaff(null);
            }
        }
        if (cartItem?.staff) {
            setSelectedStaff(cartItem.staff);
        } else {
            setSelectedStaff(null);
        }
    }, [merchantId, loading, service, cartItem, dispatch]);

    const handleClose = () => {
        dispatch(closeModal());
        setSelectedStaff(null);
    };

    const handleSelectStaff = (staff: IStaff) => {
        if (selectedStaff?.staffId !== staff.staffId) {
            setSelectedStaff(staff);
        }
    };

    const checkActiveStaff = (staffId: number, selectedId?: number) => {
        return selectedId === staffId;
    };

    const handleSubmit = async () => {
        if (selectedStaff && merchantId) {
            let isAllBooked = false;
            if (selectedStaff.staffId === -1) {
                const blocktimes = await StaffService.getAvaliableTime(0, moment().format("YYYY-MM-DD"), parseInt(merchantId));
                isAllBooked = blocktimes.filter((x) => x.isBooked === false).length === 0 ? true : false;
            }
            dispatch(selectStaff(selectedStaff, isAllBooked));
            handleClose();
            setSelectedStaff(null);
        } else {
            showToastError("Please choose your staff");
        }
    };

    const checkShowAnonymousStaffs = () => {
        if (cart && cart.length > 1 && cart[0].staff?.staffId) {
            return false;
        }

        if (!isEdit && cart && cart.length && cart[0].staff?.staffId) {
            return false;
        }

        return true;
    };

    return (
        <Modal
            className="modal-css modal-category"
            title={<p className="text-5 leading-6 text-black-dark font-semibold">Select Staff</p>}
            open={open}
            onOk={handleClose}
            onCancel={handleClose}
            footer={null}
        >
            <div className="pt-2">
                <div className="bg-gray-primary relative">
                    <input
                        className="bg-gray-primary outline-none px-2.75 pt-3 pb-3.25 pr-4 w-[95%]"
                        placeholder="Search staff"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                        }}
                    />
                    <SearchIcon className="absolute right-3 top-4" />
                </div>
                <Spin spinning={loading}>
                    <div className="mt-4.25 md:h-[400px] h-[48vh] overflow-y-auto no-scrollbar">
                        {checkShowAnonymousStaffs() ? (
                            <div className="grid grid-cols-1 gap-y-2.5 md:grid-cols-2 md:gap-x-5.75 md:gap-y-4.5">
                                {ANONYMOUS_STAFFS.map((item) => {
                                    return <StaffItem key={item.staffId} staff={item} active={checkActiveStaff(item.staffId, selectedStaff?.staffId)} onSelectStaff={handleSelectStaff} />;
                                })}
                            </div>
                        ) : null}
                        <div className="pt-8">
                            <p className="pb-2.5 text-4.25 leading-5.25 font-bold text-primary">Available for this services</p>
                            <div className="grid grid-cols-1 gap-y-2.5 md:grid-cols-2 md:gap-x-5.75 md:gap-y-4.5">
                                {!loading &&
                                    staffs.map((item) => {
                                        if (item.displayName.toLowerCase().includes(search.trim().toLowerCase())) {
                                            return <StaffItem key={item.staffId} staff={item} active={checkActiveStaff(item.staffId, selectedStaff?.staffId)} onSelectStaff={handleSelectStaff} />;
                                        }
                                    })}
                            </div>
                        </div>
                    </div>
                </Spin>
                <div className="pt-3.5 pb-4.5 flex justify-center lg:pt-6.75">
                    <Button onClick={handleSubmit} disabled={!selectedStaff} className="max-w-sm py-3.75" variant={"contained"}>
                        <span className="font-bold text-base leading-4.75 text-white">Done</span>
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default StaffModal;
