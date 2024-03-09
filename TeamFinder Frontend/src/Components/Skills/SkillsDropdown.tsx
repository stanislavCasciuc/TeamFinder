import { Dropdown } from "@mui/base/Dropdown";
import { MenuButton } from "@mui/base/MenuButton";
import { Menu } from "@mui/base/Menu";
import { MenuItem } from "@mui/base/MenuItem";

interface DropdownMenuProps {
  selection: string;
  Categories: string[];
  setSelection: (value: string) => void;
}

const DropdownMenu = ({
  selection,
  setSelection,
  Categories,
}: DropdownMenuProps) => {
  const Category = Categories.map((category) => (
    <MenuItem
      onClick={() => setSelection(category)}
      className="cursor-pointer list-none p-2 rounded-lg  select-none last-of-type:border-b-0 focus:shadow-outline-purple focus:outline-0 focus:bg-slate-100 0 focus:text-slate-900 focus:dark:text-slate-300 disabled:text-slate-400 disabled:hover:text-slate-400"
    >
      {category}
    </MenuItem>
  ));

  return (
    <Dropdown>
      <div className="p-4">
        <MenuButton className="cursor-pointer text-md rounded-lg font-base px-5 py-3 bg-white border border-solid border-slate-200  text-slate-600 hover:bg-slate-50  hover:border-slate-300  focus-visible:shadow-[0_0_0_4px_#ddd6fe]  focus-visible:outline-none shadow-sm active:shadow-none">
          <span className="text-md font-base">{selection}</span>
        </MenuButton>
        <Menu className="h-40 text-sm box-border font-sans p-1.5 my-3 mx-0 rounded-xl overflow-auto outline-0 bg-white border border-solid border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-300 min-w-listbox shadow-md dark:shadow-slate-900">
          <MenuItem
            onClick={() => setSelection("All Skills")}
            className="cursor-pointer list-none p-2 rounded-lg  select-none last-of-type:border-b-0 focus:shadow-outline-purple focus:outline-0 focus:bg-slate-100 0 focus:text-slate-900 focus:dark:text-slate-300 disabled:text-slate-400 disabled:hover:text-slate-400"
          >
            All Skills
          </MenuItem>

          {Category}
        </Menu>
      </div>
    </Dropdown>
  );
};

export default DropdownMenu;
