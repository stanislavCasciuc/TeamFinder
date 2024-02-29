import LogoSVG from "../assets/logo.svg";
import MenuSVG from "../assets/hamburger-menu-svgrepo-com.svg";
import { Container, Flex, Title } from "@mantine/core";
import { Link } from "react-router-dom";
import Sidebar from "../Components/SideBar";
import { useState } from "react";
import useAuth from "../hooks/useAuth";

const HomePage = () => {
  const [sidebar, setSidebar] = useState(false);
  const { auth } = useAuth();
  return (
    <>
      <div className="h-svh">
        <header className="border-b">
          <Flex className="p-2 items-center" gap="sm">
            <img
              src={MenuSVG}
              alt="Hamburger Menu"
              className="md:hover:bg-white md:hover:cursor-default  w-12 mr-10 ml-2 hover:bg-gray-100 rounded-3xl cursor-pointer p-2"
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
          {sidebar && <Sidebar setSidebar={setSidebar} />}
          <Container
            className={
              "hidden md:block border-r w-1/5 py-2 pr-4 pl-0 text-left  "
            }
            dir="rtl"
          >
            <Flex direction="column">
             {auth?.role!=="employee" && <Link
                to="/"
                className="font-medium text-base p-2 text-slate-600 hover:bg-slate-200 rounded-s-xl   "
              >
                Projects
              </Link>}
              <Link
                to="/"
                className="font-medium text-base p-2 text-slate-600 hover:bg-slate-200 rounded-s-xl   "
              >
                Departments
              </Link>
            </Flex>
          </Container>
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