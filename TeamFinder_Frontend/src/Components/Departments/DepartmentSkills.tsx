import useSWR, { mutate } from "swr";
import useAuth from "../../hooks/useAuth";
import {
  ASSIGNSKILLTODEPARTMENT,
  DELETEDEPARTMENTSKILL,
  GETMYDEPARTMENTSKILLS,
  GETSKILLS,
} from "../EndPoints";
import axios from "../../api/axios";
import { Flex, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SkillData {
  id: number;
  name: string;
  description: string;
  author_name: string;
  category: string;
  department_id: number;
}

const DepartmentSkills = () => {
  const { auth } = useAuth();
  const accessToken = auth?.accessToken;
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedSkill, setSelectedSkill] = useState<SkillData>(
    {} as SkillData
  );
  const navigate = useNavigate();
  const { data } = useSWR(GETMYDEPARTMENTSKILLS, (url) => {
    return axios
      .get(url, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((response) => response.data);
  });

  const { data: skillsData } = useSWR(GETSKILLS, (url) => {
    return axios
      .get(url, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((response) => response.data);
  });

  const handleAssignSkill = (selectedSkill: SkillData) => {
    axios
      .post(
        ASSIGNSKILLTODEPARTMENT + `/${selectedSkill.id}`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      .then(() => {
        close();
        mutate(GETMYDEPARTMENTSKILLS);
      });
  };

  const handleDeleteSkill = (selectedSkill: SkillData) => {
    axios
      .delete(DELETEDEPARTMENTSKILL + `/${selectedSkill.id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then(() => {
        mutate(GETMYDEPARTMENTSKILLS);
        setSelectedSkill({} as SkillData);
      })
      .catch(() => {
        alert("Please select a skill to delete");
      });
  };

  const departmentSkills = data || [];
  const filteredSkills = skillsData?.filter(
    (skill: SkillData) =>
      !departmentSkills.some(
        (deptSkill: SkillData) => deptSkill.id === skill.id
      )
  );

  const allSkills = filteredSkills?.map((skill: SkillData) => (
    <span
      className={`border rounded-lg hover:bg-slate-100 p-2 cursor-pointer ${
        selectedSkill?.id === skill.id
          ? "bg-slate-100 hover:outline-indigo-200 mt-2 outline-indigo-400 outline"
          : ""
      }`}
      key={skill.id}
      onClick={() => setSelectedSkill(skill)}
    >
      {skill.name}
    </span>
  ));
  return (
    <>
      <header className="flex bg-white p-4 justify-between">
        <Flex
          className="border items-center py-3 px-7 rounded-xl shadow-sm text-slate-600 cursor-pointer hover:text-indigo-500"
          gap="xl"
          onClick={() => navigate(-1)}
        >
          <div className="hover:text-indigo-400 cursor-pointer">Back</div>
        </Flex>
      </header>
      <div className="w-full flex justify-center align-center mb-20">
        <Flex direction="column" gap="xl" className="text-slate-600 w-3/5">
          <Flex
            direction="column"
            gap="md"
            className=" p-4 shadow-md rounded-xl flex-wrap"
          >
            <div className="flex flex-wrap gap-4">
              {departmentSkills.map((skill: SkillData) => (
                <div
                  key={skill.id}
                  onClick={() => setSelectedSkill(skill)}
                  className={`border rounded-lg hover:bg-slate-100 p-2 cursor-pointer  ${
                    selectedSkill?.id === skill.id
                      ? "bg-slate-100 hover:outline-indigo-200 outline-indigo-400 outline"
                      : ""
                  }`}
                >
                  <h2 className="text-xl font-bold ">{skill.name}</h2>
                  <p className="text-slate-600 bg-slate-100">
                    {skill.category}
                  </p>
                </div>
              ))}
            </div>
            <Flex gap="md">
              <Button
                onClick={() => open()}
                className="text-xs mt-5 font-bold bg-indigo-400 "
              >
                Assign Skill
              </Button>
              <Button
                onClick={() => handleDeleteSkill(selectedSkill)}
                className="text-xs mt-5 font-bold bg-red-400 hover:bg-red-500"
              >
                Delete Skill
              </Button>
            </Flex>
          </Flex>
        </Flex>

        <Modal
          opened={opened}
          onClose={close}
          title="Choose one skill to assign to your department"
          size="md"
          shadow="lg"
          padding="md"
        >
          <Flex direction="column" gap="xl">
            <Flex direction="row" gap="xl" className="flex-wrap overflow-auto">
              {allSkills}
            </Flex>
            <Button
              onClick={() => handleAssignSkill(selectedSkill)}
              className="text-xs font-bold bg-indigo-400"
            >
              Assign
            </Button>
          </Flex>
        </Modal>
      </div>
    </>
  );
};

export default DepartmentSkills;
