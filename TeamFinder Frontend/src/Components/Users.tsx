import { Accordion, Flex } from "@mantine/core";
import useAuth from "../hooks/useAuth";
import { useState } from "react";
import useSWR from "swr";
import axios from "../api/axios";
import DropdownMenu from "./DropdownMenu";

interface UserData {
  name: string;
  department_name: string;
  roles: string[];
  id: number;
}

const Users = () => {
  const { auth } = useAuth();
  const accessToken = auth?.accessToken;
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [menuSelection, setMenuSelection] = useState("All Users");
  let allRoles: string[] = [];

  const { data: responseData, error } = useSWR("/users/all", (url) => {
    console.log("Fetching data from:", url);

    return axios
      .get(url, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((response) => response.data);
  });

  const data = responseData || [];

  if (error) {
    console.error(error);
    return <p>Error loading data</p>;
  }

  const UserRoles = data.find((user: UserData) => user.id === selectedUserId)
    ?.roles || [""];
  if (selectedUserId !== 0)
    allRoles = [UserRoles[0], ...UserRoles[1].split(" ")];
  console.log(allRoles);

  const filteredUsersAccordion =
    menuSelection === "All Users"
      ? data.map((item: UserData) => item)
      : data.filter((item: UserData) => item.roles.includes(menuSelection));

  const users = filteredUsersAccordion.map((item: UserData, index: number) => (
    <Accordion.Item
      className="align-center"
      key={item.name}
      value={`${item.name}-${index}`}
    >
      <Accordion.Control
        className="hover:bg-slate-100"
        onClick={() => {
          setSelectedUserId(item.id);
        }}
      >
        <span className="font-semibold ">{item.name.toUpperCase()}</span>
      </Accordion.Control>

      <Accordion.Panel className="border-t bg-white pt-2">
        <span className="font-semibold text-md">Department: </span>
        {item.department_name ? item.department_name : "Not Assigned Yet"}
      </Accordion.Panel>

      <Accordion.Panel className=" bg-white p-2">
        <span className="font-semibold text-md">Roles: </span>
        {item.roles.map((role: string) => (
          <span className="border rounded-xl p-2" key={role}>
            {role}
          </span>
        ))}
      </Accordion.Panel>
    </Accordion.Item>
  ));

  return (
    <div className="w-full">
      <Flex
        direction="column"
        className="w-full text-left md:px-24 md:py-12  text-slate-900  px-12 py-6  gap-10 box-shadow"
      >
        <DropdownMenu
          selection={menuSelection}
          setSelection={setMenuSelection}
        />
        <Accordion className=" rounded-xl" defaultValue={"0"}>
          {users}
        </Accordion>
      </Flex>
    </div>
  );
};

export default Users;
