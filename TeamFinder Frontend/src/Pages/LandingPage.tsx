import { Flex, Title } from "@mantine/core";
import ButtonComponent from "../Components/ButtonComponent";
import ResponsiveHeader from "../Components/ResponsiveHeader";
import ButtonComponentWhite from "../Components/ButtonComponentWhite";
import sourceImage from "../assets/source.png";
import LogoSVG from "../assets/logo.svg";

export default function LandingPage() {
  return (
    <>
      <header className="p-2 hover:shadow-sm">
        <Flex className="p-4" gap="sm">
          <img src={LogoSVG} alt="Team Finder Logo" className="w-9" />

          <Title order={2} className="font-light text-2xl">
            TeamFinder
          </Title>
        </Flex>
      </header>

      <Flex wrap="wrap" className="px-20 pt-8">
        <Flex maw="700" direction="column" className="mt-32 mb-20">
          <ResponsiveHeader children="Building a team has never been so easy" />

          <Title order={2} className="font-normal text-2xl mt-8 mb-8">
            Enhance your project outcomes, boost productivity, and create a
            collaborative environment that propels your company towards
            unprecedented success with TeamFinder.
          </Title>

          <Flex justify="start" gap="12" wrap="wrap">
            <ButtonComponent buttonText="Join Us" />
            <ButtonComponentWhite buttonText="Log In" />
          </Flex>
        </Flex>

        <img
          className="drop-shadow-2xl"
          src={sourceImage}
          alt="Descriptive Image of People searching and Finding"
        />
      </Flex>
    </>
  );
}
