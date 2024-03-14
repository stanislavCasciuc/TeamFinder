import { Flex } from "@mantine/core";
import { useState } from "react";
import DropdownMenu from "./DropdownMenu";
import AccordionComponent from "./AccordionComponent";

const Users = () => {
  const [menuSelection, setMenuSelection] = useState("All Users");

  return (
    <>
      <DropdownMenu selection={menuSelection} setSelection={setMenuSelection} />
      <div className="w-full flex align-center justify-center mb-20">
        <Flex
          direction="column"
          className="w-3/5 text-left  text-slate-600   gap-10 shadow-lg p-10 rounded-xl"
        >
          <AccordionComponent menuSelection={menuSelection} />
        </Flex>
      </div>
    </>
  );
};

export default Users;
