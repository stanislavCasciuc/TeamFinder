import useSWR, { mutate } from "swr";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/axios";
import { Flex, List, Button } from "@mantine/core";
import { useEffect, useState } from "react";
import AddMembers from "./AddMembers";

import {
  DELETEDEPARTMENTUSER,
  GETDEPARTMENTUSERS,
  PUTEDITDEPARTMENT,
  DELETEDEPARTMENT,
} from "../EndPoints";
import EditDepartmentManager from "./EditDepartmentManager";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

interface UserData {
  username: string;
  user_id: number;
}

const DepartmentPeople = ({}) => {
  let { department_name, department_id, department_manager_name } = useParams();

  const departmentId = parseInt(department_id ?? "");
  const { auth } = useAuth();
  const accessToken = auth?.accessToken;
  const roles = auth?.roles;
  const myId = auth?.id;
  const navigate = useNavigate();
  const [edit, setEdit] = useState(false);
  const [addMembers, setAddMembers] = useState(false);
  const [changeManager, setChangeManager] = useState(false);
  const [newManagerId, setNewManagerId] = useState(0);

  const handleSubmitEdit = () => {
    setEdit(false);
    axios
      .put(
        PUTEDITDEPARTMENT +
          (department_name ? `?name=${department_name}` : "") +
          (departmentId ? `&department_id=${departmentId}` : "") +
          (newManagerId ? `&department_manager=${newManagerId}` : ""),
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then(() => {
        mutate(GETDEPARTMENTUSERS + `${department_id}`);
      })
      .catch((error) => {
        console.error("Error updating department:", error);
      });
  };

  const handleDeleteDepartment = () => {
    axios
      .delete(DELETEDEPARTMENT + `${department_id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then(() => {
        mutate(DELETEDEPARTMENT);
        navigate(-1);
      });
  };

  const handleDeleteUser = (user_id: number) => {
    axios
      .delete(DELETEDEPARTMENTUSER + `${user_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(() => {
        mutate(GETDEPARTMENTUSERS + `${department_id}`);
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  const {
    data: responseData,
   
  } = useSWR(GETDEPARTMENTUSERS + `${department_id}`, (url) => {
    return axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => response.data);
  });

  // if(isLoading) return <div>Loading...</div>;
  // if(error) return <div>Error loading data</div>;
  const data = responseData || [];

  useEffect(() => {
    mutate(GETDEPARTMENTUSERS + `${department_id}`);
  }, [addMembers, changeManager, edit]);

  const usersOfDepartment = data.map((user: UserData) => {
    if (user.username !== department_manager_name) {
      return (
        <div
          className="flex align-center justify-between w-full border-b px-4 py-4"
          key={user.user_id}
        >
          <div className="flex gap-4">
            <Flex className="w-10 h-10 text-indigo-600 bg-indigo-50 items-center align-center justify-center rounded-full">
              <span className="text-md font-bold">
                {user.username.substring(0, 1).toUpperCase()}
              </span>
            </Flex>
            <span className="py-2 font-semibold text-slate-700">
              {user.username}
            </span>
          </div>
          <span
            onClick={() => {
              handleDeleteUser(user.user_id);
              mutate(GETDEPARTMENTUSERS + `${department_id}`);
            }}
            className="text-xs pt-3 font-base text-slate-300 hover:text-red-500 cursor-pointer"
          >
            Delete
          </span>
        </div>
      );
    }
    return null;
  });

  return (
    <>
      <header className="flex bg-white p-4 justify-between">
        <Flex
          className="border items-center py-3 px-7 rounded-xl shadow-sm text-slate-600 cursor-pointer hover:text-indigo-500"
          gap="xl"
          onClick={()=>navigate(-1)}
        >
          <div className="hover:text-indigo-400 cursor-pointer">Back</div>
        </Flex>
        <Button
          onClick={() => handleDeleteDepartment()}
          className="hover:bg-red-500 bg-red-400 focus:outline-none text-white rounded-lg px-4 py-2 shadow-md focus:ring-2 ring-red-500 ring-offset-2"
        >
          Delete
        </Button>
      </header>

      <Flex className="justify-center">
        <Flex
          direction="column"
          className="md:w-3/5 w-full align-center justify-center mb-20 "
        >
          <List className="w-full">
            
            <List.Item className="flex align-center w-full border-b px-4 py-4 text-lg font-semibold text-indigo-300">
              Department Manager
            </List.Item>
            <div className="flex align-center justify-between w-full border-b px-4 py-4">
              <div className="flex gap-4">
                <Flex className="w-10 h-10 text-indigo-600 bg-indigo-50 items-center align-center justify-center rounded-full">
                  <span className="text-md font-bold">
                    {department_manager_name?.substring(0, 1).toUpperCase() ??
                      ""}
                  </span>
                </Flex>
                <span className="py-2 font-semibold text-slate-700">
                  {department_manager_name}
                </span>
              </div>
              <span
                onClick={() => {
                  setChangeManager(true);
                }}
                className="text-xs pt-3 font-base text-slate-300 hover:text-indigo-500 cursor-pointer"
              >
                Change
              </span>
            </div>
            <EditDepartmentManager
              department_id={departmentId}
              changeManager={changeManager}
              setChangeManager={setChangeManager}
              handleSubmitEdit={handleSubmitEdit}
              setNewManagerId={setNewManagerId}
            />
            <div className="flex justify-between align-center w-full border-b px-4 py-4 text-indigo-300">
              <span className=" text-lg font-semibold"> Members</span>
              {roles?.includes("Department Manager") &&
                data.map((user: UserData) => user.user_id).includes(myId) && (
                  <div
                    onClick={() => {
                      setAddMembers(true);
                    }}
                    className="text-xs pt-2 font-base hover:text-indigo-500 cursor-pointer"
                  >
                    Add members
                  </div>
                )}
            </div>
            {usersOfDepartment}
          </List>
          {addMembers && (
            <AddMembers addMembers={addMembers} setAddMembers={setAddMembers} />
          )}{" "}
        </Flex>
      </Flex>
    </>
  );
};

export default DepartmentPeople;
