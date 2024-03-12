import { AccordionItem, Button } from "@mantine/core";
import { Group, Text, Accordion, LoadingOverlay, Flex } from "@mantine/core";
import useSWR, { mutate } from "swr";
import { TEAMFIND } from "../EndPoints";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import { useParams } from "react-router-dom";

interface TeamUserData {
  name: string;
  skills: string[];
  id: number;
  projects: string[];
}

const TeamFinder = () => {
  const { project_id } = useParams();
  const { auth } = useAuth();
  const accessToken = auth?.accessToken;

  const { data, isLoading } = useSWR<TeamUserData[]>(
    TEAMFIND + `${project_id}`,
    async (url) => {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log(response.data);
      return response.data;
    },
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  if (isLoading) return <LoadingOverlay visible={true} />;

  const users = data?.map((user: TeamUserData) => {
    return (
      <AccordionItem value={user.name}>
        <Accordion.Control>
          <Flex className="justify-between">
            {user.name}
            {user.skills.map((skill) => {
              return <div>{skill}</div>;
            })}
            <Button>Assign</Button>
          </Flex>
        </Accordion.Control>
        <Accordion.Panel>
          <Text size="sm">
            {user.projects.map((project: any) => {
              return <div>{project.hours_per_day}</div>;
            })}
          </Text>
        </Accordion.Panel>
      </AccordionItem>
    );
  });

  return (
    <>
      <Button
        onClick={() => {
          mutate(TEAMFIND + `${project_id}`);
        }}
      >
        Find
      </Button>

      <Accordion chevronPosition="right" variant="contained">
        {users}
      </Accordion>
    </>
  );
};

export default TeamFinder;
