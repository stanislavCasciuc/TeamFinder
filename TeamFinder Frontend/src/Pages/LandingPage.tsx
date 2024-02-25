import { Flex, Title } from "@mantine/core";
import ButtonComponent from "../Components/ButtonComponent";
import ResponsiveHeader from "../Components/ResponsiveHeader";
import ButtonComponentWhite from "../Components/ButtonComponentWhite";

export default function LandingPage() {
  return (
    <main>
      <header className="border-b mb-20 p-4">
        <Flex className="p-2">
          <Title className="font-light text-2xl mr-6">Logo</Title>
          <Title order={2} className="font-light text-2xl">
            Team Finder
          </Title>
        </Flex>
      </header>

      <Flex maw="900" direction="column" className="p-12">
        <ResponsiveHeader children="Building a team has never been so easy" />
        
        <Title order={2} className="font-normal text-2xl mt-8 mb-8">
          Team builders help managers build the perfect team for any project
        </Title>

        <Flex justify="start" gap="12" wrap="wrap">
          <ButtonComponent  buttonText="Join Us"/>
          <ButtonComponentWhite buttonText="Log In" />
        </Flex>
      </Flex>
    </main>
  );
}
