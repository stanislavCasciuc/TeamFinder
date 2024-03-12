import useSWR from "swr";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import CreateDepartmentCard from "./CreateDepartmentCard";
import { useNavigate } from "react-router-dom";
import { LoadingOverlay, Pagination } from "@mantine/core";
import { Flex } from "@mantine/core";
import { GETALLDEPARTMENTS } from "../EndPoints";
import { useState } from "react";

interface DepartmentData {
  department_id: number;
  name: string;
  department_manager_name: string;
}

const DepartmentsComponent = () => {
  const { auth } = useAuth();
  const accessToken = auth?.accessToken;
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const elementsPerPage = 7;

  const {
    data: responseData,
    error,
    isLoading,
  } = useSWR(
    GETALLDEPARTMENTS,
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
    return <span className="errmsg">Error getting the departments</span>;
  }

  const indexOfLastSkill = currentPage * elementsPerPage;
  const indexOfFirstSkill = indexOfLastSkill - elementsPerPage;
  const dataPart = data.slice(indexOfFirstSkill, indexOfLastSkill);

  let pageNumbers = 1;
  for (let i = 0; i < Math.ceil(data.length / elementsPerPage); i++) {
    pageNumbers = pageNumbers + i;
  }

  const departments = dataPart.map((department: DepartmentData) => {
    return (
      <div
        key={department.department_id}
        onClick={() => {
          navigate(
            `${department.name}/${department.department_id}/${department.department_manager_name}`
          );
        }}
        className="flex-col p-4 rounded-3xl shadow-md text-slate-600 hover:bg-slate-50 flex  justify-between  cursor-pointer h-60 w-60"
      >
        <span className="text-xl font-bold">{department.name}</span>

        <div>
          <span className="text-sm font-semibold">Manager:</span>
          <div className="text-xs gap-2 flex ">
            <span>{department.department_manager_name}</span>
          </div>
        </div>
      </div>
    );
  });

  return (
    <>
      <header className="flex bg-white p-4 ">
        <Flex
          className="border items-center py-3 px-7 rounded-xl shadow-sm text-slate-600"
          gap="xl"
        >
          <div>All Departments</div>
        </Flex>
      </header>
      <Flex className="p-4 flex-wrap gap-5">
        {departments}
        <CreateDepartmentCard />
      </Flex>
      <Pagination
        className="mt-4 ml-20 mb-20 text-slate-500"
        total={pageNumbers}
        value={currentPage}
        onChange={setCurrentPage}
      />
    </>
  );
};

export default DepartmentsComponent;
