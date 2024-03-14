import { Route, Routes } from "react-router-dom";
import MyDepartment from "./MyDepartment";
import DepartmentSkills from "./DepartmentSkills";
import DepartmentPeople from "./DepartmentPeople";


const MyDepartmentRoutes = () => {
  return (
    <Routes>
      <Route path="" element={<MyDepartment />} />
      <Route path=":department_id/:department_name/:department_manager_name/DepartmentPeople" element={<DepartmentPeople/>}/>
      <Route path=":department_id/:department_name/:department_manager_name/DepartmentSkills" element={<DepartmentSkills/>}/>
    </Routes>
  );
};

export default MyDepartmentRoutes;
