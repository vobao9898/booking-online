import check from "@assets/images/checks.svg";
import useAppSelector from "@hooks/useAppSelector";
import Modal from "antd/es/modal/Modal";
import "rc-tabs/assets/index.css";
import TabPane from "rc-tabs/es/TabPanelList/TabPane";
import Tabs from "rc-tabs/es/Tabs";
import { ReactComponent as MenuIcon } from "@assets/images/category.svg";
import { useState } from "react";
import { Link } from "react-scroll";
import { ReactComponent as SearchIcon } from "@assets/images/search.svg";
import "./navmenu.css";

const NavMenu = () => {
    const [showModal, setShowModal] = useState(false);
    const [activeKey, setActiveKey] = useState(0);
    const [activeKeyModal, setActiveKeyModal] = useState(0);
    const [searchCategory, setSearchCategory] = useState("");

    const categories = useAppSelector((state) => state.category.categories);
    const cart = useAppSelector((state) => state.cart.cart);

    const toggleModal = () => {
        setShowModal((preVal) => !preVal);
    };

    const activeKeyMenu = (id: number) => {
        setActiveKey(id);
    };

    const countService = (categoryId: number) => {
        const total = cart.filter((x) => x.service?.categoryId === categoryId).length;
        return total;
    };

    const loadListCategory = () => {
        return (
            <div>
                <div className="bg-[#F4F4F4] rounded-md relative">
                    <input
                        className="bg-[#F4F4F4] outline-none px-2.75 pt-3 pb-3.25 pr-4 rounded-md w-[95%]"
                        placeholder="Search "
                        onChange={(e) => {
                            setSearchCategory(e.target.value);
                        }}
                    />
                    <SearchIcon className="absolute right-3 top-4" />
                </div>
                <div className="scroll-category cart-scroll scrollbar-white">
                    <div className="category-list">
                        {categories.map((item, index) => {
                            const total = countService(item.categoryId);
                            if (item.name.trim().toLowerCase().includes(searchCategory.trim().toLowerCase())) {
                                return (
                                    <Link
                                        key={item.categoryId}
                                        containerId="containerId"
                                        activeClass="border border-btn-edit text-btn-edit"
                                        className="hover:text-black item-category flex justify-between py-3.5"
                                        to={`category-section-${item.categoryId}`}
                                        spy={true}
                                        smooth={true}
                                        duration={0}
                                        offset={-10}
                                        onSetActive={() => {
                                            setActiveKeyModal(item.categoryId);
                                        }}
                                    >
                                        <div>
                                            {item.name}
                                            {total > 0 ? <span className="ml-1.25 rounded-full px-1.5 py-0.5 text-3 font-semibold text-white leading-3.75 bg-[#EA4335]">{total}</span> : null}
                                        </div>
                                        {activeKeyModal === 0 && index === 0 ? <img alt="" src={check}></img> : activeKeyModal === item.categoryId ? <img alt="" src={check}></img> : <></>}
                                    </Link>
                                );
                            }
                        })}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex items-center gap-x-4 h-full">
            <Modal
                className="modal-category modal-categorys modal-css"
                open={showModal}
                title={
                    <div className="flex">
                        <div className="title-modal">All Categories</div>
                    </div>
                }
                onOk={toggleModal}
                onCancel={toggleModal}
                footer={
                    <button className="button-modal" onClick={toggleModal}>
                        Done
                    </button>
                }
            >
                {loadListCategory()}
            </Modal>
            <MenuIcon className="flex-shrink-0 cursor-pointer" width={19} height={14} onClick={toggleModal} />
            <div className="navmenu-container overflow-x-auto">
                <Tabs animated={{ inkBar: false, tabPane: false }} tabPosition="top" activeKey={`${activeKey}`}>
                    {categories.map((item) => {
                        const total = countService(item.categoryId);
                        return (
                            <TabPane
                                tab={
                                    <>
                                        <Link
                                            containerId="containerId"
                                            activeClass="text-white bg-primary"
                                            className="px-4.5 py-1.5 text-3.75 font-medium rounded-[16.5px] "
                                            to={`category-section-${item.categoryId}`}
                                            spy={true}
                                            smooth={true}
                                            duration={500}
                                            offset={-10}
                                            onSetActive={() => {
                                                activeKeyMenu(item.categoryId);
                                            }}
                                        >
                                            {item.name}
                                            {total > 0 ? <span className="ml-1.25 rounded-full px-1.5 py-0.5 text-3 font-semibold text-white leading-3.75 bg-[#EA4335]">{total}</span> : null}
                                        </Link>
                                    </>
                                }
                                key={`${item.categoryId}`}
                            />
                        );
                    })}
                </Tabs>
            </div>
        </div>
    );
};

export default NavMenu;
