import useAuth from "../../hooks/useAuth";
import {
  Flex,
  Button,
  TextInput,
  Select,
  Textarea,
  Fieldset,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import useSWR from "swr";
import { GETCUSTOMROLES, POSTNEWPROJECT } from "../EndPoints";
import { useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";

interface Role {
  name: string;
  id: number;
}

const CreateProjectPage = () => {
  const { auth } = useAuth();
  const accessToken = auth?.accessToken;
  const [newName, setNewName] = useState("");
  const [value, setValue] = useState<Date | null>(null);
  const [endValue, setEndValue] = useState<Date | null>(null);
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [technology, setTechnology] = useState<string>("");
  const [customRoles, setCustomRoles] = useState<Role[]>([]);
  const [role, setRole] = useState<Role>({ name: "", id: 0 });
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const { data } = useSWR(GETCUSTOMROLES, (url) => {
    return axios
      .get(url, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((response) => response.data);
  });

  const HandleCreateProject = () => {
    return axios
      .post(
        POSTNEWPROJECT,
        {
          name: newName,
          description: description,
          project_status: status,
          start_date: value?.toISOString().split("T")[0] || "",
          end_date: endValue?.toISOString().split("T")[0] || "",
          project_technologies: technologies,
          project_roles: customRoles.map((role) => role.id),
        },

        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      .then(() => {
        // mutate(GETCUSTOMROLES);
      });
  };

  const rolesName: string[] = data?.map((role: Role) => role.name) || [];
  const uniqueRolesName: string[] = [...new Set(rolesName)];

  const technologiesList = technologies?.map((technology) => {
    return (
      <li key={technology} className="flex flex-row">
        <span className="text-sm p-2 border rounded-lg mt-2">{technology}</span>
      </li>
    );
  });

  const teamRoles = (
    <Fieldset legend="Technologies">
      <Flex className="flex-wrap">
        <TextInput
          required
          placeholder="New technology"
          value={technology}
          onChange={(event) => setTechnology(event.currentTarget.value)}
        />

        {technology && (
          <Button
            variant="light"
            onClick={() => {
              setTechnologies([...technologies, technology]);
              setTechnology("");
            }}
          >
            Add
          </Button>
        )}
      </Flex>

      <ul className="flex flex-row gap-2 flex-wrap">{technologiesList}</ul>
    </Fieldset>
  );

  return (
    <div className="p-10">
      <div className=" grid md:grid-cols-3 gap-10 grid-cols-1">
        <div className="flex flex-col gap-4">
          <TextInput
            required
            label="Project Name"
            placeholder="Project Name"
            onChange={(event) => setNewName(event.currentTarget.value)}
          />
          <Select
            required
            data={[
              { value: "Fixed", label: "Fixed" },
              { value: "Ongoing", label: "Ongoing" },
            ]}
            onSelect={(event) => {
              setStatus(event.currentTarget.value);
            }}
            label="Status"
            placeholder="Status"
          />

          <div className="flex gap-5">
            {" "}
            <DateInput
              required
              value={value}
              onChange={setValue}
              valueFormat="YYYY MMM DD"
              label="Start Date"
              placeholder="Start Date"
            />
            {status === "Fixed" && (
              <DateInput
                required
                value={endValue}
                onChange={setEndValue}
                valueFormat="YYYY MMM DD"
                label="End Date"
                placeholder="End Date"
              />
            )}
          </div>
          {teamRoles}
        </div>

        <div className="col-span-2 p">
          <Textarea
            required
            label="Description"
            placeholder="Project Description"
            onChange={(event) => setDescription(event.currentTarget.value)}
            rows={8}
          />
          <Fieldset legend="Roles">
            <Flex>
              <Select
                required
                data={uniqueRolesName}
                label="Roles"
                placeholder="Roles"
                onSelect={(event) => {
                  const role = event.currentTarget.value;
                  const selectedRole = data?.find((r: Role) => r.name === role);
                  setRole({ name: role, id: selectedRole?.id || 0 });
                }}
                className="mb-2"
              />
            {role.name !== "" && role.id !== 0 && (
              <Button
                className="mt-6"
                variant="light"
                onClick={() => {
                  setCustomRoles([...customRoles, role]);
                  setRole({ name: "", id: 0 });
                }}
              >
                Add Role
              </Button>
            )}
            </Flex>
            <Flex className="gap-2 flex-wrap">
              {customRoles.map((role) => (
                <span className="border p-2 rounded-lg text-sm">
                  {role.name}
                </span>
              ))}
            </Flex>
          </Fieldset>
        </div>
      </div>{" "}
      {newName !== null &&
        description !== null &&
        status !== null &&
        value !== null && (
          <Button
            onClick={() => {
              HandleCreateProject();
              navigate(-1);
            }}
            className="mt-10 bg-indigo-400 hover:bg-indigo-500"
          >
            Create Project
          </Button>
        )}
    </div>
  );
};

export default CreateProjectPage;
