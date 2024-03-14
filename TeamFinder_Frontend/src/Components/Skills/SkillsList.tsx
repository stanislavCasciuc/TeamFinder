import {
  Flex,
  LoadingOverlay,
  HoverCard,
  Button,
  Pagination,
} from "@mantine/core";
import useSWR, { mutate } from "swr";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import { IconInfoCircle } from "@tabler/icons-react";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { GETSKILLS, POSTNEWSKILLS } from "../EndPoints";
import AddSkillModal from "./AddSkillModal";
import SkillsDropdown from "./SkillsDropdown";
import { useNavigate } from "react-router-dom";

interface SkillData {
  id: number;
  name: string;
  description: string;
  author_name: string;
  category: string;
  department_id: number;
}

const SkillsList = () => {
  const { auth } = useAuth();
  const accessToken = auth?.accessToken;
  const myDepartmentId = auth?.department_id;

  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [opened, { open, close }] = useDisclosure(false);
  const [currentPage, setCurrentPage] = useState(1);
  const elementsPerPage = 8;
  const [selection, setSelection] = useState("All Skills");
  const navigate = useNavigate();

  const handleCreateSkill = () => {
    axios
      .post(
        POSTNEWSKILLS +
          `?name=${newName}&description=${newDescription}&category=${newCategory}`,
        {
          name: newName,
          description: newDescription,
          category: newCategory,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      .then(() => {
        mutate(GETSKILLS);
      });
    close();
  };

  const handleDeleteSkill = (id: number) => {
    axios
      .delete(POSTNEWSKILLS + `/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then(() => {
        mutate(GETSKILLS);
      });
  };

  const {
    data: skillsData,
    error,
    isLoading,
  } = useSWR(GETSKILLS, (url) => {
    return axios
      .get(url, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((response) => response.data);
  });

  if (isLoading) {
    return <LoadingOverlay visible={true} />;
  }
  if (error) {
    return <span className="errmsg">Error getting the list of skills</span>;
  }

  const Categories = skillsData
    .filter((skill: SkillData) => skill.category !== "")
    .map((skill: SkillData) => skill.category);

  const filteredCategories =
    selection === "All Skills"
      ? skillsData.map((item: SkillData) => item)
      : skillsData.filter((item: SkillData) => item.category === selection);

  const indexOfLastSkill = currentPage * elementsPerPage;
  const indexOfFirstSkill = indexOfLastSkill - elementsPerPage;
  const currentSkills = filteredCategories.slice(
    indexOfFirstSkill,
    indexOfLastSkill
  );

  const skills = currentSkills.map((skill: SkillData) => (
    <>
      <Flex className="border rounded-lg justify-between " key={skill.id}>
        <span className=" p-2" key={skill.id}>
          {skill.name}
        </span>
        <Flex className="align-center gap-2">
          <span
            onClick={() => {
              navigate(`${skill.id}`);
            }}
            key={`view-${skill.id}`}
            className="text-xs pt-3 font-base text-slate-300 hover:text-indigo-500 cursor-pointer"
          >
            View skill
          </span>

          {myDepartmentId === skill.department_id && (
            <span
              onClick={() => {
                mutate(GETSKILLS);
                handleDeleteSkill(skill.id);
              }}
              key={`delete-${skill.id}`}
              className="text-xs pt-3 font-base text-slate-300 hover:text-red-500 cursor-pointer"
            >
              Delete
            </span>
          )}

          <HoverCard width={280} shadow="md">
            <HoverCard.Target>
              <IconInfoCircle className="mt-2 mr-2 cursor-pointer" size={28} />
            </HoverCard.Target>
            <HoverCard.Dropdown>
              <div className="p-4">
                <div className="text-lg font-semibold">{skill.name}</div>
                <div className="text-sm">{skill.description}</div>
                <div className="text-sm font-semibold">Author: </div>
                <div className="text-sm">{skill.author_name}</div>
              </div>
            </HoverCard.Dropdown>
          </HoverCard>
        </Flex>
      </Flex>
    </>
  ));

  let pageNumbers = 1;
  for (
    let i = 0;
    i < Math.ceil(filteredCategories.length / elementsPerPage);
    i++
  ) {
    pageNumbers = pageNumbers + i;
  }

  return (
    <>
      <Flex>
        <SkillsDropdown
          selection={selection}
          setSelection={setSelection}
          Categories={Categories}
        />
        <Button className="bg-indigo-400 mt-6" onClick={opened ? close : open}>
          Create Skill
        </Button>
      </Flex>
      <div className="flex justify w-full h-full justify-center  mb-20">
        <Flex className="flex-col  rounded-xl w-3/5 p-8 flex-wrap h-fit gap-x-4 gap-y-2 text-slate-600 shadow-md">
          {skills.length === 0 ? "No skills" : skills}

          <Pagination
            className="mt-4 text-slate-500"
            total={pageNumbers}
            value={currentPage}
            onChange={setCurrentPage}
          />
        </Flex>
      </div>
      <AddSkillModal
        placeholder=""
        opened={opened}
        close={close}
        newName={newName}
        setNewName={setNewName}
        newDescription={newDescription}
        setNewDescription={setNewDescription}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        handleCreateSkill={handleCreateSkill}
        value="Create Skill"
      />
    </>
  );
};

export default SkillsList;
