import LogoSVG from "../assets/logo.svg";
import MenuSVG from "../assets/hamburger-menu-svgrepo-com.svg";
import { Flex, Title } from "@mantine/core";
import HomePageButtons from "../Components/HomePageButtons";
import Sidebar from "../Components/SideBar";
import { useState } from "react";
import Profile from "../Components/Profile";
import Users from "../Components/Users";

const HomePage = () => {
  const [sidebar, setSidebar] = useState(false);
  const [section, setSection] = useState("Profile");

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
          {sidebar && (
            <Sidebar setSidebar={setSidebar} setSection={setSection} />
          )}
          <div
            className={
              "hidden md:block border-r w-1/5 py-2 pr-4 pl-0 text-left "
            }
          >
            <HomePageButtons setSection={setSection} setSidebar={setSidebar} />
          </div>

          <Flex
            className="md:w-4/5  md:h-full  h-fit bg-slate-50"
            onClick={() => {
              setSidebar(false);
            }}
          >
            {section === "Profile" && <Profile />}
            {section === "Users" && <Users/>}
          </Flex>
        </Flex>
      </div>
    </>
  );
};

export default HomePage;
