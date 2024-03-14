import { Button, Pagination } from "@mantine/core";
import { Accordion, LoadingOverlay, Flex } from "@mantine/core";
import useSWR from "swr";
import { TEAMFIND } from "../EndPoints";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ProjectDropdown from "./ProjectDropdown";
;
import AssignUserModal from "./AssignUserModal";
import ProjectHeaders from "./ProjectHeaders";

interface TeamUserData {
  name: string;
  skills: string[];
  id: number;
  projects: ProjectData[];
  is_proposal: boolean;
  is_deallocated: boolean;
}

interface ProjectData {
  project_name: string;
  hours_per_day: number;
  remaining_days: number;
  project_roles: TeamUserData[];
}

const TeamFinder = () => {
  const { project_id } = useParams();
  const { auth } = useAuth();
  const accessToken = auth?.accessToken;
  const [currentPage, setCurrentPage] = useState(1);
  const elementsPerPage = 7;
  const navigate = useNavigate();
  const [selection, setSelection] = useState("Fully Available");
  const [buttonPressed, setButtonPressed] = useState(false);
  const [open, setOpen] = useState(false);

  const { data, isLoading, mutate } = useSWR<TeamUserData[]>(
    buttonPressed ? TEAMFIND + `${project_id}` : null,
    async (url) => {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return response.data;
    },
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
    
  if (isLoading) return <LoadingOverlay visible={true} />;

  let filteredUsers: TeamUserData[] | undefined = data?.map(
    (user: TeamUserData) => user
  );
  if (selection === "Partially Available") {
    filteredUsers = data?.filter((user: TeamUserData) => {
      const totalHours =
        user.projects?.reduce(
          (sum, project) => sum + project.hours_per_day,
          0
        ) || 0;
      const remainingHours = 8 - totalHours;
      return remainingHours < 8 && remainingHours > 0;
    });
  }
  if (selection === "Fully Available") {
    filteredUsers = data?.filter((user: TeamUserData) => {
      const totalHours =
        user.projects?.reduce(
          (sum, project) => sum + project.hours_per_day,
          0
        ) || 0;
      const remainingHours = 8 - totalHours;
      return remainingHours === 8;
    });
  }
  if (selection === "Not Available") {
    filteredUsers = data?.filter((user: TeamUserData) => {
      const totalHours =
        user.projects?.reduce(
          (sum, project) => sum + project.hours_per_day,
          0
        ) || 0;
      const remainingHours = 8 - totalHours;
      return remainingHours === 0;
    });
  }



  const users = filteredUsers?.map((user: TeamUserData) => {
    const userTotalHours =
      user?.projects?.reduce(
        (sum, project) => sum - project.hours_per_day,
        8
      ) ?? 8;

    return (
      <Accordion.Item
        className="align-center"
        key={user.id}
        value={`${user.name}`}
      >
        <Accordion.Control
          className="p-2"
          onClick={() => {
            navigate(
              `/Homepage/Projects/${project_id}/TeamFinder?user_id=${user.id}`
            );
          }}
          icon={
            <Flex className="w-10 h-10 text-indigo-600 bg-indigo-50 items-center align-center justify-center rounded-full">
              <span className="text-md font-bold">
                {user.name.substring(0, 1).toUpperCase()}
              </span>
            </Flex>
          }
        >
          <span className="font-semibold text-slate-600">{user.name}</span>
          <div className="text-xs text-slate-400">
            Free time : {userTotalHours} hour/s
          </div>
        </Accordion.Control>

        <Accordion.Panel className="border-t bg-white pt-2">
          <Flex direction="column" className="mt-2 gap-4  flex-wrap ">
            <Button
              onClick={() => {
                setOpen(true);
              }}
            >
              Assign
            </Button>
            <span className="font-semibold text-md mt-2">Related Skills: </span>{" "}
            <div className="flex gap-2 flex-wrap">
              {user.skills.map((skill: string, index: number) => {
                return (
                  <span
                    key={index}
                    className="text-sm font-semibold mt-2 bg-indigo-100 px-2 py-1 rounded-md"
                  >
                    {skill}
                  </span>
                );
              })}
            </div>
          </Flex>
        </Accordion.Panel>

        <Accordion.Panel className=" bg-white">
          <Flex direction="column" className="mt-2 gap-4  flex-wrap ">
            <span className="font-semibold text-md mt-2">
              Ongoing projects:{" "}
            </span>
            <div className="flex flex-col gap-2 ">
              {user?.projects?.map((project: ProjectData) => {
                return (
                  <span className="text-sm font-semibold mt-2 bg-indigo-100 px-2 py-1 rounded-md flex justify-between">
                    <span>{project.project_name}</span>
                    <span>{project.hours_per_day} hours per day </span>
                    <span>for {project.remaining_days} days</span>
                  </span>
                );
              })}
            </div>
          </Flex>
        </Accordion.Panel>
      </Accordion.Item>
    );
  });

  const indexOfLastSkill = currentPage * elementsPerPage;
  const indexOfFirstSkill = indexOfLastSkill - elementsPerPage;
  const currentUsers = users?.slice(indexOfFirstSkill, indexOfLastSkill);

  let pageNumbers = 1;
  for (let i = 0; i < Math.ceil((users?.length ?? 0) / elementsPerPage); i++) {
    pageNumbers = pageNumbers + i;
  }

  return (
    <>
      <header className="flex bg-white p-4  ">
        <ProjectHeaders project_id={project_id} />
      </header>

      <Flex>
        <div className="flex flex-row align-center justify-center w-full ">
          <Accordion className="w-3/5 shadow-md p-8 mb-20 text-slate-500 rounded-xl">
            <div className="flex flex-row text-sm justify-between">
              <Button
                className="my-4"
                onClick={() => {
                  setButtonPressed(true);
                  mutate();
                }}
              >
                Find
              </Button>
              <ProjectDropdown
                selection={selection}
                setSelection={setSelection}
                values={["Partially Available", "Not Available"]}
                values2="Fully Available"
              />
            </div>
            {currentUsers}
            <Pagination
              className="mt-4 text-slate-500"
              total={pageNumbers}
              value={currentPage}
              onChange={setCurrentPage}
            />
          </Accordion>
        </div>
      </Flex>
      <AssignUserModal open={open} setOpen={setOpen} />
    </>
  );
};

export default TeamFinder;
