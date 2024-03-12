import LogoSVG from "../assets/logo.svg";
import { IconMenu2 } from "@tabler/icons-react";
import { Flex, Title } from "@mantine/core";
import HomePageButtons from "../Components/HomepageFixed/HomePageButtons";
import Sidebar from "../Components/HomepageFixed/SideBar";
import { useState } from "react";
import Profile from "../Components/Profile/Profile";
import Users from "../Components/Users/Users";
import Departments from "../Components/Departments/Departments";
import { Routes, Route } from "react-router-dom";
import Skills from "../Components/Skills/Skills";
import MyDepartment from "../Components/Departments/MyDepartment";
import MySkills from "../Components/Skills/MySkills";
import CustomRoles from "../Components/TeamRoles/CustomRoles";
import Projects from "../Components/Projects/Projects";

const HomePage = () => {
  const [sidebar, setSidebar] = useState(false);

  return (
    <>
      <Flex className="flex-col h-screen">
        <header className="flex border-b top-0 right-0 w-full h-16 fixed">
          <Flex className="items-center" gap="sm">
            <IconMenu2
              className="lg:hover:bg-white md:hover:cursor-default w-12 mr-10 ml-4 hover:bg-gray-50 rounded-3xl cursor-pointer text-slate-700"
              onClick={() => {
                setSidebar(!sidebar);
              }}
              size={28}
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
        <div className="flex-1 lg:w-4/5 fixed right-0 w-full top-16 h-full overflow-auto">
          <div className=" overflow-auto mb-10">
            <Routes>
              <Route path="/Profile" element={<Profile />} />
              <Route path="/Users" element={<Users />} />
              <Route path="/Departments/*" element={<Departments />} />
              <Route path="/My-Department" element={<MyDepartment />} />
              <Route path="/Skills/*" element={<Skills />} />
              <Route path="/My-Skills" element={<MySkills />} />
              <Route path="/Custom-Roles" element={<CustomRoles />} />
              <Route path="/Projects/*" element={<Projects />} />
            </Routes>
          </div>
        </div>
        <div className="md:w-1/5 fixed left-0 top-16 h-full ">
          {sidebar && <Sidebar setSidebar={setSidebar} />}

          <div className="hidden lg:block border-r py-2 pr-4 pl-0 text-left h-full">
            <HomePageButtons setSidebar={setSidebar} />
          </div>
        </div>
      </Flex>
    </>
  );
};

export default HomePage;
