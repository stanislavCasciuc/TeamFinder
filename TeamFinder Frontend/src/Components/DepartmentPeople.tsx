import useSWR from "swr";
import useAuth from "../hooks/useAuth";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import { LoadingOverlay, Flex, List, Title } from "@mantine/core";
import { useState } from "react";
import AddMembers from "./AddMembers";

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

  const { auth } = useAuth();
  const accessToken = auth?.accessToken;
  const roles = auth?.roles;

  const [edit, setEdit] = useState(false);
  const [departmentName, setDepartmentName] = useState(department_name);
  const [addMembers,setAddMembers] = useState(false);

  const handleSubmitEdit = () => {
    setEdit(false);
    axios
      .put(
        `/department/${department_id}`,
        {
          name: departmentName,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      .then((response) => {
        console.log(response.data);
      });
  };

  const {
    data: responseData,
    error,
    isLoading,
  } = useSWR(
    `/department/users/${department_id}`,
    (url) => {
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
    return <LoadingOverlay visible={true} />;
  }
  if (error) {
    return <span className="errmsg">Error getting the list of users</span>;
  }

  const usersOfDepartment = data.map((user: UserData) => {
    if (user.username !== department_manager_name) {
      return (
        <List.Item
          className="flex align-center w-full border-b px-4 py-4"
          icon={
            <Flex className="w-10 h-10 text-indigo-600 bg-indigo-50 items-center align-center justify-center rounded-full">
              <span className="text-md font-bold">
                {user.username.substring(0, 1).toUpperCase()}
              </span>
            </Flex>
          }
          key={user.user_id} // Add a unique key for each item
        >
          <span className="text-base font-semibold text-slate-600">
            {user.username}
          </span>
        </List.Item>
      );
    }
    return null;
  });
  return (
    <>
      <List className="w-full">
        <List.Item className="align-center justify-between w-full border rounded-xl mb-4  shadow-sm px-4 py-4 text-2xl font-semibold text-slate-500">
          {edit ? (
            <form
              onSubmit={handleSubmitEdit}
              className="flex items-center space-x-4"
            >
              <input
                type="text"
                placeholder="Department Name"
                className="w p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                onChange={(e) => setDepartmentName(e.target.value)}
              />
              <button
                type="submit"
                className="bg-blue-500 text-white py-1 px-2 text-sm rounded hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
              >
                Submit
              </button>
            </form>
          ) : (
            <Title>{departmentName} Department</Title>
          )}
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
        <List.Item
          icon={
            <Flex
              className="
            w-10 h-10 text-indigo-600 bg-indigo-50 items-center align-center justify-center rounded-full"
            >
              <span className="text-md font-bold">
                {department_manager_name?.substring(0, 1).toUpperCase()}
              </span>
            </Flex>
          }
          className="flex align-center w-full border-b px-4 py-4 text-md font-semibold text-slate-800"
        >
          {department_manager_name}
        </List.Item>

        <div className="flex justify-between align-center w-full border-b px-4 py-4 text-indigo-300">
          <span className=" text-lg font-semibold"> Members</span>
          {roles?.includes("Department Manager") && <div 
          onClick={() => {setAddMembers(true)}}
          
          className="text-xs pt-2 font-base hover:text-indigo-500 cursor-pointer">
            Add members
          </div>
          }
        </div>
        {usersOfDepartment}
      </List>
        {addMembers && <AddMembers addMembers={addMembers} setAddMembers={setAddMembers} />}
    </>
  );
};

export default DepartmentPeople;
