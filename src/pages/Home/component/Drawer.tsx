import { FC } from "react";
import Cart from "./Cart/Cart";
import { Drawer } from "antd";
import { useMediaQuery } from "react-responsive";

interface IProps {
    isDrawer: boolean;
    onCloseDrawer: () => void;
    setIsDrawer: () => void;
}

const DrawerCart: FC<IProps> = ({ isDrawer, onCloseDrawer, setIsDrawer }) => {
    const isTablet = useMediaQuery({
        query: "(max-width: 375px)",
    });
    return (
        <Drawer width={isTablet ? "100%" : "375"} headerStyle={{ display: "none" }} className="drawer-css" autoFocus={true} title={null} placement="right" onClose={onCloseDrawer} open={isDrawer} extra={<></>}>
            <Cart onCloseDrawer={onCloseDrawer} setIsDrawer={setIsDrawer}></Cart>
        </Drawer>
    );
};

export default DrawerCart;
