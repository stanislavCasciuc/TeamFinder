import useSWR from "swr";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import { GETALLPROJECTS } from "../EndPoints";
import { Flex, Pagination } from "@mantine/core";
import CreateProjectCard from "./CreateProjectCard";
import ProjectDropdown from "./ProjectDropdown";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface ProjectData {
  id: number;
  name: string;
  period: string;
  status: string;
  end_date: string;
  start_date: string;
}

const ProjectsList = () => {
  const { auth } = useAuth();
  const accessToken = auth?.accessToken;
  const [selection, setSelection] = useState("All Projects");
  const [selectionSecond, setSelectionSecond] = useState("All Statuses");
  const [currentPage, setCurrentPage] = useState(1);
  const elementsPerPage = 7;
  const navigate = useNavigate();

  const { data: AllProjects } = useSWR(GETALLPROJECTS, (url) => {
    return axios
      .get(url, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((response) => response.data);
  });

  const indexOfLastSkill = currentPage * elementsPerPage;
  const indexOfFirstSkill = indexOfLastSkill - elementsPerPage;

  let filteredProjects =
    selection === "All Projects"
      ? AllProjects?.map((item: ProjectData) => item)
      : AllProjects?.filter((item: ProjectData) => item.period === selection);
  filteredProjects =
    selectionSecond === "All Statuses"
      ? filteredProjects?.map((item: ProjectData) => item)
      : filteredProjects?.filter(
          (item: ProjectData) => item.status === selectionSecond
        );

  const ProjectsCards = filteredProjects?.map((project: ProjectData) => {
    return (
      <Flex
        onClick={() => {
          navigate(`${project.id}`);
        }}
        direction="column"
        className="p-4 rounded-3xl shadow-md text-slate-400 hover:bg-slate-50 flex  justify-between  cursor-pointer h-60 w-60 "
      >
        <div>
          <span className="text-sm font-semibold">Status:</span>
          <div className="text-xs gap-2 flex ">
            <span>{project.status}</span>-<span>{project.period}</span>
          </div>
        </div>

        <span className="text-xl text-slate-600 font-bold hover:text-indigo-400 cursor-pointer">
          {project.name}
        </span>

        <div>
          <span className="text-sm font-semibold">Period:</span>
          <div className="text-xs gap-2 flex ">
            <span>{project.start_date}</span>-<span>{project.end_date}</span>
          </div>
        </div>
      </Flex>
    );
  });
  const dataPart = ProjectsCards?.slice(indexOfFirstSkill, indexOfLastSkill);
  let pageNumbers = 1;
  for (
    let i = 0;
    i < Math.ceil(filteredProjects?.length / elementsPerPage);
    i++
  ) {
    pageNumbers = pageNumbers + i;
  }

  return (
    <>
      <Flex>
        <ProjectDropdown
          selection={selection}
          setSelection={setSelection}
          values={["Ongoing", "Fixed"]}
          values2={"All Projects"}
        />
        <ProjectDropdown
          selection={selectionSecond}
          setSelection={setSelectionSecond}
          values={["Closed", "In Progress", "Closing", "Not Started"]}
          values2={"All Statuses"}
        />
      </Flex>
      <Flex className="p-4 flex-wrap gap-5">
        {dataPart}
        <CreateProjectCard />
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

export default ProjectsList;
