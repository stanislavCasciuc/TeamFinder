import { useNavigate } from "react-router-dom";
import { Flex } from "@mantine/core";

interface ProjectHeadersProps {
  project_id: string | undefined;
}

const ProjectHeaders = ({ project_id }: ProjectHeadersProps) => {
  const navigate = useNavigate();
  return (
    <Flex
      className="border items-center py-3 px-7 rounded-xl shadow-sm text-slate-600"
      gap="xl"
    >
      <div
        onClick={() => {
          navigate(`/HomePage/Projects/${project_id}`);
        }}
        className="hover:text-indigo-400 cursor-pointer"
      >
        Project
      </div>
      <div
        onClick={() => {
          navigate(`/HomePage/Projects/${project_id}/TeamFinder`);
        }}
        className="hover:text-indigo-400 cursor-pointer"
      >
        Team Finder
      </div>
      <div
        onClick={() => {
          navigate(`/HomePage/Projects/${project_id}/TeamMembers`);
        }}
        className="hover:text-indigo-400 cursor-pointer"
      >
        Team Members
      </div>
     
    </Flex>
  );
};

export default ProjectHeaders;
