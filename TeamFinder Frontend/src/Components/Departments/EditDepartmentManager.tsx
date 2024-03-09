import {Modal} from "@mantine/core";
import {GETDEPARTMENTMANAGERS } from "../EndPoints";
import axios from "../../api/axios";
import useSWR from "swr";
import useAuth from "../../hooks/useAuth";
import { Button } from "@mantine/core";



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
          <div key={user.user_id}>
            <span
              className="text-sm font-semibold cursor-pointer hover:text-indigo-500"
              onClick={() => setNewManagerId(user.user_id)}
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
        <form
          className="flex flex-col gap-3"
        >
          {ManagersList}

          <Button
      
            onClick={() => {
              handleSubmitEdit();
              setChangeManager(false);
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
