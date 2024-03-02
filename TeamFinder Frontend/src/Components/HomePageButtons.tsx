import { Flex} from "@mantine/core";
import useAuth from "../hooks/useAuth";
import { IconUserCircle, IconUsersGroup } from "@tabler/icons-react";
import LinkComponent from "./LinkComponent";

interface HomePageButtonsProps {
  setSidebar: (value: boolean) => void;
}

const HomePageButtons = ({ setSidebar }: HomePageButtonsProps) => {
  const { auth } = useAuth();
  const accessToken = auth?.accessToken;
  const role = auth?.role;
  return (
    <Flex direction="column">
      <LinkComponent
        icon={<IconUserCircle size={28} />}
        accessToken={accessToken}
        value="Profile"
        setSidebar={setSidebar}
      />

      {/* {
      role === "organization_admin" && ( */}
        <LinkComponent
          icon={<IconUsersGroup size={28} />}
          accessToken={accessToken}
          value="Users"
          setSidebar={setSidebar}
        />
      {/* )} */}
    </Flex>
  );
};

export default HomePageButtons;
