import { useDisclosure } from "@mantine/hooks";
import { Modal, List, Button, TextInput } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import useSWR from "swr";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import { mutate } from "swr";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useState } from "react";

interface UserData {
  name: string;
  departament_name: string;
  roles: string[];
  id: number;
}

const CreateDepartmentCard = () => {
  const { auth } = useAuth();
  const accessToken = auth?.accessToken;
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const user_id = searchParams.get("user_id");
  const selectedUserId = user_id ? parseInt(user_id) : 0;
  const [opened, { open, close }] = useDisclosure(false);
  const [value, setValue] = useState("");

  const {
    data: responseData,
    error,
    isLoading,
  } = useSWR(
    "/users/all",
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

  const data = responseData || [];

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (error) {
    console.error(error);
    return <p>Error loading data</p>;
  }

  const filteredUsers: UserData[] = data.filter((user: UserData) =>
    user.roles.includes("Department Manager")
  );

  const DepartmentManagers = filteredUsers.map((user: UserData) => {
    return (
      <List.Item
        className={
          selectedUserId === user.id
            ? "bg-slate-100 cursor-pointer p-2 rounded-lg last-of-type:border-b-0 focus:shadow-outline-purple focus:outline-0 focus:bg-slate-100 0 focus:text-slate-900 focus:dark:text-slate-300 disabled:text-slate-400 disabled:hover:text-slate-400 "
            : "cursor-pointer p-2 rounded-lg last-of-type:border-b-0 focus:shadow-outline-purple focus:outline-0 focus:bg-slate-100 0 focus:text-slate-900 focus:dark:text-slate-300 disabled:text-slate-400 disabled:hover:text-slate-400"
        }
        key={user.id}
        onClick={() => {
          navigate(`/Homepage/Departments?user_id=${user.id}`);
        }}
      >
        {user.name}
      </List.Item>
    );
  });

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Choose one Department Manager"
        centered
      >
        <div className="flex flex-col gap-3">
          <TextInput
            label="Department Name"
            value={value}
            onChange={(event) => setValue(event.currentTarget.value)}
          />
          <List className="p-2 border-2 rounded-xl">{DepartmentManagers}</List>
          <Button
            onClick={() => {
              axios
                .post(
                  `https://atc-2024-quantumtrio-be-linux-web-app.azurewebsites.net/api/department/create/?departament_name=${value}&departament_manager=${selectedUserId}`,
                  value,
                  {
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${accessToken}`,
                    },
                  }
                )
                .then(() => {
                  close();
                  mutate("/department/all/");
                });
            }}
            className="bg-indigo-500 hover:bg-indigo-600 rounded-xl w-40  "
          >
            Confirm
          </Button>
        </div>
      </Modal>

      <div
        onClick={open}
        className="border rounded-xl drop-shadow-sm hover:bg-slate-100 flex align-center justify-center pt-14 cursor-pointer"
      >
        <IconPlus size={32} />
      </div>
    </>
  );
};
export default CreateDepartmentCard;
