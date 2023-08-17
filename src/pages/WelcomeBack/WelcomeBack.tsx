import useAppSelector from "@hooks/useAppSelector";
import { UserOutlined } from "@ant-design/icons";
import { ReactComponent as BackIcon } from "@assets/images/black-back-icon.svg";
import { Avatar } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import LocationIcon from "@assets/images/locationWhite.svg";

const WelcomeBack = () => {
    const merchant = useAppSelector((state) => state.merchant.merchant);
    const customer = useAppSelector((state) => state.customer.customer);

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const merchantId = searchParams.get("merchant_id");
    const token = searchParams.get("token");

    const getDisplayName = () => {
        if (!customer) return "";
        return `${customer?.firstName} ${customer?.lastName}`;
    };

    return (
        <div className="w-full h-[100svh] flex flex-col bg-gradient-to-r from-[#5E8AB4]  to-[#00ABC5]">
            <div className="w-full h-auto">
                <div className="pt-13.25 pb-12.25 text-center lg:pt-18.5 lg:pb-11.75">
                    <h5 className="font-normal text-5 leading-6 text-white lg:text-6 lg:leading-7.25">Welcome to</h5>
                    <h3 className="font-bold pt-2.5 text-8 leading-9.75 text-white lg:text-10.5 lg:leading-12.75 lg:pt-3">{merchant?.businessName || "BOOKING APPOINTMENT FORM"}</h3>
                    {merchant && (
                        <div className="pt-0.5 flex gap-1.25 items-start justify-center px-2">
                            <p className="text-sm leading-4.5 font-normal text-white flex items-start">
                                <img src={LocationIcon} className="mt-0.5" />
                                {merchant.addressFull}
                            </p>
                        </div>
                    )}
                    <p className="font-norma pt-3.75 text-3.25 leading-4 text-white lg:text-4 lg:leading-4.75 lg:pt-1.5">Book your appointment with a few simple steps!</p>
                </div>
            </div>
            <div className="w-full h-full flex flex-col items-center relative">
                <div className="absolute w-full h-full bg-white rounded-t-[30px] max-w-4xl lg:h-[510px] lg:shadow-card lg:rounded-b-[30px]">
                    <div className="relative h-full px-5 py-10 text-center flex  flex-col items-center">
                        <Avatar size={96} src={customer?.imageUrl} icon={<UserOutlined />} />
                        <p className="pt-7.25 font-bold text-5.5 leading-6.75 text-black-primary displayName">Welcome back {getDisplayName()}!</p>
                        <p className="pt-2.25 font-normal text-3.75 leading-5.25 text-black-secondary">Book your appoiment now.</p>
                        <div className="pt-9.5 flex justify-center gap-x-2.5 w-full max-w-[432px]">
                            <button
                                className={"leading-none py-4 px-6 border border-blue-secondary w-full rounded-md"}
                                onClick={() => navigate(`/histories/?merchant_id=${merchantId}&token=${token}`)}
                            >
                                <span className="font-bold text-base leading-4.75 text-blue-secondary">Book Recent</span>
                            </button>
                            <button className={"leading-none py-4 px-6 bg-blue-secondary w-full rounded-md"} onClick={() => navigate(`/home/?merchant_id=${merchantId}&token=${token}`)}>
                                <span className="font-bold text-base leading-4.75 text-white">Book Now</span>
                            </button>
                        </div>
                        <div className="absolute bottom-8.5">
                            <div className="cursor-pointer flex items-center gap-x-1.25" onClick={() => navigate(`/login/?merchant_id=${merchantId}&token=${token}`)}>
                                <BackIcon />
                                <div className="back">Another phone number?</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-[1] bg-white w-full h-full bg-gradient-to-r from-[#5E8AB4]  to-[#00ABC5]" />
                <div className="flex-[2] bg-white w-full h-full" />
            </div>
        </div>
    );
};

export default WelcomeBack;
