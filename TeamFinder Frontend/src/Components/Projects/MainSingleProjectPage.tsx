import { Flex, Button } from "@mantine/core";
import { useParams } from "react-router-dom";
import useSWR, { mutate } from "swr";
import { GETALLPROJECTS, GETPROJECT } from "../EndPoints";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import { modals } from "@mantine/modals";
import { useNavigate } from "react-router-dom";
import ProjectHeaders from "./ProjectHeaders";
// import { useDisclosure } from "@mantine/hooks";
// import AddProjectTechnologies from "./AddProjectTechonolgies";

interface TechData {
  name: string;
  id: number;
}

const MainSingleProjectPage = () => {
  const { project_id } = useParams();
  const { auth } = useAuth();
  const accessToken = auth?.accessToken;
  const Navigate = useNavigate();
  // const [opened, { open, close }] = useDisclosure(false);

  const { data } = useSWR(GETPROJECT + `/${project_id}`, (url) => {
    return axios
      .get(url, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((response) => response.data);
  });

  const handleDeleteProject = (id: number) => {
    axios
      .delete(GETPROJECT + `/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then(() => {
        mutate(GETALLPROJECTS);
        Navigate(-1);
      });
  };

  console.log(data);

  const openModal = () =>
    modals.openConfirmModal({
      title: "Please confirm your action",
      children: (
        <span className="errms">
          Are you sure you want to delete this project? upon deletion all the
          data will be lost
        </span>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleDeleteProject(data?.id),
    });

  return (
    <>
      <header className="flex bg-white p-4 justify-between">
        <ProjectHeaders project_id={project_id} />
        {data?.project_status !== "In Progress" &&
          data?.project_status !== "Closed" &&
          data?.project_status !== "Closing" && (
            <Button
              onClick={openModal}
              className="hover:bg-red-500 bg-red-400 focus:outline-none text-white rounded-lg px-4 py-2 shadow-md focus:ring-2 ring-red-500 ring-offset-2"
            >
              Delete
            </Button>
          )}
      </header>
      <div className="flex flex-row align-center justify-center">
        <Flex className="text-slate-500 md:w-3/5 w-full flex-col mb-20 ">
          <div className="flex justify-between gap-10 w-full border rounded-lg  p-5">
            <span className="text-3xl font-bold">{data?.name}</span>
            <span className="text-md font-base text-slate-300 mt-5">
              {" "}
              {data?.project_status}
            </span>
          </div>{" "}
          <span className=" py-5 text-xl font-semibold border-b text-indigo-300">
            Project Manager
          </span>
          <div className="flex gap-4 py-5 border-b px-5">
            <Flex className="w-10 h-10 text-indigo-600 bg-indigo-50 items-center align-center justify-center rounded-full ">
              <span className="text-md font-bold">
                {data?.project_manager_name.substring(0, 1).toUpperCase()}
              </span>
            </Flex>
            <span className="py-2 font-semibold text-slate-700">
              {data?.project_manager_name}
            </span>
          </div>
          <span className=" py-5 text-xl font-semibold border-b text-indigo-300 flex justify-between">
            Technologies{" "}
            <span 
             onClick={() => {
              open();
            }}
            className=" text-xs font-base mt-3  text-slate-400 hover:text-indigo-400 cursor-pointer">
              Add Technology
            </span>
          </span>
          <span className="py-5 border-b flex flex-wrap">
            {data?.project_technologies?.map((tech: TechData) => (
              <span
                className="text-slate-500 px-5  border-r "
              >
                {tech.name}
              </span>
            ))}
          </span>
          <span className="py-5 text-xl font-semibold border-b text-indigo-300">
            Description
          </span>
          <span className="px-5 py-5 text-slate-500">{data?.description}</span>
        </Flex>
      </div>
      {/* {opened && <AddProjectTechnologies
      close={close}
      />} */}
    </>
  );
};

export default MainSingleProjectPage;
