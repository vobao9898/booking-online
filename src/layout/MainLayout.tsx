import React from "react";
import { Navigate, Outlet, useSearchParams } from "react-router-dom";

import useAppSelector from "@hooks/useAppSelector";

const MainLayout = () => {
    const [searchParams] = useSearchParams();

    const token = useAppSelector((state) => state.auth.token);
    const merchant = useAppSelector((state) => state.merchant.merchant);
    const customer = useAppSelector((state) => state.customer.customer);

    const merchantId = searchParams.get("merchant_id");
    const tokenUrl = searchParams.get("token");

    return token && merchant && customer ? (
        <React.Fragment>
            <Outlet />
        </React.Fragment>
    ) : (
        <Navigate to={`/login?merchant_id=${merchantId}&token=${tokenUrl}`} />
    );
};

export default MainLayout;
