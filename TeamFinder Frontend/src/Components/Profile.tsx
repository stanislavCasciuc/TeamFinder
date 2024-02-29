import { Container } from "@mantine/core";
import useAuth from "../hooks/useAuth";
import { Title, Flex } from "@mantine/core";

const ProfilePage = () => {
  //   const { auth } = useAuth();
  //   const name:string = auth?.name;
  //   const role:string = auth?.role;
  //   const organization: string=auth?.organization_name;
  // const email:string = auth?.email;

  const email = "johndoe@gmail.com";
  const role: string = "Organization Admin";
  const organization: string = "Organization";
  const name: string = "John Doe";
  const initials: string = name.substring(0, 1).toUpperCase();

  return (
    <>
      <Container className="m-0 px-24 py-12 text-slate-900">
        <Title order={1} className="text-5xl">
          Profile
        </Title>
        <div className="flex flex-row justify-center items-center">
          <div className="h-40 w-40 mt-8 bg-gray-200 rounded-full flex justify-center items-center">
            <span className="text-4xl font-bold">{initials}</span>
          </div>
          <div className="ml-8">
            <Title order={2} className="text-3xl mb-8">
              {name}
            </Title>
            <Flex direction="column" gap="md">
              <span className="text-lg">Organization: {organization}</span>

              <span className="text-lg">Role: {role} </span>

              <span className="text-lg">Email: {email} </span>
            </Flex>
          </div>
        </div>
      </Container>
    </>
  );
};

export default ProfilePage;
