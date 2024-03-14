import { Title, Flex, LoadingOverlay } from "@mantine/core";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import useSWR from "swr";
import { GETUSER } from "../EndPoints";
import { useNavigate } from "react-router-dom";

interface SkillData {
  name: string;
  id: number;
}

const ProfilePage = () => {
  const { auth } = useAuth();
  const accesToken = auth?.accessToken;
  const myId = auth?.id;
  const searchParams = new URLSearchParams(location.search);
  const user_id = searchParams.get("user_id");
  const userId = user_id ? parseInt(user_id) : 0;
  const navigate = useNavigate();

  const headers = {
    Authorization: `Bearer ${accesToken}`,
    "Content-Type": "application/json",
  };
  const {
    data: userData,
    error,
    isLoading,
  } = useSWR(GETUSER + `${userId ? userId : myId}`, (url) =>
    axios.get(url, { headers }).then((response) => response.data)
  );

  const data = userData || {};
  if (isLoading) return <LoadingOverlay visible={true} />;
  if (error) return <span className="errmsg">Error loading your data</span>;

  const name: string = data.name;

  const initials: string = name.substring(0, 1).toUpperCase();
  const skills = data.skills || { name: [] };

  return (
    <>
      <header className="flex bg-white p-4 ">
        <Flex
          className="border items-center py-3 px-7 rounded-xl shadow-sm text-slate-600"
          gap="xl"
        >
          {!userId ? (
            <div className="text-indigo-400 ">Profile</div>
          ) : (
            <div className="hover:text-indigo-400 cursor-pointer 
            "
            onClick={() => {
                navigate(-1)

            }}
            >Back</div>
          )}
        </Flex>
      </header>
      <div className="  text-slate-600 px-16 ">
        <Flex className="flex flex-row  flex-wrap align-center ">
          <div className="h-24 w-24 ml-12  bg-slate-200 rounded-full flex justify-center  items-center ">
            <span className="text-4xl font-bold text-indigo-500">
              {initials}
            </span>
          </div>
          <Title order={2} className="text-5xl pt-5 pl-6 ">
            {name.toUpperCase()}
          </Title>
        </Flex>
        <div className="p-12 pt-12 mt-10 shadow-lg rounded-xl mb-10 flex flex-row justify-between flex-wrap gap-20">
          <Flex direction="column" gap="xl">
            <span className="text-md">
              <span className="font-semibold "> Organization: </span>
              {data.organization_name}
            </span>
            <span className="text-md">
              <span className="font-semibold">Organization-Address: </span>
              {data.organization_address}
            </span>

            <div>
              <span className="font-semibold text-md "> Roles: </span>{" "}
              {data.roles.map((role: string) => (
                <span className="flex flex-col" key={role}>
                  {role}
                </span>
              ))}
            </div>
            <span className="text-md">
              <span className="font-semibold ">Email: </span>
              {data.email}{" "}
            </span>

            <span className="text-md">
              <span className="font-semibold">Current-Department:</span>{" "}
              {data.department_name ? data.department_name : "Not Assigned Yet"}
            </span>
          </Flex>

          <Flex className="border rounded-xl w-80 p-8 flex-wrap h-fit gap-x-4 gap-y-2">
            <span className="font-semibold p-2">Skills: </span>{" "}
            {skills.map((skill: SkillData) => (
              <span className="border rounded-lg p-2" key={skill.id}>
                {skill.name}
              </span>
            ))}
          </Flex>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
