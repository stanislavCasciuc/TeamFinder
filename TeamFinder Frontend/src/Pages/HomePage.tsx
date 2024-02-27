import LogoSVG from "../assets/logo.svg";
import MenuSVG from "../assets/hamburger-menu-svgrepo-com.svg";
import { Flex, Title } from "@mantine/core";
import { Link } from "react-router-dom";
import Sidebar from "../Components/SideBar";
import { useState } from "react";

const HomePage = () => {
  const [sidebar, setSidebar] = useState(false);

  return (
    <>
      <div className="h-svh">
        <header className="border-b">
          <Flex className="p-2 items-center" gap="sm">
            <img
              src={MenuSVG}
              alt="Hamburger Menu"
              className="w-12 mr-10 ml-2 hover:bg-gray-100 rounded-3xl cursor-pointer p-2"
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
        <Flex h="90%">
          {sidebar && <Sidebar />}
          <div
            className="hidden md:block w-1/5 border-r py-2 pr-4 text-left  "
            dir="rtl"
          >
            <Flex direction="column">
              <Link
                to="/"
                className="font-medium text-base p-2 text-slate-600 hover:bg-slate-200 rounded-s-xl   "
              >
                Projects
              </Link>
              <Link
                to="/"
                className="font-medium text-base p-2 text-slate-600 hover:bg-slate-200 rounded-s-xl   "
              >
                Departments
              </Link>
            </Flex>
          </div>
          <Flex
            className="w-4/5"
            onClick={() => {
              setSidebar(false);
            }}
          ></Flex>
        </Flex>
      </div>
    </>
  );
};

export default HomePage;
