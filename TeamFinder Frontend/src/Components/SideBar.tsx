import HomePageButtons from "./HomePageButtons";
import { useClickOutside } from "@mantine/hooks";

interface SidebarProps {
  setSidebar: (value: boolean) => void;
}

const Sidebar = ({ setSidebar }: SidebarProps) => {
  const clickOutsideRef = useClickOutside(() => setSidebar(false));

  return (
    <>
      <div
        ref={clickOutsideRef}
        className=" md:hidden text-left bg-white shadow-xl fixed  top-0 h-full  border-r py-2 pr-4"
      >
        <HomePageButtons setSidebar={setSidebar} />
      </div>
    </>
  );
};

export default Sidebar;
