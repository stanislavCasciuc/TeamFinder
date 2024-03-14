import { Flex, Title } from "@mantine/core";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import useSWR, { mutate } from "swr";
import axios from "../../api/axios";
import { IconUserQuestion } from "@tabler/icons-react";
import {
  GETMYDEPARTMENT,
  PUTEDITDEPARTMENT,
  GETDEPARTMENTUSERS,
} from "../EndPoints";
import { useNavigate } from "react-router-dom";
import { EditDepartmentNameModal } from "./EditDepartmentNameModal";
import { useDisclosure, useClickOutside } from "@mantine/hooks";
import DepartmentRequestsSidebar from "./DepartmentRequestsSidebar";

interface UserData {
  username: string;
  user_id: number;
  roles: string[];
}

const MyDepartment = () => {
  const { auth } = useAuth();
  const accessToken = auth?.accessToken;
  const navigate = useNavigate();
  const [edit, setEdit] = useState(false);
  const roles = auth?.roles;
  const newManagerId = 0;
  const [opened, { open, close }] = useDisclosure();
  const clickOutsideRef = useClickOutside(() => close());

  const { data: responseData } = useSWR(
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

  const data = responseData || [];
  console.log(data);
  const department_id = data.department_id;
  const department_name = data.department_name;
  const department_manager_name = data?.department_users?.find(
    (user: UserData) => user.roles.includes("Department Manager")
  ).username;

  const handleSubmitEdit = () => {
    setEdit(false);
    axios
      .put(
        PUTEDITDEPARTMENT +
          (departmentName ? `?name=${departmentName}` : "") +
          (department_id ? `&department_id=${department_id}` : "") +
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
  const [departmentName, setDepartmentName] = useState(department_name);

  return (
    <>
      <header className="flex bg-white p-4 justify-between">
        <Flex
          className="border items-center py-3 px-7 rounded-xl shadow-sm text-slate-600"
          gap="xl"
        >
          <div
            onClick={() =>
              navigate(
                `${department_id}/${department_name}/${department_manager_name}/DepartmentPeople`
              )
            }
            className="hover:text-indigo-400 cursor-pointer"
          >
            Users
          </div>
          <div
            onClick={() =>
              navigate(
                `${department_id}/${department_name}/${department_manager_name}/DepartmentSkills`
              )
            }
            className="hover:text-indigo-400  cursor-pointer"
          >
            Skills
          </div>
          <div className="hover:text-indigo-400  cursor-pointer">Projects</div>
        </Flex>
        <Flex
          className="border items-center p-2 px-4 rounded-2xl shadow-sm cursor-pointer hover:text-indigo-500"
          gap="xl"
          onClick={() => open()}
        >
          <IconUserQuestion size={20} />
        </Flex>
      </header>
      <Flex className="justify-center  ">
        <Flex
          direction="column"
          className="md:w-3/5 w-full align-center justify-center mb-20 mt-10"
        >
          <div className="align-center justify-between w-full border rounded-xl mb-4  shadow-sm px-4 py-4 text-2xl font-semibold text-slate-500">
            <EditDepartmentNameModal
              edit={edit}
              setEdit={setEdit}
              departmentName={departmentName || ""}
              setDepartmentName={setDepartmentName}
              department_id={department_id}
              handleSubmitEdit={handleSubmitEdit}
            />

            <Title className="text-indigo-400">
              {departmentName} Department
            </Title>

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
          </div>
        </Flex>
      </Flex>
      {opened && (
        <div ref={clickOutsideRef}>
          <DepartmentRequestsSidebar />
        </div>
      )}
    </>
  );
};

export default MyDepartment;
