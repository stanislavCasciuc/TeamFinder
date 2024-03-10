import useAuth from "../../hooks/useAuth";
import useSWR, { mutate } from "swr";
import axios from "../../api/axios";
import {
  ASSIGNSKILLTOUSER,
  DELETEUSERSKILL,
  GETMYSKILLS,
  GETSKILLS,
  PUTEDITUSERSKILL,
} from "../EndPoints";
import { Button, LoadingOverlay } from "@mantine/core";
import { Flex } from "@mantine/core";
import { IconStarFilled } from "@tabler/icons-react";
import { useState } from "react";
import { Pagination } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";

interface SkillData {
  id: number;
  name: string;
  description: string;
  author_name: string;
  category: string;
  department_id: number;
  level: number;
  experience: number;
  skill_id: number;
}

const MySkills = () => {
  const { auth } = useAuth();
  const accessToken = auth?.accessToken;
  const [currentPage, setCurrentPage] = useState(1);
  const elementsPerPage = 8;
  const [selected, setSelected] = useState("");
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedSkill, setSelectedSkill] = useState<SkillData>(
    {} as SkillData
  );
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editedLevel, setEditedLevel] = useState("");
  const [editedExperience, setEditedExperience] = useState("");

  const [level, setLevel] = useState(1);
  const [experience, setExperience] = useState(1);

  const { data: skillsData, isLoading } = useSWR(GETMYSKILLS, (url) => {
    return axios
      .get(url, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((response) => response.data);
  });

  const { data: allSkills } = useSWR(GETSKILLS, (url) => {
    return axios
      .get(url, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((response) => response.data);
  });

  const handleAssignSkill = (selectedSkill: SkillData) => {
    axios
      .post(
        ASSIGNSKILLTOUSER +
          `skill_id=${selectedSkill.skill_id}&level=${level}&experience=${experience}`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      .then(() => {
        close();
        mutate(GETMYSKILLS);
      });
  };

  const handleEditSkill = (selectedSkill: SkillData) => {
    axios
      .put(
        PUTEDITUSERSKILL +
          `?level=${editedLevel}&experience=${editedExperience}&skill_id=${selectedSkill.skill_id}`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      .then(() => {
        close();
        mutate(GETMYSKILLS);
      });
  };

  const handleDeleteSkill = (selectedSkill: SkillData) => {
    axios
      .delete(DELETEUSERSKILL+ `/${selectedSkill.skill_id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then(() => {
        mutate(GETMYSKILLS);
        setSelectedSkill({} as SkillData);
      }).catch(() => {
        alert("Please select a skill to delete");
      });
  };

  const stars = (level: number) => {
    let stars = [];
    for (let i = 0; i < level; i++) {
      stars.push(<IconStarFilled size={16} />);
    }
    return stars;
  };

  const Skills = skillsData?.map((skill: SkillData) => {
    return (
      <Flex
        direction="row"
        className={` justify-between border rounded-lg p-2 hover:bg-slate-100 cursor-pointer  ${
          selected === skill.name
            ? "bg-slate-100 hover:outline-indigo-200 outline-indigo-400 outline"
            : ""
        }`}
        onClick={() => {
          setSelectedSkill(skill);
          setSelected(skill.name);
        }}
      >
        <div className="font-semibold text-lg">{skill.name}</div>
        <div className="text-md">{skill.experience + " Months"}</div>
        <Flex className="mt-2 mr-7">{stars(skill.level)}</Flex>
      </Flex>
    );
  });

  const filteredSkills = allSkills
    ?.map((skill: SkillData) => (
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
    ))
    .filter((skill: SkillData) => {
      return !skillsData?.some(
        (deptSkill: SkillData) => deptSkill.id === skill.id
      );
    });

  const indexOfLastSkill = currentPage * elementsPerPage;
  const indexOfFirstSkill = indexOfLastSkill - elementsPerPage;
  const currentSkills = Skills?.slice(indexOfFirstSkill, indexOfLastSkill);

  let pageNumbers = 1;
  for (let i = 0; i < Math.ceil(skillsData?.length / elementsPerPage); i++) {
    pageNumbers = pageNumbers + i;
  }
  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <Flex gap="md">
        <header className="flex bg-white p-4 ">
          <Flex
            className="border items-center py-3 px-7 rounded-xl shadow-sm text-slate-600"
            gap="xl"
          >
            <div className="hover:text-indigo-400 ">My-Skills</div>
          </Flex>
        </header>

        <Button
          onClick={() => {
            open();
          }}
          className="bg-indigo-400 mt-6"
        >
          Add Skill
        </Button>
        {selected ? (
          <Button
            onClick={() => {
              setEditModalOpen(true);
            }}
            className="bg-yellow-400 hover:bg-yellow-500 mt-6"
          >
            Update Skill
          </Button>
        ) : null}
        {selected ? (
          <Button
            onClick={() => handleDeleteSkill(selectedSkill)}
            className="bg-red-400 hover:bg-red-500 mt-6"
          >
            Delete Skill
          </Button>
        ) : null}
      </Flex>
      <div className="flex justify w-full h-full justify-center  mb-20">
        <Flex className="flex-col border rounded-xl w-3/5 p-8 flex-wrap h-fit gap-x-4 gap-y-2 text-slate-600 shadow-md">
          <Flex className="justify-between border-b p-2">
            <div className="font-semibold text-lg">Skill</div>
            <div className="font-semibold text-lg">Experience</div>
            <div className="font-semibold text-lg">Level</div>
          </Flex>

          {currentSkills?.length === 0 ? <span>No Skills</span> : currentSkills}

          <Pagination
            className="mt-4 text-slate-500"
            total={pageNumbers}
            value={currentPage}
            onChange={setCurrentPage}
          />
        </Flex>
      </div>
      <Modal
        opened={opened}
        onClose={close}
        title="Choose one skill to add to your profile"
        size="md"
        shadow="lg"
        padding="md"
      >
        <Flex direction="column" gap="xl">
          <Flex
            direction="row"
            gap="sm"
            className="flex-wrap overflow-auto h-30 p-2"
          >
            {filteredSkills}
          </Flex>
          <Flex direction="column" gap="xl">
            <label htmlFor="level">Level</label>
            <input
              type="number"
              id="level"
              name="level"
              min="1"
              max="5"
              value={level}
              onChange={(e) => setLevel(parseInt(e.target.value))}
            />
            <label htmlFor="experience">Experience</label>
            <input
              type="number"
              id="experience"
              name="experience"
              min="1"
              value={experience}
              onChange={(e) => setExperience(parseInt(e.target.value))}
            />
          </Flex>
          <Button
            onClick={() => {
              handleAssignSkill(selectedSkill);
              setSelectedSkill({} as SkillData);
            }}
            className="text-xs font-bold bg-indigo-400"
          >
            Assign
          </Button>
        </Flex>
      </Modal>

      <Modal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Skill"
        size="md"
        shadow="lg"
        padding="md"
      >
        <Flex direction="column" gap="xl">
          <label htmlFor="level">Level</label>
          <input
            type="number"
            id="level"
            name="level"
            min="1"
            max="5"
            value={editedLevel}
            onChange={(e) => setEditedLevel(e.target.value)}
          />
          <label htmlFor="experience">Experience</label>
          <input
            type="number"
            id="experience"
            name="experience"
            min="1"
            value={editedExperience}
            onChange={(e) => setEditedExperience(e.target.value)}
          />
          <Button
            onClick={() => {
              handleEditSkill(selectedSkill);
              setEditModalOpen(false);
              mutate(GETMYSKILLS);
            }}
            className="text-xs font-bold bg-indigo-400"
          >
            Edit
          </Button>
        </Flex>
      </Modal>
    </>
  );
};

export default MySkills;
