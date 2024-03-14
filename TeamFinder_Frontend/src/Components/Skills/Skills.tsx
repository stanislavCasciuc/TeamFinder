import { Route, Routes } from "react-router-dom";
import SkillsList from "./SkillsList";
import SkillPage from "./SkillPage";

const Skills = () => {
  return (
    <Routes>
      <Route path="" element={<SkillsList />} />
      <Route
        path=":id"
        element={<SkillPage />}
      />
    </Routes>
  );
};

export default Skills;
