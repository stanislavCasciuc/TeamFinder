import HomePageButtons from "./HomePageButtons";
import { useClickOutside } from "@mantine/hooks";

interface SidebarProps {
  setSidebar: (value: boolean) => void;
}


const Sidebar = ({ setSidebar }:SidebarProps) => {
  const clickOutsideRef = useClickOutside(() => setSidebar(false));

  return (
    <>
      <div
        ref={clickOutsideRef}
        className=" md:hidden text-left bg-white shadow-xl absolute top-0 h-full w-2/5 max-w-80 border-r py-2 pr-4"
      >
        <HomePageButtons  setSidebar={setSidebar}/>
      </div>
    </>
  );
};

export default Sidebar;
