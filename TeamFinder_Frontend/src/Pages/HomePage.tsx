import LogoSVG from "../assets/logo.svg";
import { IconMenu2 } from "@tabler/icons-react";
import { Flex, Title, Modal, Button } from "@mantine/core";
import HomePageButtons from "../Components/HomepageFixed/HomePageButtons";
import Sidebar from "../Components/HomepageFixed/SideBar";
import { useState } from "react";
import Profile from "../Components/Profile/Profile";
import Users from "../Components/Users/Users";
import Departments from "../Components/Departments/Departments";
import { Routes, Route } from "react-router-dom";
import Skills from "../Components/Skills/Skills";
import MyDepartmentRoutes from "../Components/Departments/MyDepartmentRoutes";
import MySkills from "../Components/Skills/MySkills";
import CustomRoles from "../Components/TeamRoles/CustomRoles";
import Projects from "../Components/Projects/Projects";
import useSWR, { mutate } from "swr";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import { GETURL } from "../Components/EndPoints";
import { useDisclosure } from "@mantine/hooks";
import { CopyButton, ActionIcon, Tooltip, rem } from "@mantine/core";
import { IconCopy, IconCheck } from "@tabler/icons-react";

const HomePage = () => {
  const [sidebar, setSidebar] = useState(false);
  const { auth } = useAuth();
  const accessToken = auth?.accessToken;
  const [opened, { open, close }] = useDisclosure();
  const [inviteURL, setInviteURL] = useState(
    "Press generate URL to get the URL"
  );
  const myRoles = auth?.roles;

  const { data: responseData } = useSWR(
    GETURL,
    (url) => {
      console.log("Fetching data from:", url);

      return axios
        .get(url, { headers: { Authorization: `Bearer ${accessToken}` } })
        .then((response) => response.data);
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return (
    <>
      <Flex className="flex-col h-screen">
        <header className="flex border-b top-0 right-0 w-full h-16 fixed justify-between">
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
          {myRoles?.includes("Organization Admin") && (
            <div className="p-5 px-8 ">
              <span
                className="border p-3 rounded-lg font-medium text-slate-500 cursor-pointer hover:bg-gray-50 hover:text-slate-700 transition-all"
                onClick={() => {
                  open();
                  mutate(GETURL);
                }}
              >
                Get URL
              </span>
            </div>
          )}
        </header>
        <div className="flex-1 lg:w-4/5 fixed right-0 w-full top-16 h-full overflow-auto">
          <div className=" overflow-auto mb-10">
            <Routes>
              <Route path="/Profile" element={<Profile />} />
              <Route path="/Users" element={<Users />} />
              <Route path="/Departments/*" element={<Departments />} />
              <Route path="/My-Department/*" element={<MyDepartmentRoutes />} />
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

      <Modal opened={opened} onClose={close}>
        <div className="text-center">
          <h1 className="text-2xl font-semibold">
            This is your Invitation URL
          </h1>
          <Flex className="justify-center mt-7 flex-col gap-10">
            <div className="border-2 border-indigo-300 flex align-center justify-between p-2">
              <span>{inviteURL}</span>

              <CopyButton value={inviteURL} timeout={2000}>
                {({ copied, copy }) => (
                  <Tooltip
                    label={copied ? "Copied" : "Copy"}
                    withArrow
                    position="right"
                  >
                    <ActionIcon
                      color={copied ? "teal" : "gray"}
                      variant="subtle"
                      onClick={copy}
                    >
                      {copied ? (
                        <IconCheck style={{ width: rem(16) }} />
                      ) : (
                        <IconCopy style={{ width: rem(16) }} />
                      )}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
            </div>
            <Button
              onClick={() => {
                setInviteURL(
                  "localhost:5173/Register/" +
                    `${responseData.public_id}` +
                    "/Employee"
                );
              }}
            >
              Generate
            </Button>
          </Flex>
        </div>
      </Modal>
    </>
  );
};

export default HomePage;
