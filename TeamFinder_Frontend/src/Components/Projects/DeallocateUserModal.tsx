import { Modal, Textarea, Button } from "@mantine/core";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/axios";
import { useParams } from "react-router-dom";
import { DEALLOCATEUSER } from "../EndPoints";
import { useLocation } from "react-router-dom";
import useSWR from "swr";
import { GETPROJECT } from "../EndPoints";

interface TeamUserData {
  name: string;
  skills: string[];
  id: number;
  projects: ProjectData[];
  is_proposal: boolean;
  is_deallocated: boolean;
  user_id: number;
}

interface ProjectData {
  project_name: string;
  hours_per_day: number;
  remaining_days: number;
  project_roles: TeamUserData[];
}

interface AssignUserModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DeallocateUserModal = ({ open, setOpen }: AssignUserModalProps) => {
  const { project_id } = useParams();
  const [comment, setComment] = useState("");
  const { auth } = useAuth();
  const accessToken = auth?.accessToken;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const user_id = searchParams.get("user_id");

  let userId = 0;
  let projectId = 0;

  if (user_id) userId = parseInt(user_id);
  if (project_id) projectId = parseInt(project_id);

  const { data: Project } = useSWR(GETPROJECT + `/${projectId}`, (url) => {
    return axios
      .get(url, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((response) => response.data);
  });

  console.log(Project);

  const projectRoles = Project?.project_roles.map((role: TeamUserData) => role);

  const hours = projectRoles?.find(
    (role: TeamUserData) => role.user_id === userId
  )?.hours_per_day;

  const role_id = projectRoles?.find(
    (role: TeamUserData) => role.user_id === userId
  )?.id;

  console.log(comment, hours, role_id, userId);

  const handleAssign = async () => {
    axios
      .post(
        DEALLOCATEUSER +
          `?user_id=${userId}&hours_per_day=${hours}&comment=${comment}&id=${role_id}`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Modal
      opened={open}
      onClose={() => setOpen(false)}
      title="Deallocate User"
      size="50%"
    >
      <div className="flex flex-col gap-4  flex-wrap ">
        <label htmlFor="message" className="mt-10">
          Deallocation message
        </label>
        <Textarea
          id="message"
          placeholder="Enter a message"
          required
          radius="md"
          onChange={(e) => setComment(e.currentTarget.value)}
        />
      </div>
      <Button
        onClick={() => {
          handleAssign();
          setOpen(false);
        }}
      >
        Assign
      </Button>
    </Modal>
  );
};

export default DeallocateUserModal;
