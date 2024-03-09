import useSWR, { mutate } from "swr";
import useAuth from "../../hooks/useAuth";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";
import { Flex, List, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import AddMembers from "./AddMembers";
import { EditDepartmentNameModal } from "./EditDepartmentNameModal";
import { DELETEDEPARTMENTUSER, GETDEPARTMENTUSERS, PUTEDITDEPARTMENT } from "../EndPoints";
import EditDepartmentManager from "./EditDepartmentManager";

interface UserData {
  username: string;
  user_id: number;
}
interface DepartmentData {
  department_id: string;
  department_name: string;
  department_manager_name: string;
}

const DepartmentPeople = ({
  department_name: nameParam,
  department_id: idParam,
  department_manager_name: managerParam,
}: DepartmentData) => {
  let { department_name, department_id, department_manager_name } = useParams();

  if (
    department_name === undefined ||
    department_id === undefined ||
    department_manager_name === undefined
  ) {
    department_name = nameParam;
    department_id = idParam;
    department_manager_name = managerParam;
  }
  const departmentId = parseInt(department_id);
  const { auth } = useAuth();
  const accessToken = auth?.accessToken;
  const roles = auth?.roles;
  const myId = auth?.id;

  const [edit, setEdit] = useState(false);
  const [departmentName, setDepartmentName] = useState(department_name);
  const [addMembers, setAddMembers] = useState(false);
  const [changeManager, setChangeManager] = useState(false);
  const [newManagerId, setNewManagerId] = useState(0);

  const handleSubmitEdit = () => {
    setEdit(false);
    axios
      .put(
        PUTEDITDEPARTMENT +
          (departmentName ? `?name=${departmentName}` : "") +
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
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error updating department:", error);
      });
  };

  const handleDeleteUser = (user_id: number) => {
    axios
      .delete(
        DELETEDEPARTMENTUSER + `${user_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  }

  const {
    data: responseData,
  
  } = useSWR(
    GETDEPARTMENTUSERS + `${department_id}`,
    (url) => {
      return axios
        .get(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => response.data);
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const data = responseData || [];

  useEffect(() => {
    mutate(GETDEPARTMENTUSERS + `${department_id}`);
  }, [addMembers, changeManager,edit]);

  

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
          }
          }
          className="text-xs pt-3 font-base text-slate-300 hover:text-red-500 cursor-pointer">
            Delete
          </span>
        </div>
      );
    }
    return null;
  });

  return (
    <>
      <List className="w-full">
        <List.Item className="align-center justify-between w-full border rounded-xl mb-4  shadow-sm px-4 py-4 text-2xl font-semibold text-slate-500">
          <EditDepartmentNameModal
            edit={edit}
            setEdit={setEdit}
            departmentName={departmentName}
            setDepartmentName={setDepartmentName}
            department_id={departmentId}
            handleSubmitEdit={handleSubmitEdit}
          />

          <Title>{departmentName} Department</Title>

          {roles?.includes("Organization Admin") && (
            <div className="text-sm  cursor-pointer">
              <span
                onClick={() => {
                  setEdit(!edit);
                }}
                className="hover:text-black pl-1 font-light "
              >
                Edit
              </span>
            </div>
          )}
        </List.Item>
        <List.Item className="flex align-center w-full border-b px-4 py-4 text-lg font-semibold text-indigo-300">
          Department Manager
        </List.Item>
        <div className="flex align-center justify-between w-full border-b px-4 py-4">
          <div className="flex gap-4">
            <Flex className="w-10 h-10 text-indigo-600 bg-indigo-50 items-center align-center justify-center rounded-full">
              <span className="text-md font-bold">
                {department_manager_name.substring(0, 1).toUpperCase()}
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
          data.map((user: UserData) => user.user_id).includes(myId)  &&
          (
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
  
      )}
    </>
  );
};

export default DepartmentPeople;
