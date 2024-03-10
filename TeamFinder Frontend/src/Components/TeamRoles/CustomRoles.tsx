import { useState } from "react";
import { Flex } from "@mantine/core";
import useSWR, { mutate } from "swr";
import axios from "../../api/axios";
import { GETCUSTOMROLES, POSTNEWROLE } from "../EndPoints";
import useAuth from "../../hooks/useAuth";

interface Role
{
  name: string;
  id: number;
}

const CustomRoles = () => {
  const [newRole, setNewRole] = useState("");
  const { auth } = useAuth();
  const accessToken = auth?.accessToken;

    const { data } = useSWR(GETCUSTOMROLES, (url) => {
        return axios
        .get(url, { headers: { Authorization: `Bearer ${accessToken}` } })
        .then((response) => response.data);
    });

  const handleAddRole = (newRole: string) => {
    axios.post(POSTNEWROLE + `{name}?role=${newRole}`, {},{
      headers: { Authorization: `Bearer ${accessToken}` },
    }).then(() => {
        mutate(GETCUSTOMROLES);
        }
    
    )
  };

    // const handleRemoveRole = (role: string) => {
    //     axios.delete(POSTNEWROLE + `/${role}`, {
    //     headers: { Authorization: `Bearer ${accessToken}` },
    //     });
    // };


  return (
    <>
      <header className="flex bg-white p-4 ">
        <Flex
          className="border items-center py-3 px-7 rounded-xl shadow-sm text-slate-600"
          gap="xl"
        >
          <div className="hover:text-indigo-400 cursor-pointer">
            Custom Roles
          </div>
        </Flex>
      </header>

      <div className="flex flex-col items-center">
        <div className="flex flex-col gap-4">
          <input
            type="text"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="border rounded-lg p-2"
          />
          <button
            onClick={() => handleAddRole(newRole)}
            className="border rounded-xl p-2  bg-indigo-500 text-white"
          >
            Add Role
          </button>
        </div>
        <div className="flex flex-col gap-4 mt-4 w-3/5 border p-4 rounded-lg">
          {data?.map((role:Role) => (
            <div
              key={role.id}
              className="flex justify-between items-center border rounded-lg p-2"
            >
              {role.name}
              <button
                // onClick={() => handleRemoveRole(role)}
                className="text-slate-200 hover:indigo-400 cursor-pointer bg-red-500 rounded-lg p-2 font-semibold hover:bg-red"
              >
                edit
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CustomRoles;
