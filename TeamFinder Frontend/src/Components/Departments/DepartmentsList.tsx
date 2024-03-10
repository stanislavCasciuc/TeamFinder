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
        className="border  rounded-3xl shadow-md hover:bg-slate-50 flex justify-center items-center cursor-pointer h-48"
      >
        <span className="text-xl">{department.name}</span>
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
      <div className="grid gap-10 grid-cols-2 md:grid-cols-4 px-16 py-4 h-full text-slate-600">
        {departments}
        <CreateDepartmentCard />
      </div>
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
