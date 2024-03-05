import useSWR from "swr";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import CreateDepartmentCard from "./CreateDepartmentCard";
import { useNavigate } from "react-router-dom";

interface DepartmentData {
  id: number;
  name: string;
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

  const departments = data.map((department: DepartmentData) => {
    return (
      <div
        key={department.id}
        onClick={() => {
          navigate(`${department.name}/${department.id}`);
        }}
        className="border rounded-xl drop-shadow-sm hover:bg-slate-100 p-10"
      >
        <span className="text-xl">{department.name}</span>
      </div>
    );
  });

  return (
    <>
      <div className="w-full h-full p-16">
        <div className="grid grid-rows-3 gap-10  grid-cols-2 md:grid-cols-4 h-full ">
          {departments}
          <CreateDepartmentCard />
        </div>{" "}
      </div>
    </>
  );
};

export default DepartmentsComponent;
