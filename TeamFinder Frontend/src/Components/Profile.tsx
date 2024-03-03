import { Title, Flex } from "@mantine/core";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";

const ProfilePage = () => {
  const [data, setData] = useState({
    name: "",
    organization_name: "",
    organization_address: "",
    roles: [""],
    email: "",
  });
  const { auth } = useAuth();

  const accesToken = auth?.accessToken;

  const headers = {
    Authorization: `Bearer ${accesToken}`,
    "Content-Type": "application/json",
  };
  useEffect(() => {
    axios
      .get("/users/me", { headers })
      .then((response) => {
        setData(response.data);

        console.log(response.data);
      })
      .catch((error) => {
        // Handle errors
        console.error(error);
      });
  }, [accesToken]);

  const name: string = data.name;
  const initials: string = name.substring(0, 1).toUpperCase();

  return (
    <>
      <div className="m-0 md:px-24 md:py-12  text-slate-900  px-12 py-6 w-full">
        <Title order={1} className="text-3xl border-b-2 pb-6">
          Profile
        </Title>
        <Flex className="flex flex-row  items-center flex-wrap gap-8  md:justify-between md:pt-12">
          <Flex className="gap-10" wrap="wrap">
            <div className="h-40 w-40 mt-14 bg-gray-200 rounded-full flex justify-center  items-center ">
              <span className="text-4xl font-bold">{initials}</span>
            </div>
            <div>
              <Title order={2} className="text-4xl mb-8 ">
                {name.toUpperCase()}
              </Title>
              <Flex direction="column" gap="md">
                <span className="text-md">
                  <span className="font-semibold text-lg"> Organization: </span>
                  {data.organization_name}
                </span>
                <span className="text-md">
                  <span className="font-semibold text-lg">
                    Organization-Address:{" "}
                  </span>
                  {data.organization_address}
                </span>

                <span className="text-md">
                  <span className="font-semibold text-lg"> Roles: </span>{" "}
                  {data.roles.map((role: string) => (
                    <span key={role}>{role}</span>
                  ))}{" "}
                </span>

                <span className="text-md">
                  <span className="font-semibold text-lg">Email: </span>
                  {data.email}{" "}
                </span>

                <span className="text-md">
                  <span className="font-semibold text-lg">
                    {" "}
                    Current-Department:{" "}
                  </span>{" "}
                </span>
              </Flex>
            </div>
          </Flex>

          <div>
            <Flex
              direction="column"
              wrap="wrap"
              className="text-left md:max-w-60 min-w-44 border-2 border-gray-200 p-4 rounded-lg md:mr-20"
            >
              <Title order={2} className="text-3xl mb-8 ">
                Skills
              </Title>

              <Flex className="gap-2" wrap="wrap">
                <span className="border-2 border-gray-200 p-1 rounded-lg ">
                  React
                </span>
                <span className="border-2 border-gray-200 p-1 rounded-lg ">
                  React
                </span>
                <span className="border-2 border-gray-200 p-1 rounded-lg ">
                  Javascript
                </span>
                <span className="border-2 border-gray-200 p-1 rounded-lg ">
                  React
                </span>
                <span className="border-2 border-gray-200 p-1 rounded-lg ">
                  FastApi
                </span>
              </Flex>
            </Flex>
          </div>
        </Flex>
      </div>
    </>
  );
};

export default ProfilePage;
