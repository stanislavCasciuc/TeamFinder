import { Flex, Card, Group, Badge, Button } from "@mantine/core";
import useSWR, { mutate } from "swr";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/axios";
import {
  GETPROPOSALS,
  ACCEPTPROPOSAL,
  ACCEPTDEALLOCATE,
  REJECTPROPOSAL,
  REJECTDEALLOCATE,
  GETDEALLOCATIONS,
} from "../EndPoints";

interface Proposal {
  username: string;
  user_id: number;
  project_name: string;
  project_id: number;
  id: number;
  comment: string;
}

const DepartmentRequestsSidebar = () => {
  const { auth } = useAuth();
  const accessToken = auth?.accessToken;

  const { data: proposals } = useSWR(GETPROPOSALS, (url) => {
    return axios
      .get(url, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((response) => response.data);
  });

  const { data: deallocate } = useSWR(GETDEALLOCATIONS, (url) => {
    return axios
      .get(url, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((response) => response.data);
  });

  const handleAcceptProposal = (proposalId: number) => {
    axios
      .post(
        ACCEPTPROPOSAL + `${proposalId}`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      .then(() => {});
  };

  const handleDenyProposal = (proposalId: number) => {
    axios
      .post(
        REJECTPROPOSAL + `${proposalId}`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      .then(() => {});
  };

  const handleDeallocateProposal = (proposalId: number) => {
    axios
      .post(
        ACCEPTDEALLOCATE + `${proposalId}`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      .then(() => {});
  };
  const handleDeallocateReject = (proposalId: number) => {
    axios
      .post(
        REJECTDEALLOCATE + `${proposalId}`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      .then(() => {});
  };

  const proposalCard = proposals?.map((proposal: Proposal) => (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      key={proposal.id}
      className="w-80"
    >
      <Card.Section className="p-4 font-bold text-slate-600 text-lg flex justify-between">
        <span>{proposal.project_name}</span>
        <Badge className="mt-2" color="green">
          Assign
        </Badge>
      </Card.Section>

      <Group mt="md" mb="xs">
        <span className="text-md font-semibold text-slate-600">User:</span>
        <span className="text-md font-semibold text-slate-600">
          {proposal.username}
        </span>
      </Group>

      <span className="border p-2 rounded-lg flex flex-col gap-2">
        <span className="font-semibold text-md text-slate-400">Comment:</span>
        <span className="text-slate-600 font-base text-sm">
          {" "}
          {proposal.comment}
        </span>
      </span>
      <div className="flex-row flex-wrap flex gap-2 justify-between">
        <Button
          color="blue"
          mt="md"
          radius="md"
          onClick={() => {
            handleAcceptProposal(proposal.id);
            mutate(GETPROPOSALS);
          }}
        >
          Accept Proposal
        </Button>
        <Button
          color="red"
          mt="md"
          radius="md"
          onClick={() => {
            handleDenyProposal(proposal.id);
            mutate(GETPROPOSALS);
          }}
        >
          Deny Proposal
        </Button>
      </div>
    </Card>
  ));

  const deallocateCard = deallocate?.map((proposal: Proposal) => (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      key={proposal.id}
      className="w-80"
    >
      <Card.Section className="p-4 font-bold text-slate-600 text-lg flex justify-between">
        <span>{proposal.project_name}</span>
        <Badge className="mt-2" color="red">
          Deallocate
        </Badge>
      </Card.Section>

      <Group mt="md" mb="xs">
        <span className="text-md font-semibold text-slate-600">User:</span>
        <span className="text-md font-semibold text-slate-600">
          {proposal.username}
        </span>
      </Group>

      <span className="border p-2 rounded-lg flex flex-col gap-2">
        <span className="font-semibold text-md text-slate-400">Comment:</span>
        <span className="text-slate-600 font-base text-sm">
          {" "}
          {proposal.comment}
        </span>
      </span>
      <div className="flex-row flex-wrap flex gap-2 justify-between">
        <Button
          color="blue"
          mt="md"
          radius="md"
          onClick={() => {
            handleDeallocateReject(proposal.id);
            mutate(GETPROPOSALS);
          }}
        >
          Accept Proposal
        </Button>
        <Button
          color="red"
          mt="md"
          radius="md"
          onClick={() => {
            handleDeallocateProposal(proposal.id);
            mutate(GETPROPOSALS);
          }}
        >
          Deny Proposal
        </Button>
      </div>
    </Card>
  ));
  return (
    <Flex className="p-4 shadow-xl bg-white h-full absolute right-0 top-0 min-w-80  ">
      <div className="overflow-auto ">
        <h1 className="text-2xl text-slate-400 font-semibold mb-6">
          Proposals
        </h1>
        <div className="flex flex-col gap-4  mb-20">
          {proposalCard}
          {deallocateCard}
        </div>
      </div>
    </Flex>
  );
};

export default DepartmentRequestsSidebar;
