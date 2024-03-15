import { Flex, Button } from "@mantine/core";
import { useState } from "react";
import DepartmentPeople from "./DepartmentPeople";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import { useParams } from "react-router-dom";
import { DELETEDEPARTMENT } from "../EndPoints";
import { mutate } from "swr";
import { useNavigate } from "react-router-dom";

const SingleDepartmentPage = () => {
  const [page, setPage] = useState(1);
  const { auth } = useAuth();
  const accessToken = auth?.accessToken;

  const navigate = useNavigate();

  let {  department_id } = useParams();

  const handleDeleteDepartment = () => {
    axios
      .delete(DELETEDEPARTMENT+`${department_id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then(() => {
       mutate(DELETEDEPARTMENT);
        navigate(-1);
      });
  };


  return (
    <>
      <div className="mb-20  ">
        <header className="flex bg-white p-4 justify-between">
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
          </Flex>
          <Button
            onClick={() => handleDeleteDepartment()}
            className="hover:bg-red-500 bg-red-400 focus:outline-none text-white rounded-lg px-4 py-2 shadow-md focus:ring-2 ring-red-500 ring-offset-2"
          >
            Delete
          </Button>
        </header>

        <Flex className="justify-center ">
          <Flex
            direction="column"
            className="md:w-3/5 w-full align-center justify-center mb-20 mt-10"
          >
            {page === 1 && (
              <DepartmentPeople
             
              />
            )}
          </Flex>
        </Flex>
      </div>
    </>
  );
};

export default SingleDepartmentPage;
