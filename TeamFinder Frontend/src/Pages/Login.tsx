import { Flex, TextInput, PasswordInput, rem, Title } from "@mantine/core";
import { IconLock } from "@tabler/icons-react";
import LogoSVG from "../assets/logo.svg";
import ButtonComponent from "../Components/ButtonComponent";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const HandleButtonLogged = () => {
    navigate("/");
  };

  const icon = (
    <IconLock style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
  );
  return (
    <>
      <Flex
        justify="center"
        align="center"
        wrap="wrap"
        direction="column"
        h="100vh"
        w="100vw"
      >
        <div className="md:border border-gray-200 md:p-12 rounded-xl">
          <Flex className="p-2 my-6 " gap="sm">
            <img src={LogoSVG} alt="Team Finder Logo" className="w-8" />

            <Title order={1} className="font-normal text-3xl">
              TeamFinder
            </Title>
          </Flex>

          <Flex miw="300" direction="column">
            <TextInput
              size="lg"
              label="Username"
              placeholder="Username"
            ></TextInput>
          </Flex>


          <Flex miw="300" direction="column">
            <PasswordInput
              size="lg"
              label="Password"
              placeholder="Password"
              leftSection={icon}
            ></PasswordInput>
          </Flex>

          <Flex mt="30" align="center" gap="20">
            <ButtonComponent
              buttonText="Log in"
              HandleButton={HandleButtonLogged}
            />
          </Flex>
          <Flex m="10" gap="sm">
            Don't have an account?
            <a
              href="/register"
              className="font-normal text-indigo-500 hover:text-cyan-900"
            >
              Register
            </a>
          </Flex>
        </div>
      </Flex>
    </>
  );
}
