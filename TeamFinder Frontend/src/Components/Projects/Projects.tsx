import { Route, Routes } from "react-router-dom";
import ProjectsList from "./ProjectsList";
import CreateProjectPage from "./CreateProjectPage";
import SingleProjectPage from "./MainSingleProjectPage";
import TeamFinder from "./TeamFinder";
import ProjectTeamMembers from "./ProjectTeamMembers";

const Projects = () => {
  return (
    <Routes>
      <Route path="" element={<ProjectsList />} />
      <Route path="CreateProject" element={<CreateProjectPage />} />
      <Route path=":project_id" element={<SingleProjectPage />} />
      <Route path=":project_id/TeamFinder" element={<TeamFinder/>}/>
      <Route path=":project_id/TeamMembers" element={<ProjectTeamMembers/>}/>
    </Routes>
  );
};

export default Projects;
