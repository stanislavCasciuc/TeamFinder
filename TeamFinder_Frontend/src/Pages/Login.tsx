import { Flex, TextInput, PasswordInput, rem, Title } from "@mantine/core";
import { IconLock } from "@tabler/icons-react";
import LogoSVG from "../assets/logo.svg";
import ButtonComponent from "../Components/ButtonComponent";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

import { jwtDecode } from "jwt-decode";
import axios from "../api/axios";
import { GETME } from "../Components/EndPoints";

const icon = (
  <IconLock style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
);
export default function LoginPage() {
  const { setAuth } = useAuth();

  const navigate = useNavigate();

  const usernameRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setErrorMsg("");
  }, [user, password]);

  const SetData = async (accessToken: string) => {
    try {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      };

      const response = await axios.get(GETME, { headers });
      const userData = response.data;

      const name: string = userData.name;
      const department_id: number = userData.department_id;
      const organization_name: string = userData.organization_name;

      return {
        name,
        department_id,
        organization_name,
      };
    } catch (error) {
      return "";
    }
  };

  const HandleButtonLogged = async () => {
    try {
      const response = await fetch(
        "https://atc-2024-quantumtrio-be-linux-web-app.azurewebsites.net/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            username: user,
            password: password,
            grant_type: "password",
            scope: "offline_access",
          }).toString(),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const accessToken = data.access_token;
        const myData = await SetData(accessToken);
        let myName: string;
        let myDepartmentId: number;
        let myOrganizationName: string;

        if (myData) {
          const { name, department_id, organization_name } = myData;
          myName = name;
          myDepartmentId = department_id;
          myOrganizationName = organization_name;
        } else {
          myName = "";
          myDepartmentId = 0;
          myOrganizationName = "";
        }

        const decoded = jwtDecode(accessToken) as {
          roles: string[];
          organization_id: number;
          id: number;
        };
        const roles: string[] = decoded.roles;
        const organization_id: number = decoded.organization_id;
        const id: number = decoded.id;

        setAuth({
          accessToken,
          roles,
          organization_id,
          id,
          myName: myName,
          department_id: myDepartmentId,
          organization_name: myOrganizationName,
        });
        navigate("/HomePage/Profile");
        setUser("");
        setPassword("");
      } else {
        setErrorMsg("Invalid username or password");
        errRef.current?.focus();
      }
    } catch (error) {
      setErrorMsg("An error to the server occurred");
      errRef.current?.focus();
    }
  };

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
          <p
            ref={errRef}
            className={errorMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errorMsg}
          </p>

          <Flex className="p-2 my-6 " gap="sm">
            <img src={LogoSVG} alt="Team Finder Logo" className="w-8" />

            <Title order={1} className="font-normal text-3xl">
              TeamFinder
            </Title>
          </Flex>

          <Flex miw="300" direction="column">
            <TextInput
              size="md"
              label="Email"
              placeholder="Email"
              ref={usernameRef}
              autoComplete="off"
              onChange={(e) => setUser(e.currentTarget.value)}
              value={user}
              required
            ></TextInput>
          </Flex>

          <Flex miw="300" direction="column">
            <PasswordInput
              size="md"
              label="Password"
              placeholder="Password"
              leftSection={icon}
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              required
            ></PasswordInput>
          </Flex>

          <Flex mt="30" align="center" gap="20">
            {!user || !password ? (
              <ButtonComponent
                buttonText="Log In"
                HandleButton={() => {
                  setErrorMsg("Please enter username and password");
                }}
              />
            ) : (
              <ButtonComponent
                buttonText="Log In"
                HandleButton={HandleButtonLogged}
              />
            )}
          </Flex>
          <Flex m="10" gap="sm">
            Don't have an account?
            <Link
              to="/register"
              className="font-normal text-indigo-500 hover:text-cyan-900"
            >
              Register
            </Link>
          </Flex>
        </div>
      </Flex>
    </>
  );
}
