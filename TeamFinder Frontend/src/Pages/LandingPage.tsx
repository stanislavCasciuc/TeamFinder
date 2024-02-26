import { Flex, Title, Image } from "@mantine/core";
import ButtonComponent from "../Components/ButtonComponent";
import ResponsiveHeader from "../Components/ResponsiveHeader";
import ButtonComponentWhite from "../Components/ButtonComponentWhite";
import sourceImage from "../assets/source.png";
import LogoSVG from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  const HandlebuttonRegister = () => {
    navigate("/register");
  };
  const HandlebuttonLogin = () => { 
    navigate("/login");
  }
  return (
    <>
      <header className="p-2 hover:shadow-sm">
        <Flex className="p-2" gap="sm">
          <img src={LogoSVG} alt="Team Finder Logo" className="w-8" />

          <Title order={2} className="font-light text-xl">
            TeamFinder
          </Title>
        </Flex>
      </header>

      <Flex wrap="wrap" className="px-20 md:gap-x-28">
        <Flex maw="500" direction="column" className="mt-28 mb-20">
          <ResponsiveHeader children="Building a team has never been so easy" />

          <Title order={2} className="font-light text-2xl mt-8 mb-8">
            Enhance your project outcomes, boost productivity, and create a
            collaborative environment that propels your company towards
            unprecedented success with TeamFinder.
          </Title>

          <Flex justify="start" gap="12" wrap="wrap">
            <ButtonComponent buttonText="Join Us" HandleButton={HandlebuttonRegister} />
            <ButtonComponentWhite buttonText="Log In" HandleButton={HandlebuttonLogin} />
          </Flex>
        </Flex>

        <Image
          className="drop-shadow-2xl"
          src={sourceImage}
          alt="Descriptive Image of People searching and Finding"
        />
      </Flex>
    </>
  );
}
