import { Accordion, Flex, LoadingOverlay } from "@mantine/core";
import FocusTrapComponent from "./FocusTrapComponent";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import useSWR from "swr";
import { mutate } from "swr";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { IconXboxX } from "@tabler/icons-react";
import { GETALLUSERS } from "../EndPoints";

interface UserData {
  name: string;
  department_name: string;
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

  const {
    data: responseData,
    error,
    isLoading,
  } = useSWR(
   GETALLUSERS,
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
    return <LoadingOverlay visible={true} />;
  }
  if (error) {
    return <span className="errmsg">Error getting the list of users</span>;
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
          className="p-2"
          onClick={() => {
            navigate(`/Homepage/Users?user_id=${item.id}`);
          }}
          icon={
            <Flex className="w-10 h-10 text-indigo-600 bg-indigo-50 items-center align-center justify-center rounded-full">
              <span className="text-md font-bold">
                {item.name.substring(0, 1).toUpperCase()}
              </span>
            </Flex>
          }
        >
          <span className="font-semibold text-slate-600">{item.name}</span>
        </Accordion.Control>

        <Accordion.Panel className="border-t bg-white pt-2">
          <span className="font-semibold text-md">Department: </span>
          {item.department_name ? item.department_name : "Not Assigned Yet"}
        </Accordion.Panel>

        <Accordion.Panel className=" bg-white">
          <Flex direction="row" className="mt-2 gap-4  flex-wrap">
            <span className="font-semibold text-md mt-2">Roles: </span>
            {item.roles.map((role: string) => (
              <>
                <Flex
                  className=" flex border rounded-xl p-2 justify-between"
                  key={index}
                >
                  <span className="font-base text-sm">{role}</span>
                  {role !== "Employee" && (
                    <IconXboxX
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
                            alert(
                              "You can't delete the Organization Admin role"
                            );
                          });
                      }}
                      className="ml-2  cursor-pointer hover:bg-slate-200 rounded-full "
                      size={20}
                    />
                  )}
                </Flex>
              </>
            ))}

            {selectedUserId !== 0 && allRoles.length < 4 && (
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
