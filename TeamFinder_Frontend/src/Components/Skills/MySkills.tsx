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
import { Modal, Autocomplete, Slider } from "@mantine/core";

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
  const [editedLevel, setEditedLevel] = useState(1);

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
          `?level=${editedLevel}&experience=${selectedSkill.experience}&skill_id=${selectedSkill.skill_id}`,
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
      .delete(DELETEUSERSKILL + `/${selectedSkill.skill_id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then(() => {
        mutate(GETMYSKILLS);
        setSelectedSkill({} as SkillData);
      })
      .catch(() => {
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
    ?.map((skill: SkillData) => skill.name)
    .filter((skill: SkillData) => {
      return !skillsData?.some(
        (deptSkill: SkillData) => deptSkill.id === skill.id
      );
    });

  const indexOfLastSkill = currentPage * elementsPerPage;
  const indexOfFirstSkill = indexOfLastSkill - elementsPerPage;
  const currentSkills = Skills?.slice(indexOfFirstSkill, indexOfLastSkill);

  const levelMarks = [
    { value: 1, label: "Learns" },
    { value: 2, label: "Knows" },
    { value: 3, label: "Does" },
    { value: 4, label: "Helps" },
    { value: 5, label: "Teaches" },
  ];
  const experienceMarks = [
    { value: 0, label: "0-6 Mts" },
    { value: 6, label: "6-12 Mts" },
    { value: 12, label: "1-2 Yrs" },
    { value: 18, label: "2-4 Yrs" },
    { value: 24, label: "4-7 Yrs" },
    { value: 30, label: ">7 Yrs" },
  ];

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
        <Flex className="flex-col  rounded-xl w-3/5 p-8 flex-wrap h-fit gap-x-4 gap-y-2 text-slate-600 shadow-md">
          <Flex className="justify-between border-b p-2">
            <div className="font-semibold text-lg">Skill</div>
            <div className="font-semibold text-lg">Experience</div>
            <div className="font-semibold text-lg">Level</div>
          </Flex>

          <div className="mt-10 flex gap-2 flex-col">
            {currentSkills?.length === 0 ? (
              <span>No Skills</span>
            ) : (
              currentSkills
            )}
          </div>

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
          <Autocomplete
            data={filteredSkills}
            label="All Skills"
            placeholder="Choose one skill"
            onChange={(value) =>
              setSelectedSkill({
                ...selectedSkill,
                name: value,
                description: allSkills?.find(
                  (skill: SkillData) => skill.name === value
                )?.description,
                author_name: allSkills?.find(
                  (skill: SkillData) => skill.name === value
                )?.author_name,
                category: allSkills?.find(
                  (skill: SkillData) => skill.name === value
                )?.category,
                department_id: allSkills?.find(
                  (skill: SkillData) => skill.name === value
                )?.department_id,
                skill_id: allSkills?.find(
                  (skill: SkillData) => skill.name === value
                )?.id,
              })
            }
          />
          <Flex direction="column" gap="xl" className="p-10">
            <label htmlFor="level">Level</label>
            <Slider
              label={null}
              onChange={setLevel}
              marks={levelMarks}
              step={1}
              min={1}
              max={5}
            />
            <label htmlFor="experience">Experience</label>
            <Slider
              label={null}
              onChange={setExperience}
              marks={experienceMarks}
              step={6}
              min={0}
              max={30}
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
        title="Edit your skill"
        size="md"
        shadow="lg"
        padding="md"
      >
        <Flex direction="column" gap="xl" className="px-10">
          <label htmlFor="level">Level</label>
          <Slider
            label={null}
            onChange={setEditedLevel}
            marks={levelMarks}
            step={1}
            min={1}
            max={5}
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
