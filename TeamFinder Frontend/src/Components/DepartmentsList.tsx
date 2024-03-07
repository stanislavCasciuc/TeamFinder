import useSWR from "swr";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import CreateDepartmentCard from "./CreateDepartmentCard";
import { useNavigate } from "react-router-dom";
import { LoadingOverlay } from "@mantine/core";

interface DepartmentData {
  department_id: number;
  name: string;
  department_manager_name: string;
}

const DepartmentsComponent = () => {
  const { auth } = useAuth();
  const accessToken = auth?.accessToken;
  const navigate = useNavigate();

  const {
    data: responseData,
    error,
    isLoading,
  } = useSWR(
    "/department/all/",
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

  const departments = data.map((department: DepartmentData) => {
    return (
      <div
        key={department.department_id}
        onClick={() => {
          navigate(
            `${department.name}/${department.department_id}/${department.department_manager_name}`
          );
        }}
        className="border rounded-md drop-shadow-sm hover:bg-slate-100 flex justify-center items-center cursor-pointer h-48"
      >
        <span className="text-xl">{department.name}</span>
      </div>
    );
  });

  return (
    <>
      <div className="w-full h-full p-16">
        <div className="grid gap-10 grid-cols-2 md:grid-cols-4 h-full text-slate-600">
          {departments}
          <CreateDepartmentCard />
        </div>{" "}
      </div>
    </>
  );
};

export default DepartmentsComponent;
