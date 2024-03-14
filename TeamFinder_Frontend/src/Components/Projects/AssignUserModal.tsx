import { Modal, Slider, Textarea, Button, Select } from "@mantine/core";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/axios";
import { useParams } from "react-router-dom";
import { POSTASSIGNUSER } from "../EndPoints";
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
interface Role {
  role_name: string;
  id: number;
  role_id: number;
}

const AssignUserModal = ({ open, setOpen }: AssignUserModalProps) => {
  const [hours, setHours] = useState(1);
  const { project_id } = useParams();
  const [comment, setComment] = useState("");
  const { auth } = useAuth();
  const accessToken = auth?.accessToken;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const user_id = searchParams.get("user_id");
  const [role, setRole] = useState({ role_name: "", role_id: 0  , id:0});

  let userId = 0;
  let projectId = 0;

  if (user_id) userId = parseInt(user_id);
  if (project_id) projectId = parseInt(project_id);
  const { data: Projects } = useSWR(GETPROJECT + `/${projectId}`, (url) => {
    return axios
      .get(url, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((response) => response.data);
  });

  const projectRoles= Projects?.project_roles.map((role: TeamUserData) => role);

  const allRoles: Role[] = projectRoles?.map((role: Role) => {
    return {
      role_id: role?.role_id || 0, 
      role_name: role?.role_name || 'Default Role Name', 
        id: role?.id || 0
    };
  }) || [];
  

 const allRolesNames = allRoles.map((role: Role) => role.role_name);
  
    const handleAssign = async () => {
    axios
      .post(
        POSTASSIGNUSER +
          `?user_id=${userId}&hours_per_day=${hours}&comment=${comment}&id=${role.id}`,
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

  const hoursMarks = [
    { value: 1, label: 1 },
    { value: 2, label: 2 },
    { value: 3, label: 3 },
    { value: 4, label: 4 },
    { value: 5, label: 5 },
    { value: 6, label: 6 },
    { value: 7, label: 7 },
    { value: 8, label: 8 },
  ];

  return (
    <Modal
      opened={open}
      onClose={() => setOpen(false)}
      title="Assign User"
      size="50%"
    >
      <div className="flex flex-col gap-4  flex-wrap ">
        <label htmlFor="level">Level</label>
        <Slider
          label={null}
          onChange={setHours}
          marks={hoursMarks}
          step={1}
          min={1}
          max={8}
        />

        <label htmlFor="message" className="mt-10">
          Assignment Message
        </label>
        <Textarea
          id="message"
          placeholder="Enter a message"
          required
          radius="md"
          onChange={(e) => setComment(e.currentTarget.value)}
        />
        <Select
          required
          data={allRolesNames}
          label="Roles"
          placeholder="Roles"
          onSelect={(event) => {
            const role = event.currentTarget.value;
            const selectedRole = allRoles?.find((r: Role) => r.role_name === role);
            setRole({ role_name: role, role_id: selectedRole?.role_id || 0 , id: selectedRole?.id || 0});
          }}
          className="mb-2"
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

export default AssignUserModal;
