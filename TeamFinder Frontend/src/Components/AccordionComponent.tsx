import { Accordion, Flex, Button } from "@mantine/core";
import FocusTrapComponent from "./FocusTrapComponent";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import useSWR from "swr";
import { mutate } from "swr";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

interface UserData {
  name: string;
  departament_name: string;
  roles: string[];
  id: number;
}
interface AccordionComponentProps {
  menuSelection: string;
}

export default function AccordionComponent({
  menuSelection,
}: AccordionComponentProps) {
  const { auth } = useAuth();
  const accessToken = auth?.accessToken;
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const user_id = searchParams.get("user_id");
  const selectedUserId = user_id ? parseInt(user_id) : 0;

  let allRoles: string[] = [];

  const { data: responseData, error,isLoading } = useSWR(
    "/users/all",
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

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (error) {
    console.error(error);
    return <p>Error loading data</p>;
  }

  const UserRoles = data.find((user: UserData) => user.id === selectedUserId)
    ?.roles || [""];
  if (selectedUserId !== 0) allRoles = UserRoles;

  const filteredUsersAccordion =
    menuSelection === "All Users"
      ? data.map((item: UserData) => item)
      : data.filter((item: UserData) => item.roles.includes(menuSelection));

  const users = filteredUsersAccordion
    .sort((a: UserData, b: UserData) => a.name.localeCompare(b.name))
    .map((item: UserData, index: number) => (
      <Accordion.Item
        className="align-center"
        key={item.id}
        value={`${item.name}-${index}`}
      >
        <Accordion.Control
          className="hover:bg-slate-100"
          onClick={() => {
            navigate(`/Homepage/Users?user_id=${item.id}`);
          }}
        >
          <span className="font-semibold ">{item.name.toUpperCase()}</span>
        </Accordion.Control>

        <Accordion.Panel className="border-t bg-white pt-2">
          <span className="font-semibold text-md">Department: </span>
          {item.departament_name ? item.departament_name : "Not Assigned Yet"}
        </Accordion.Panel>

        <Accordion.Panel className=" bg-white">
          <Flex direction="column" className="mt-2 gap-4  flex-wrap">
            <span className="font-semibold text-md ">Roles: </span>
            {item.roles.map((role: string) => (
              <>
                <Flex
                  className=" flex border rounded-xl p-2 justify-between"
                  key={index}
                >
                  <span className="font-semibold text-md">{role}</span>
                  {role !== "Employee" && (
                    <Button
                      onClick={() => {
                        const updatedRoles = allRoles.filter(
                          (item) => item !== role
                        );
                        axios
                          .put(
                            `http://atc-2024-quantumtrio-be-linux-web-app.azurewebsites.net/api/users/roles/update?user_id=${selectedUserId}`,
                            updatedRoles,

                            {
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${accessToken}`,
                              },
                            }
                          )
                          .then(() => {
                            mutate("/users/all");
                          })
                          .catch(() => {
                            alert("You can't delete the Organization Admin role");
                          });

                      }}
                      className="  bg-red-400 rounded-xl hover:bg-red-500  focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      Delete
                    </Button>
                  )}
                </Flex>
              </>
            ))}

            {selectedUserId !== 0 && allRoles.length<4 && (
              <FocusTrapComponent
                allRoles={allRoles}
                selectedUserId={selectedUserId}
              />
            )}
          </Flex>
        </Accordion.Panel>
      </Accordion.Item>
    ));

  return (
    <Accordion className=" rounded-xl" defaultValue={"0"}>
      {users}
    </Accordion>
  );
}
