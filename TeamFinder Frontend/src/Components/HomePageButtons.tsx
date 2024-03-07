import { Flex } from "@mantine/core";
import useAuth from "../hooks/useAuth";
import {
  IconUserCircle,
  IconUsersGroup,
  IconBuildingSkyscraper,
  IconBuildingStore,
  IconFolders,
  IconFolder,
  IconSwords,
} from "@tabler/icons-react";
import LinkComponent from "./LinkComponent";

interface HomePageButtonsProps {
  setSidebar: (value: boolean) => void;
}

const HomePageButtons = ({ setSidebar }: HomePageButtonsProps) => {
  const { auth } = useAuth();

  const roles = auth?.roles;

  return (
    <Flex direction="column">
      <LinkComponent
        icon={<IconUserCircle size={28} />}
        value="Profile"
        setSidebar={setSidebar}
      />
      <br />

      {roles?.includes("Organization Admin") && (
        <>
          <LinkComponent
            icon={<IconUsersGroup size={28} />}
            value="Users"
            setSidebar={setSidebar}
          />

          <LinkComponent
            icon={<IconBuildingSkyscraper size={28} />}
            value="Departments"
            setSidebar={setSidebar}
          />
          <LinkComponent
            icon={<IconFolders size={28} />}
            value="Projects"
            setSidebar={setSidebar}
          />
        </>
      )}
      <br />
      <LinkComponent
        icon={<IconBuildingStore size={28} />}
        value="My-Department"
        setSidebar={setSidebar}
      />
      <LinkComponent
        icon={<IconFolder size={28} />}
        value="My-Projects"
        setSidebar={setSidebar}
      />
      <LinkComponent
        icon={<IconSwords size={28} />}
        value="My-Skills"
        setSidebar={setSidebar}
      />
    </Flex>
  );
};

export default HomePageButtons;
