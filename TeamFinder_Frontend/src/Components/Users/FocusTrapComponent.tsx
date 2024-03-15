import { useState } from "react";
import Stack from "@mui/system/Stack";
import { FocusTrap } from "@mui/base/FocusTrap";
import { Menu } from "@mui/base/Menu";
import { MenuItem } from "@mui/base/MenuItem";
import { Button } from "@mantine/core";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import { mutate } from "swr";
import { PUTUSERROLES,GETALLUSERS } from "../EndPoints";


interface FocusTrapComponentProps {
  allRoles: string[];
  selectedUserId: number;
}

const FocusTrapComponent = ({
  allRoles,
  selectedUserId,
}: FocusTrapComponentProps) => {
  const { auth } = useAuth();
  const accessToken = auth?.accessToken;

  const [selection, setSelection] = useState("");
  const [open, setOpen] = useState(false);
  const [secondOpen, setSecondOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!open);
    setSecondOpen(false);
    if (open) setSecondOpen(false);
  };

  return (
    <FocusTrap open={open}>
      <Stack alignItems="center" spacing={4}>
        <Button
          className="border-2 p-2 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={handleOpen}
        >
          {open && secondOpen ? "Close" : "Add Role"}
        </Button>
        {open && (
          <Menu className="absolute z-20 text-sm box-border font-sans p-1.5 my-3 mx-0 rounded-xl overflow-auto outline-0 bg-white dark:bg-slate-900 border border-solid border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-300 min-w-listbox shadow-md dark:shadow-slate-900">
            {!allRoles.includes("Organization Admin") && (
              <MenuItem
                onFocus={() => {
                  setSelection("Organization Admin");
                }}
                onClick={() => {
                  setSecondOpen(true);
                  setOpen(false);
                  allRoles.push(selection);
                }}
                className="list-none p-2 rounded-lg cursor-pointer select-none last-of-type:border-b-0 focus:shadow-outline-purple focus:outline-0 focus:bg-slate-100 0 focus:text-slate-900 focus:dark:text-slate-300 disabled:text-slate-400 disabled:hover:text-slate-400"
              >
                Organization Admin
              </MenuItem>
            )}

            {!allRoles.includes("Project Manager") && (
              <MenuItem
                onFocus={() => {
                  setSelection("Project Manager");
                }}
                onClick={() => {
                  setSecondOpen(true);
                  setOpen(false);
                  allRoles.push(selection);
                }}
                className="list-none p-2 rounded-lg cursor-pointer select-none last-of-type:border-b-0 focus:shadow-outline-purple focus:outline-0 focus:bg-slate-100 0 focus:text-slate-900 focus:dark:text-slate-300 disabled:text-slate-400 disabled:hover:text-slate-400"
              >
                Project Manager
              </MenuItem>
            )}
            {!allRoles.includes("Department Manager") && (
              <MenuItem
                onFocus={() => {
                  setSelection("Department Manager");
                }}
                onClick={() => {
                  setSecondOpen(true);
                  setOpen(false);
                  allRoles.push(selection);
                }}
                className="list-none p-2 rounded-lg cursor-pointer select-none last-of-type:border-b-0 focus:shadow-outline-purple focus:outline-0 focus:bg-slate-100 0 focus:text-slate-900 focus:dark:text-slate-300 disabled:text-slate-400 disabled:hover:text-slate-400"
              >
                Department Manager
              </MenuItem>
            )}
          </Menu>
        )}
        {secondOpen && (
          <Menu className="absolute bg-white z-20 text-sm box-border font-sans p-1.5 my-3 mx-0 rounded-xl overflow-auto outline-0 border border-solid border-slate-200 text-slate-900 min-w-listbox shadow-md">
            <Button
              onClick={() => {
                setSecondOpen(false);
                axios
                  .put(
                    PUTUSERROLES +`?user_id=${selectedUserId}`,
                    allRoles,

                    {
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                      },
                    }
                  )
                  .then(() => {
                    mutate(GETALLUSERS);
                  });
              }}
              className="bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 p-2 rounded-xl"
            >
              Confirm
            </Button>
          </Menu>
        )}
      </Stack>
    </FocusTrap>
  );
};

export default FocusTrapComponent;
