import LogoSVG from "../assets/logo.svg";
import MenuSVG from "../assets/hamburger-menu-svgrepo-com.svg";
import { Flex, Title } from "@mantine/core";

const HomePage = () => {
  return (
    <>
      <header className="border-b">
        <Flex className="p-2 items-center" gap="sm">
          <img
            src={MenuSVG}
            alt="Hamburger Menu"
            className="w-12 mr-10 ml-2 hover:bg-gray-100 rounded-3xl cursor-pointer p-2"
          />
          <img src={LogoSVG} alt="Team Finder Logo" className="w-6" />
          <Title order={2} className="font-normal text-xl left text-slate-600">
            TeamFinder
          </Title>
        </Flex>
      </header>
      <Flex>
        <Flex h="90vh" className="w-1/5 border-r p-2">
          project
        </Flex>
        <Flex></Flex>
      </Flex>
    </>
  );
};

export default HomePage;
