import { Flex, LoadingOverlay } from "@mantine/core";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import useSWR from "swr";
import axios from "../../api/axios";
import DepartmentPeople from "./DepartmentPeople";
import { GETMYDEPARTMENT } from "../EndPoints";

interface UserData {
  username: string;
  user_id: number;
  roles: string[];
}

const SingleDepartmentPage = () => {
  const [page, setPage] = useState(1);
  const { auth } = useAuth();
  const accessToken = auth?.accessToken;

  const {
    data: responseData,
    error,
    isLoading,
  } = useSWR(
    GETMYDEPARTMENT,
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
  if (isLoading) {
    return <LoadingOverlay visible={true} />;
  }
  if (error) {
    return <span className="errmsg">Error getting the department</span>;
  }

  const data = responseData || [];
  console.log(data);
  const department_id = data.department_id;
  const department_name = data.department_name;
  const department_manager_name = data.department_users.find((user: UserData) =>
    user.roles.includes("Department Manager")
  ).username;

  return (
    <>
      <header className="flex bg-white p-4 ">
        <Flex
          className="border items-center py-3 px-7 rounded-xl shadow-sm text-slate-600"
          gap="xl"
        >
          <div
            onClick={() => setPage(1)}
            className="hover:text-indigo-400 cursor-pointer"
          >
            Users
          </div>
          <div
            onClick={() => setPage(2)}
            className="hover:text-indigo-400  cursor-pointer"
          >
            Skills
          </div>
          <div
            onClick={() => setPage(3)}
            className="hover:text-indigo-400  cursor-pointer"
          >
            Projects
          </div>
        </Flex>
      </header>
      <Flex className="justify-center  ">
        <Flex
          direction="column"
          className="md:w-3/5 w-full align-center justify-center mb-20 mt-10"
        >
          {page === 1 && (
            <DepartmentPeople
              department_id={department_id}
              department_manager_name={department_manager_name}
              department_name={department_name}
            />
          )}
   
        </Flex>
      </Flex>
    </>
  );
};

export default SingleDepartmentPage;
