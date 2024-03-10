import { useParams } from "react-router-dom";
import useSWR, { mutate } from "swr";
import axios from "../../api/axios";
import { GETSKILLS, POSTNEWSKILLS } from "../EndPoints";
import { LoadingOverlay, Flex, Title } from "@mantine/core";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";
import AddSkillModal from "./AddSkillModal";

interface SkillData {
  id: number;
  name: string;
  description: string;
  author_name: number;
  category: string;
}

const SkillPage = () => {
  const { auth } = useAuth();
  const accessToken = auth?.accessToken;
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedCategory, setEditedCategory] = useState("");
  const myDepartmentId = auth?.department_id;

  let { id } = useParams();
  let skillId = 0;
  if (id) {
    skillId = parseInt(id);
  }

  const {
    data: skills,
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
  const selectedSkill = skills.find((skill: SkillData) => skill.id === skillId);
  const name = selectedSkill?.name;
  const data = selectedSkill;
  const initials = name ? name.charAt(0) : "";

  const handleEditSkill = () => {
    axios
      .put(
        POSTNEWSKILLS +
          `?id=${skillId}&name=${editedName}&description=${editedDescription}&category=${editedCategory}&author_name=${data.author_name}`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      .then(() => {
        mutate(GETSKILLS);
      });
  };

  return (
    <>
      <header className="flex bg-white p-4 justify-between ">
        <Flex
          className="border cursor-pointer hover:bg-slate-100 items-center py-3 px-7 rounded-xl shadow-sm text-slate-600"
          gap="xl"
          onClick={() => window.history.back()}
        >
          <div>Back</div>
        </Flex>
        {myDepartmentId === data.department_id && (
          <Flex
            className="hover:bg-slate-100 border items-center py-3 px-7 rounded-xl cursor-pointer shadow-sm text-slate-600"
            gap="xl"
            onClick={() => {
              setEditModalOpen(true);
            }}
          >
            <div className="hover:text-indigo-400 ">Edit</div>
          </Flex>
        )}
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
              <span className="font-semibold "> Category: </span>
              {data.category}
            </span>
            <span>
              <span className="font-semibold">Description: </span>
              {data.description}
            </span>{" "}
            <span className="text-md">
              <span className="font-semibold">Author: </span>
              {data.author_name}
            </span>
          </Flex>
        </div>
      </div>
      <AddSkillModal
        placeholder="Could be empty..."
        newName={editedName}
        newDescription={editedDescription}
        newCategory={editedCategory}
        setNewName={setEditedName}
        setNewDescription={setEditedDescription}
        setNewCategory={setEditedCategory}
        close={() => setEditModalOpen(false)}
        opened={editModalOpen}
        handleCreateSkill={handleEditSkill}
        value="Edit Skill"
      />
    </>
  );
};

export default SkillPage;
