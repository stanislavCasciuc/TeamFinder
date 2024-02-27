import { Flex } from "@mantine/core";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <Flex
      direction="column"
      dir="rtl"
      className="md:hidden text-left bg-white shadow-xl absolute top-0 h-full w-2/5 max-w-80 border-r py-2 pr-4"
    >
      <Link
        to="/"
        className="font-medium text-base p-2 text-slate-600 hover:bg-slate-200 rounded-s-xl   "
      >
        Projects
      </Link>
      <Link
        to="/"
        className="font-medium text-base p-2 text-slate-600 hover:bg-slate-200 rounded-s-xl   "
      >
        Departments
      </Link>
    </Flex>
  );
};

export default Sidebar;
