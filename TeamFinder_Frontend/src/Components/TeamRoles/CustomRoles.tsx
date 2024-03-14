import { useState } from "react";
import { Flex, Button, Title, Modal, TextInput } from "@mantine/core";
import useSWR, { mutate } from "swr";
import axios from "../../api/axios";
import { GETCUSTOMROLES, POSTNEWROLE } from "../EndPoints";
import useAuth from "../../hooks/useAuth";
import { useDisclosure } from "@mantine/hooks";

interface Role {
  name: string;
  id: number | undefined;
}

const CustomRoles = () => {
  const [newRole, setNewRole] = useState("");
  const { auth } = useAuth();
  const accessToken = auth?.accessToken;
  const [selectedRole, setSelectedRole] = useState<Role>();
  const [selected, setSelected] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [openedEdit, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);

  const { data } = useSWR(GETCUSTOMROLES, (url) => {
    return axios
      .get(url, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((response) => response.data);
  });

  const handleAddRole = (newRole: string) => {
    axios
      .post(
        POSTNEWROLE + `/{name}?role=${newRole}`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      .then(() => {
        mutate(GETCUSTOMROLES);
      });
  };

  const handleRemoveRole = (roleId: number) => {
    axios.delete(POSTNEWROLE + `/${roleId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  };

  const handleEditRole = (selectedRole: Role) => {
    axios
      .put(
        POSTNEWROLE + `?id=${selectedRole.id}&name=${selectedRole.name}`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      .then(() => {
        mutate(GETCUSTOMROLES);
      });
  };

  return (
    <>
      <header className="flex bg-white p-4 ">
        <Flex className=" items-center p-4 text-slate-600" gap="xl">
          <Button
            onClick={opened ? close : open}
            className="cursor-pointer bg-indigo-400 hover:bg-indigo-500"
          >
            Add Role
          </Button>
          {selected ? (
            <Button
              onClick={() => {
                openEdit();
              }}
              className="bg-yellow-400 hover:bg-yellow-500 "
            >
              Update Role
            </Button>
          ) : null}
          {selected ? (
            <Button
              onClick={() => {
                if (selectedRole?.id) {
                  handleRemoveRole(selectedRole.id);
                  setSelectedRole(undefined);
                  setSelected(false);
                  mutate(GETCUSTOMROLES);
                }
              }}
              className="bg-red-400 hover:bg-red-500 "
            >
              Delete Role
            </Button>
          ) : null}
        </Flex>
      </header>
      <Flex className="justify-center">
        <Flex
          direction="column"
          className=" rounded-lg w-3/5 p-4 shadow-md m-20 h-80"
        >
          <Title className="text-slate-600 mb-4">Custom Roles</Title>
          <Flex direction="row" className="overflow-auto flex-wrap gap-2 p-4">
            {data?.map((role: Role) => (
              <Flex
                onClick={() => {
                  setSelectedRole(role);
                  setSelected(true);
                }}
                className={`border rounded-lg  hover:bg-slate-100 p-2 cursor-pointer  ${
                  selectedRole?.id === role.id
                    ? "bg-slate-100 hover:outline-indigo-200 outline-indigo-400 outline"
                    : ""
                }`}
                key={role.id}
              >
                {role.name}
              </Flex>
            ))}
          </Flex>
        </Flex>
      </Flex>
      <Modal
        opened={opened}
        onClose={close}
        title="Add a new role"
        size="md"
        shadow="lg"
        padding="md"
      >
        <TextInput
          onChange={(e) => setNewRole(e.currentTarget.value)}
          className="mb-5"
        />
        {newRole.length < 3 ? (
          <p className="text-red-500">Role must be at least 3 characters</p>
        ) : null}

        <Button
          onClick={() => {
            handleAddRole(newRole);
            setNewRole("");
            close();
          }}
          {...(newRole.length < 3 ? { disabled: true } : {})}
          className="bg-indigo-400 hover:bg-indigo-500"
        >
          Confirm
        </Button>
      </Modal>
      <Modal
        opened={openedEdit}
        onClose={closeEdit}
        title="Edit role"
        size="md"
        shadow="lg"
        padding="md"
      >
        <TextInput
          onChange={(e) =>
            setSelectedRole({
              id: selectedRole?.id,
              name: e.currentTarget.value,
            })
          }
          className="mb-5"
        />
        <Button
          onClick={() => {
            if (selectedRole) handleEditRole(selectedRole);
            closeEdit();
          }}
          className="bg-indigo-400 hover:bg-indigo-500"
        >
          Confirm
        </Button>
      </Modal>
    </>
  );
};

export default CustomRoles;
