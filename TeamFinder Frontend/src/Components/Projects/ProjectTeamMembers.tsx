import { Flex,  Badge } from "@mantine/core";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import { GETPROJECT } from "../EndPoints";
import ProjectDropdown from "./ProjectDropdown";
import { useState } from "react";
import ProjectHeaders from "./ProjectHeaders";
import DeallocateUserModal from "./DeallocateUserModal";
import { useNavigate } from "react-router-dom";

interface ProjectRole {
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
  const { auth } = useAuth();
  const accessToken = auth?.accessToken;
  const [selection, setSelection] = useState("All Roles");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const { data } = useSWR(GETPROJECT + `/${project_id}`, (url) => {
    return axios
      .get(url, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((response) => response.data);
  });

  let filteredUsers: ProjectRole[] = [];

  if (selection === "All Roles") {
    filteredUsers = data?.project_roles.map((member: ProjectRole) => member);
  } else if (selection === "Deallocated") {
    filteredUsers = data?.project_roles.filter(
      (member: ProjectRole) =>
        member.is_deallocated === true && member.is_proposal === false
    );
  } else if (selection === "Proposed") {
    filteredUsers = data?.project_roles.filter(
      (member: ProjectRole) =>
        member.is_proposal === true && member.is_deallocated === false
    );
  } else if (selection === "Deallocating") {
    filteredUsers = data?.project_roles.filter(
      (member: ProjectRole) =>
        member.is_proposal === true && member.is_deallocated === true
    );
  } else if (selection === "Active Users") {
    filteredUsers = data?.project_roles.filter(
      (member: ProjectRole) =>
        member.is_deallocated === false &&
        member.is_proposal === false &&
        member.user_name
    );
  }

  const members = filteredUsers?.map((member: ProjectRole) => {
    return (
      <div className="p-4 grid gap-4 grid-cols-4 ">
        <div className="font-semibold border-r">{member.role_name}</div>
        <div className="border-r">
          {member.user_name ? member.user_name : "No user assigned"}
        </div>
        <div className="border-r">
          <Badge
            className={`
      
    ${
      member.is_deallocated && !member.is_proposal
        ? "bg-red-400"
        : member.is_proposal && !member.is_deallocated
        ? "bg-indigo-400"
        : member.is_proposal && member.is_deallocated
        ? "bg-yellow-400"
        : !member.is_proposal && !member.is_deallocated && member.user_name
        ? "bg-green-400"
        : "bg-gray-400"
    }
  `}
          >
            {member.is_deallocated && !member.is_proposal
              ? "Deallocated"
              : member.is_proposal && !member.is_deallocated
              ? "Proposing"
              : member.is_proposal && member.is_deallocated
              ? "Deallocating"
              : !member.is_proposal &&
                !member.is_deallocated &&
                member.user_name
              ? "Active"
              : "Not Assigned"}
          </Badge>
        </div>
        {!member.is_deallocated && !member.is_proposal && member.user_name ? (
          <span
            className=" hover:text-red-500 cursor-pointer "
            onClick={() => {
              setOpen(true);
              navigate(`?user_id=${member.user_id}`);
            }}
          >
            Deallocate
          </span>
        ) : null}
        {member.is_deallocated && member.is_proposal ? (
          <span
            className="cursor-pointer hover:text-red-500"
            onClick={() => {}}
          >
            Cancel Proposal
          </span>
        ) : null}
      </div>
    );
  });

  return (
    <>
      <header className="flex bg-white p-4 justify-between">
        <ProjectHeaders project_id={project_id} />
      </header>{" "}
      <div className="flex flex-row align-center justify-center">
        <Flex className="flex-col gap-4  text-slate-500 w-3/5 shadow-lg m-5 rounded-xl p-4">
          <ProjectDropdown
            selection={selection}
            setSelection={setSelection}
            values={["Active Users", "Deallocated", "Proposed", "Deallocating"]}
            values2="All Roles"
          />
          <div
            className="
          p-6 border rounded-xl
          "
          >
            {members}
          </div>
        </Flex>
      </div>
      <DeallocateUserModal open={open} setOpen={setOpen} />
    </>
  );
};

export default ProjectTeamMembers;
