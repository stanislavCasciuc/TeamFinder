import { Dropdown } from "@mui/base/Dropdown";
import { MenuButton } from "@mui/base/MenuButton";
import { Menu } from "@mui/base/Menu";
import { MenuItem } from "@mui/base/MenuItem";

interface DropdownMenuProps {
  selection: string;
  setSelection: (value: string) => void;
}

const DropdownMenu = ({ selection, setSelection }: DropdownMenuProps) => {
  const createHandleMenuClick = (menuItem: string) => {
    return () => {
      setSelection(menuItem);
    };
  };
  return (
    <Dropdown>
      <MenuButton className="w-fit cursor-pointer text-sm font-sans box-border rounded-lg font-semibold px-4 py-2 bg-white border border-solid border-slate-200  text-slate-900 hover:bg-slate-50  hover:border-slate-300  focus-visible:shadow-[0_0_0_4px_#ddd6fe]  focus-visible:outline-none shadow-sm active:shadow-none">
        <span className="text-lg">{selection}</span>
      </MenuButton>
      <Menu className="text-sm box-border font-sans p-1.5 my-3 mx-0 rounded-xl overflow-auto outline-0 bg-white dark:bg-slate-900 border border-solid border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-300 min-w-listbox shadow-md dark:shadow-slate-900">
        <MenuItem
          className="cursor-pointer  list-none p-2 rounded-lg  select-none last-of-type:border-b-0 focus:shadow-outline-purple focus:outline-0 focus:bg-slate-100 0 focus:text-slate-900 focus:dark:text-slate-300 disabled:text-slate-400 disabled:hover:text-slate-400"
          onClick={createHandleMenuClick("All Users")}
        >
          All Users
        </MenuItem>
        <MenuItem
          onClick={createHandleMenuClick("Organization Admin")}
          className="cursor-pointer list-none p-2 rounded-lg  select-none last-of-type:border-b-0 focus:shadow-outline-purple focus:outline-0 focus:bg-slate-100 0 focus:text-slate-900 focus:dark:text-slate-300 disabled:text-slate-400 disabled:hover:text-slate-400"
        >
          Organization Admins
        </MenuItem>
        <MenuItem
          className="list-none p-2 rounded-lg cursor-pointer  select-none last-of-type:border-b-0 focus:shadow-outline-purple focus:outline-0 focus:bg-slate-100 0 focus:text-slate-900 focus:dark:text-slate-300 disabled:text-slate-400 disabled:hover:text-slate-400"
          onClick={createHandleMenuClick("Department Manager")}
        >
          Department Managers
        </MenuItem>
        <MenuItem
          className="list-none p-2 rounded-lg cursor-pointer  select-none last-of-type:border-b-0 focus:shadow-outline-purple focus:outline-0 focus:bg-slate-100 0 focus:text-slate-900 focus:dark:text-slate-300 disabled:text-slate-400 disabled:hover:text-slate-400"
          onClick={createHandleMenuClick("Project Manager")}
        >
          Project Managers
        </MenuItem>
      </Menu>
    </Dropdown>
  );
};

export default DropdownMenu;
