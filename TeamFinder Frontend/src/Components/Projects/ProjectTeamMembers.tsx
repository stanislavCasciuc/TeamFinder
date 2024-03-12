import { Flex } from "@mantine/core";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import { GETPROJECT } from "../EndPoints";
import ProjectDropdown from "./ProjectDropdown";
import { useState } from "react";

interface ProjectRole{
    comment: string;
    deallocated_comment: string;
    hours_per_day: number;
    id: number;
    is_deallocated: boolean;
    is_proposal: boolean;
    role_id: number;
    role_name: string;
    user_id: number;
    user_name: string;
}


const ProjectTeamMembers = () => {
  const { project_id } = useParams();
  const Navigate = useNavigate();
  const { auth } = useAuth();
  const accessToken = auth?.accessToken;
  const [selection, setSelection] = useState("All Users");

  const { data} = useSWR(GETPROJECT + `/${project_id}`, (url) => {
    return axios
      .get(url, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((response) => response.data);
  });
let filteredUsers: ProjectRole[] = [];

if (selection === "All Users") {
    filteredUsers = data?.project_roles.map((member: ProjectRole) => member);
} else if (selection === "Deallocated") {
    filteredUsers = data?.project_roles.filter((member: ProjectRole) => member.is_deallocated === true);
} else if (selection === "Proposal") {
    filteredUsers = data?.project_roles.filter((member: ProjectRole) => member.is_proposal === true);
} else if (selection === "Active Users") {
    filteredUsers = data?.project_roles.filter((member: ProjectRole) => member.is_deallocated === false);
}

  const members = filteredUsers?.map((member: ProjectRole) => {
    return (
      <Flex className="border-b p-4 justify-between">
        <div className="font-semibold">{member.role_name}</div>
        <div>{member.user_name ? member.user_name : "No user assigned"}</div>
      </Flex>
    );
  });

  return (
    <>
      <header className="flex bg-white p-4 justify-between">
        <Flex
          className="border items-center py-3 px-7 rounded-xl shadow-sm text-slate-600"
          gap="xl"
        >
          <div
            onClick={() => {
              Navigate(`/HomePage/Projects/${project_id}`);
            }}
            className="hover:text-indigo-400 cursor-pointer"
          >
            Project
          </div>
          <div
            onClick={() => {
              Navigate(`/HomePage/Projects/${project_id}/TeamFinder`);
            }}
            className="hover:text-indigo-400 cursor-pointer"
          >
            Team Finder
          </div>
          <div
            onClick={() => {
              Navigate(`/HomePage/Projects/${project_id}/TeamMembers`);
            }}
            className="hover:text-indigo-400 cursor-pointer"
          >
            Team Members
          </div>
        </Flex>
      </header>{" "}
      <div className="flex flex-row align-center justify-center">
        <Flex className="flex-col gap-4  text-slate-500 w-3/5 shadow-lg m-5 rounded-xl ">
          <ProjectDropdown
            selection={selection}
            setSelection={setSelection}
            values={["Active Users", "Deallocated", "Proposal"]}
            values2="All Users"
          />
          {members}
        </Flex>
      </div>
    </>
  );
};

export default ProjectTeamMembers;
