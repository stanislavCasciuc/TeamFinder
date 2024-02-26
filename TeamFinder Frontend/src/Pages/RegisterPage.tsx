import { Flex, TextInput, PasswordInput, rem, Title } from "@mantine/core";
import { IconLock } from "@tabler/icons-react";
import LogoSVG from "../assets/logo.svg";
import ButtonComponent from "../Components/ButtonComponent";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "react-query";
import axios from "axios";

interface FormData {
  username: string;
  email: string;
  organization: string;
  address: string;
  password: string;
  confirmPassword: string;
}
const registerUser = async (formData: FormData) => {
  try {
    const response = await axios.post("/api/user", formData);
    return response.data;
  } catch (error) {
    throw new Error("Registration failed");
  }
};

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    organization: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(true);

  const navigate = useNavigate();
  const mutation = useMutation(registerUser);

  const HandleButtonRegistered = async () => {
    if (formData.password !== formData.confirmPassword) {
      setPasswordsMatch(false);
      return;
    }

    try {
      const result = await mutation.mutateAsync(formData);

      console.log("Registration successful:", result);
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
    }
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
        w="100%"
      >
        <div className="md:border border-gray-200 md:px-12 rounded-xl mt-8">
          <Flex className="p-2 mt-6" gap="sm">
            <img src={LogoSVG} alt="Team Finder Logo" className="w-8" />

            <Title order={1} className="font-normal text-3xl">
              TeamFinder
            </Title>
          </Flex>

          <Flex miw="300" direction="column">
            <TextInput
              size="md"
              label="Username"
              placeholder="Username"
              onChange={(e) =>
                setFormData({ ...formData, username: e.currentTarget.value })
              }
            ></TextInput>

            <TextInput
              size="md"
              label="Email Address"
              placeholder="Email Address"
              onChange={(e) =>
                setFormData({ ...formData, email: e.currentTarget.value })
              }
            ></TextInput>

            <TextInput
              size="md"
              label="Organization Name"
              placeholder="Organization Name"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  organization: e.currentTarget.value,
                })
              }
            ></TextInput>
          </Flex>

          <Flex miw="300" direction="column">
            <TextInput
              size="md"
              label="Headquarters Address"
              placeholder="Headquarters Address"
              onChange={(e) =>
                setFormData({ ...formData, address: e.currentTarget.value })
              }
            ></TextInput>

            <PasswordInput
              size="md"
              label="Password"
              placeholder="Password"
              leftSection={icon}
              onChange={(e) =>
                setFormData({ ...formData, password: e.currentTarget.value })
              }
            ></PasswordInput>

            <PasswordInput
              size="md"
              label="Confirm Password"
              placeholder="Confirm Password"
              leftSection={icon}
              className={passwordsMatch ? "border-green-500" : "border-red-500"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  confirmPassword: e.currentTarget.value,
                })
              }
            ></PasswordInput>
          </Flex>
          {!passwordsMatch && (
            <Flex m="10" gap="sm" className="text-red-500">
              Passwords do not match!
            </Flex>
          )}
          <Flex mt="30" align="center" gap="20">
            <ButtonComponent
              buttonText="Confirm Registration"
              HandleButton={HandleButtonRegistered}
            />
          </Flex>

          <Flex m="10" gap="sm">
            Already have an account?
            <a
              href="/login"
              className="font-normal text-indigo-500 hover:text-cyan-900 "
            >
              Login
            </a>
          </Flex>
        </div>
      </Flex>
    </>
  );
}
