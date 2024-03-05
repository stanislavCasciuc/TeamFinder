import LogoSVG from "../assets/logo.svg";
import MenuSVG from "../assets/hamburger-menu-svgrepo-com.svg";
import { Flex, Title } from "@mantine/core";
import HomePageButtons from "../Components/HomePageButtons";
import Sidebar from "../Components/SideBar";
import { useState } from "react";
import Profile from "../Components/Profile";
import Users from "../Components/Users";
import Departments from "../Components/Departments";
import { Routes, Route } from "react-router-dom";

const HomePage = () => {
  const [sidebar, setSidebar] = useState(false);

  return (
    <>
      <Flex className="flex-col h-screen">
        <header className="flex border-b top-0 right-0 w-full h-16 fixed">
          <Flex className="items-center" gap="sm">
            <img
              src={MenuSVG}
              alt="Hamburger Menu"
              className="md:hover:bg-white md:hover:cursor-default w-12 mr-10 ml-2 hover:bg-gray-100 rounded-3xl cursor-pointer p-2"
              onClick={() => {
                setSidebar(!sidebar);
              }}
            />
            <img src={LogoSVG} alt="Team Finder Logo" className="w-6" />
            <Title
              order={2}
              className="font-normal text-xl left text-slate-600"
            >
              TeamFinder
            </Title>
          </Flex>
        </header>
        <div className="flex-1 bg-slate-50 md:w-4/5 fixed right-0 w-full top-16 h-full overflow-auto">
          <div className="overflow-auto p-4 mb-10">
            <Routes>
              <Route path="/Profile" element={<Profile />} />
              <Route path="/Users" element={<Users />} />
              <Route path="/Departments/*" element={<Departments />} />
            </Routes>
          </div>
        </div>
        <div className="w-1/5 fixed left-0 top-16 h-full ">
          {sidebar && <Sidebar setSidebar={setSidebar} />}
          <div className="hidden md:block border-r py-2 pr-4 pl-0 text-left h-full">
            <HomePageButtons setSidebar={setSidebar} />
          </div>
        </div>
      </Flex>
    </>
  );
};

export default HomePage;
