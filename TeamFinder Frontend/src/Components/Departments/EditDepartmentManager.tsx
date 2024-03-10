import { Modal } from "@mantine/core";
import { GETALLDEPARTMENTS, GETDEPARTMENTMANAGERS } from "../EndPoints";
import axios from "../../api/axios";
import useSWR, { mutate } from "swr";
import useAuth from "../../hooks/useAuth";
import { Button } from "@mantine/core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface EditDepartmentManagerProps {
  changeManager: boolean;
  setChangeManager: (value: boolean) => void;
  handleSubmitEdit: () => void;
  department_id: number;
  setNewManagerId: (value: number) => void;
}

interface UserData {
  username: string;
  user_id: number;
}

const EditDepartmentManager = ({
  changeManager,
  setChangeManager,
  handleSubmitEdit,
  setNewManagerId,
}: EditDepartmentManagerProps) => {
  const { auth } = useAuth();
  const accessToken = auth?.accessToken;
  const [selected, setSelected] = useState(0);
    const navigate = useNavigate();

  const { data: ManagersData } = useSWR(GETDEPARTMENTMANAGERS, (url) => {
    return axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => response.data);
  });
  const Managers = ManagersData || [];

  const ManagersList = Managers.map((user: UserData) => {
    return (
      <div className="w-full flex justify-center" key={user.user_id}>
        <span
          className={`border rounded-lg hover:bg-slate-100 p-2 cursor-pointer w-full  ${
            selected === user.user_id
              ? "bg-slate-100 hover:outline-indigo-200 mt-2 outline-indigo-400 outline"
              : ""
          }`}
          onClick={() => {
            setNewManagerId(user.user_id);
            setSelected(user.user_id);
          }}
        >
          {user.username}
        </span>
      </div>
    );
  });

  return (
    <Modal
      opened={changeManager}
      onClose={() => setChangeManager(false)}
      title="Change Department Manager"
      centered
    >
      <form className="flex flex-col gap-5">
        {ManagersList}

        <Button
          onClick={() => {
            handleSubmitEdit();
            setChangeManager(false);
            navigate(-1);
            mutate(GETALLDEPARTMENTS);
          }}
          className="bg-blue-500 text-white py-1 px-2 text-sm rounded hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
        >
          Submit
        </Button>
      </form>
    </Modal>
  );
};

export default EditDepartmentManager;
