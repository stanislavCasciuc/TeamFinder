import { Flex, TextInput, PasswordInput, rem, Title } from "@mantine/core";
import { IconLock } from "@tabler/icons-react";
import LogoSVG from "../assets/logo.svg";
import ButtonComponent from "../Components/ButtonComponent";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "../api/axios";
import { useRef, useEffect } from "react";

const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const addressRegex = /^[a-zA-Z0-9\s,'-]*$/;


const REGISTER_URL = "/users/register/";

export default function RegisterPage() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [validConfirmPassword, setValidConfirmPassword] = useState(false);
  const [confirmPasswordFocus, setConfirmPasswordFocus] = useState(false);

  const [address, setAddress] = useState("");
  const [validAddress, setValidAddress] = useState(false);
  const [addressFocus, setAddressFocus] = useState(false);

  const [Organization_name, setOrganization_name] = useState("");
  const [validOrganization_name, setValidOrganization_name] = useState(false);
  const [Organization_nameFocus, setOrganization_nameFocus] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
  }, []);
  useEffect(() => {
    const result = usernameRegex.test(user);
    setValidName(result);
  }, [user]);

  useEffect(() => {
    const result = passwordRegex.test(password);

    setValidPassword(result);
    const match = password === confirmPassword;
    setValidConfirmPassword(match);
  }, [password, confirmPassword]);

  useEffect(() => {
    const result = emailRegex.test(email);
    setValidEmail(result);
  }, [email]);

  useEffect(() => {
    const result = addressRegex.test(address);
    setValidAddress(result);
  }, [address]);

  useEffect(()=>{
    const result = usernameRegex.test(Organization_name);
    setValidOrganization_name(result);
  })

  useEffect(() => {
    setErrorMsg("");
  }, [user, password, email, confirmPassword]);

  const navigate = useNavigate();

  const HandleButtonRegistered = async () => {
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }
    try {
      const result = await axios.post(
           REGISTER_URL,
        JSON.stringify({ name: user, email: email, password: password , organization_address: address , organization_name: Organization_name, role:"organization_admin"}),
        {
          headers: { "Content-Type": "application/json" },
         
        }
      );
      console.log("Registration successful:", result.data);
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
          <p
            ref={errRef}
            className={errorMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errorMsg}
          </p>
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
              autoComplete="off"
              placeholder="Username"
              aria-autocomplete="none"
              ref={usernameRef}
              onChange={(e) => setUser(e.currentTarget.value)}
              required
              aria-invalid={!validName}
              aria-describedby="uidnote"
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
            ></TextInput>
            <p
              id="uidnote"
              className={userFocus && !validName ? "errmsg" : "offscreen"}
            >
              4 to 24 Characters. <br />
              Must begin with a letter.
              <br />
              May contain letters, numbers, and underscores.
            </p>

            <TextInput
              size="md"
              label="Email Address"
              placeholder="Email Address"
              aria-autocomplete="none"
              required
              aria-invalid={!validEmail}
              aria-describedby="emailnote"
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
              onChange={(e) => setEmail(e.currentTarget.value)}
            ></TextInput>
            <p
              id="emailnote"
              className={emailFocus && !validEmail ? "errmsg" : "offscreen"}
            >
              Must be a valid email address.
            </p>
            <TextInput
              size="md"
              label="Headquarter Address"
              placeholder="Headquarter Address"
              aria-autocomplete="none"
              required
              aria-invalid={!validAddress}
              aria-describedby="addnote"
              onFocus={() => setAddressFocus(true)}
              onBlur={() => setAddressFocus(false)}
              onChange={(e) => setAddress(e.currentTarget.value)}
            ></TextInput>
            <p
              id="addnote"
              className={addressFocus && !validAddress ? "errmsg" : "offscreen"}
            >
              Must be a valid address.
            </p>
          </Flex>

          <Flex miw="300" direction="column">
            
            <TextInput
              size="md"
              label="Organization Name"
              placeholder="Organization Name"
              aria-autocomplete="none"
              required
              aria-invalid={!validOrganization_name}
              aria-describedby="orgnote"
              onFocus={() => setOrganization_nameFocus(true)}
              onBlur={() => setOrganization_nameFocus(false)}
              onChange={(e) => setOrganization_name(e.currentTarget.value)}
            ></TextInput>
            <p
              id="orgnote"
              className={Organization_nameFocus && !validOrganization_name ? "errmsg" : "offscreen"}
            >
              Must be a valid organization name.
            </p>

            <PasswordInput
              size="md"
              label="Password"
              placeholder="Password"
              leftSection={icon}
              required
              aria-invalid={!validPassword}
              aria-describedby="passnote"
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
              onChange={(e) => setPassword(e.currentTarget.value)}
            ></PasswordInput>
            <p
              id="passnote"
              className={
                passwordFocus && !validPassword ? "errmsg" : "offscreen"
              }
            >
              8 to 24 Characters. <br />
              Must contain at least one uppercase, <br /> one lowercase letter,
              and one number.
            </p>

            <PasswordInput
              size="md"
              label="Confirm Password"
              placeholder="Confirm Password"
              leftSection={icon}
              required
              aria-invalid={!validConfirmPassword}
              aria-describedby="cpassnote"
              onFocus={() => setConfirmPasswordFocus(true)}
              onBlur={() => setConfirmPasswordFocus(false)}
              onChange={(e) => setConfirmPassword(e.currentTarget.value)}
            ></PasswordInput>
            <p
              id="cpassnote"
              className={
                confirmPasswordFocus && !validConfirmPassword
                  ? "errmsg"
                  : "offscreen"
              }
            >
              Must match the password.
            </p>
          </Flex>
          <Flex mt="30" align="center" gap="20">
            {!validName ||
            !validEmail ||
            !validPassword ||
            !validConfirmPassword ? (
              <ButtonComponent
                buttonText="Register"
                HandleButton={() =>
                  setErrorMsg("Please fill in all fields correctly")
                }
              />
            ) : (
              <ButtonComponent
                buttonText="Register"
                HandleButton={() =>  HandleButtonRegistered()}
              />
            )}
          </Flex>

          <Flex m="16" gap="sm">
            Already have an account?
            <Link
              to="/login"
              className="font-normal text-indigo-500 hover:text-cyan-900 "
            >
              Login
            </Link>
          </Flex>
        </div>
      </Flex>
    </>
  );
}
