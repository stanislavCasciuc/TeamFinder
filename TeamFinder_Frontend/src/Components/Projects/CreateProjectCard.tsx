import { IconPlus } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const CreateProjectCard = () => {
    const navigate = useNavigate();

  return (
    <>
      

      <div
        onClick={
            () => {
                navigate("CreateProject");
            }
        }
        className="rounded-3xl shadow-md hover:bg-slate-50 flex justify-center items-center cursor-pointer h-20 w-20"
      >
        <IconPlus size={32} />
      </div>
    </>
  );
};

export default CreateProjectCard;
