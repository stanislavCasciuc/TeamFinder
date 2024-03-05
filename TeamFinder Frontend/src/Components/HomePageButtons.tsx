import { Flex } from "@mantine/core";
import useAuth from "../hooks/useAuth";
import { IconUserCircle, IconUsersGroup ,IconBuildingWarehouse} from "@tabler/icons-react";
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

      {/* {roles?.includes("Organization Admin") && (<> */}
        <LinkComponent
          icon={<IconUsersGroup size={28} />}
          value="Users"
          setSidebar={setSidebar}
        />

        <LinkComponent 
        icon={<IconBuildingWarehouse size={28} />}
        value="Departments"
        setSidebar={setSidebar}
        />

      {/* </>)} */}
    </Flex>
  );
};

export default HomePageButtons;
