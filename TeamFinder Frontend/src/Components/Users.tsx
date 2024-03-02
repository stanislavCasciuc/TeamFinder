import { Accordion, Flex } from "@mantine/core";
import useAuth from "../hooks/useAuth";
import { useState } from "react";
import { Dropdown } from "@mui/base/Dropdown";
import { MenuButton } from "@mui/base/MenuButton";
import { Menu } from "@mui/base/Menu";
import { MenuItem } from "@mui/base/MenuItem";
import useSWR from "swr";
import axios from "../api/axios";
import Modal from "./ModalComponent";

interface UserData {
  name: string;
  department: string;
  role: string;
  id: number;
}

const Users = () => {
  const { auth } = useAuth();
  const accessToken = auth?.accessToken;
  const [role, setRole] = useState("Employee");
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [selection, setSelection] = useState("All Users");

  const [allRoles, setAllRoles] = useState([{ id: 0, roles: ["employee"] }]);

  const roles = (
    <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
      <option value="project_manager">Project_Manager</option>
      <option value="department_manager">Department_Manager</option>
      <option value="organization_admin">Organization_Admin</option>
    </select>
  );

  const handleSubmitModal = async () => {
    try {

      setAllRoles((prevRoles) => [
        ...prevRoles,
        { id: selectedUserId, roles: [...prevRoles[selectedUserId]?.roles, role] },
      ]);

      const result = await axios.post(
        "/users/role",
        JSON.stringify({ roles: allRoles, id: selectedUserId }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Role Added:", result.data);

    } catch (error) {
      console.error("Role Adding error:", error);
    }
  };

  const { data: responseData, error } = useSWR("/users/all", (url) =>
    axios
      .get(url, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((response) => response.data)
  );

  const data = responseData || [];
  

  if (error) {
    console.error(error);
    return <p>Error loading data</p>;
  }

  const filteredData =
    selection === "All Users"
      ? data.filter((item: UserData) => item.role === "employee")
      : data.filter(
          (item: UserData) =>
            item.role === selection.toLowerCase().replace(" ", "_")
        );

  const createHandleMenuClick = (menuItem: string) => {
    return () => {
      setSelection(menuItem);
    };
  };

  const users = filteredData.map((item: UserData, index: number) => (
    <Accordion.Item key={item.name} value={`${item.name}-${index}`}>
      <Accordion.Control
        className="hover:bg-slate-100"
        onClick={() => {
          setSelectedUserId(item.id);
        }}
      >
        <span className="font-semibold ">{item.name.toUpperCase()}</span>
      </Accordion.Control>

      <Accordion.Panel className="border-t bg-white">
        <span className="font-semibold text-md">Department: </span>
        {item.department ? item.department : "Not Assigned Yet"}
      </Accordion.Panel>

      <Modal
        content={roles}
        title="Choose one role to add"
        value="Add Role"
        handleSubmitModal={handleSubmitModal}
      />
    </Accordion.Item>
  ));

  return (
    <div className="w-full">
      <Flex
        direction="column"
        className="w-full text-left md:px-24 md:py-12  text-slate-900  px-12 py-6  gap-10 box-shadow"
      >
        <Dropdown>
          <MenuButton className="w-fit cursor-pointer text-sm font-sans box-border rounded-lg font-semibold px-4 py-2 bg-white border border-solid border-slate-200  text-slate-900 hover:bg-slate-50  hover:border-slate-300  focus-visible:shadow-[0_0_0_4px_#ddd6fe]  focus-visible:outline-none shadow-sm active:shadow-none">
            <span className="text-lg">{selection}</span>
          </MenuButton>
          <Menu className="text-sm box-border font-sans p-1.5 my-3 mx-0 rounded-xl overflow-auto outline-0 bg-white dark:bg-slate-900 border border-solid border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-300 min-w-listbox shadow-md dark:shadow-slate-900">
            <MenuItem
              className="list-none p-2 rounded-lg cursor-default select-none last-of-type:border-b-0 focus:shadow-outline-purple focus:outline-0 focus:bg-slate-100 0 focus:text-slate-900 focus:dark:text-slate-300 disabled:text-slate-400 disabled:hover:text-slate-400"
              onClick={createHandleMenuClick("All Users")}
            >
              All Users
            </MenuItem>
            <MenuItem
              onClick={createHandleMenuClick("Organization Admin")}
              className="list-none p-2 rounded-lg cursor-default select-none last-of-type:border-b-0 focus:shadow-outline-purple focus:outline-0 focus:bg-slate-100 0 focus:text-slate-900 focus:dark:text-slate-300 disabled:text-slate-400 disabled:hover:text-slate-400"
            >
              Organization Admins
            </MenuItem>
            <MenuItem
              className="list-none p-2 rounded-lg cursor-default select-none last-of-type:border-b-0 focus:shadow-outline-purple focus:outline-0 focus:bg-slate-100 0 focus:text-slate-900 focus:dark:text-slate-300 disabled:text-slate-400 disabled:hover:text-slate-400"
              onClick={createHandleMenuClick("Department Manager")}
            >
              Department Managers
            </MenuItem>
            <MenuItem
              className="list-none p-2 rounded-lg cursor-default select-none last-of-type:border-b-0 focus:shadow-outline-purple focus:outline-0 focus:bg-slate-100 0 focus:text-slate-900 focus:dark:text-slate-300 disabled:text-slate-400 disabled:hover:text-slate-400"
              onClick={createHandleMenuClick("Project Manager")}
            >
              Project Managers
            </MenuItem>
          </Menu>
        </Dropdown>
        <Accordion
          className="border rounded-xl"
          defaultValue={`${filteredData[0]?.name}-0`}
        >
          {users}
        </Accordion>
      </Flex>
    </div>
  );
};

export default Users;
