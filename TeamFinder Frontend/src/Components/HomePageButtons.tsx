import { Flex } from "@mantine/core";
import useAuth from "../hooks/useAuth";
import { Button } from "@mantine/core";
import { IconUserCircle } from "@tabler/icons-react";

interface HomePageButtonsProps {
  setSection: (value: string) => void;
  setSidebar: (value: boolean) => void;
}

const HomePageButtons = ({ setSection, setSidebar }: HomePageButtonsProps) => {
  const { auth } = useAuth();
  return (
    <Flex direction="column" dir="rtl">
      <Button
        className=" font-medium text-base p-2 text-slate-600 hover:bg-slate-200 rounded-s-xl text-right "
        onClick={() => {
          setSection("Profile");
          setSidebar(false);
        }}
        rightSection={<IconUserCircle size={24} />}
      >
        Profile
      </Button>

      {auth?.role === "organization_admin" && (
        <>
          <Button
            className="font-medium text-base p-2 text-slate-600 hover:bg-slate-200 rounded-s-xl   "
            onClick={() => {}}
          >
            Users
          </Button>
          <Button
            className="font-medium text-base p-2 text-slate-600 hover:bg-slate-200 rounded-s-xl   "
            onClick={() => {}}
          >
            Roles
          </Button>
          <Button
            className="font-medium text-base p-2 text-slate-600 hover:bg-slate-200 rounded-s-xl   "
            onClick={() => {}}
          >
            Departments
          </Button>
          <Button
            className="font-medium text-base p-2 text-slate-600 hover:bg-slate-200 rounded-s-xl   "
            onClick={() => {}}
          >
            All projects
          </Button>
          <Button
            className="font-medium text-base p-2 text-slate-600 hover:bg-slate-200 rounded-s-xl   "
            onClick={() => {}}
          >
            Requests
          </Button>
        </>
      )}

      {auth?.role === "employee" && (
        <>
          <Button
            className="font-medium text-base p-2 text-slate-600 hover:bg-slate-200 rounded-s-xl   "
            onClick={() => {}}
          >
            My Projects
          </Button>
          <Button
            className="font-medium text-base p-2 text-slate-600 hover:bg-slate-200 rounded-s-xl   "
            onClick={() => {}}
          >
            My Requests
          </Button>
          <Button
            className="font-medium text-base p-2 text-slate-600 hover:bg-slate-200 rounded-s-xl   "
            onClick={() => {}}
          >
            My Skills
          </Button>
        </>
      )}

      {auth?.role === "departament_Manager" && (
        <>
          <Button
            className="font-medium text-base p-2 text-slate-600 hover:bg-slate-200 rounded-s-xl   "
            onClick={() => {}}
          >
            My Projects
          </Button>
          <Button
            className="font-medium text-base p-2 text-slate-600 hover:bg-slate-200 rounded-s-xl   "
            onClick={() => {}}
          >
            My Requests
          </Button>
          <Button
            className="font-medium text-base p-2 text-slate-600 hover:bg-slate-200 rounded-s-xl   "
            onClick={() => {}}
          >
            My Skills
          </Button>
          <Button
            className="font-medium text-base p-2 text-slate-600 hover:bg-slate-200 rounded-s-xl   "
            onClick={() => {}}
          >
            My Department
          </Button>
        </>
      )}

      {auth?.role === "project_Manager" && (
        <>
          <Button
            className="font-medium text-base p-2 text-slate-600 hover:bg-slate-200 rounded-s-xl   "
            onClick={() => {}}
          >
            My Projects
          </Button>
          <Button
            className="font-medium text-base p-2 text-slate-600 hover:bg-slate-200 rounded-s-xl   "
            onClick={() => {}}
          >
            My Requests
          </Button>
          <Button
            className="font-medium text-base p-2 text-slate-600 hover:bg-slate-200 rounded-s-xl   "
            onClick={() => {}}
          >
            My Skills
          </Button>
        </>
      )}
    </Flex>
  );
};

export default HomePageButtons;
