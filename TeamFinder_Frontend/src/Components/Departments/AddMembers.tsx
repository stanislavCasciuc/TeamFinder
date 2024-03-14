import useSWR from "swr";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import { LoadingOverlay } from "@mantine/core";
import { List, Modal, Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { GETALLUSERS, POSTNEWMEMBERS } from "../EndPoints";

interface AddMembersProps {
  addMembers: boolean;
  setAddMembers: (value: boolean) => void;
}

interface UserData {
  roles: string[];
  name: string;
  id: number;
  department_name: string | null;
}

const AddMembers = ({ addMembers, setAddMembers }: AddMembersProps) => {
  const { auth } = useAuth();
  const accessToken = auth?.accessToken;
  const searchParams = new URLSearchParams(location.search);
  const user_id = searchParams.get("user_id");
  const selectedUserId = user_id ? parseInt(user_id) : 0;
  const navigate = useNavigate();

  const close = () => {
    setAddMembers(false);
  };

  const {
    data: responseData,
    error,
    isLoading,
  } = useSWR(GETALLUSERS, (url) => {
    return axios
      .get(url, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((response) => response.data);
  });

  const data = responseData || [];

  if (isLoading) {
    return <LoadingOverlay visible={true} />;
  }
  if (error) {
    return <span className="errmsg">Error getting the list of users</span>;
  }

  const unassignedUsers = data.filter(
    (user: UserData) => user.department_name===null  && !user.roles.includes("Department Manager") 
  );

  const Users = unassignedUsers.map((user: UserData) => {
    return (
      <List.Item
        className={
          selectedUserId === user.id
            ? "bg-slate-100 cursor-pointer p-2 rounded-lg last-of-type:border-b-0 focus:shadow-outline-purple focus:outline-0 focus:bg-slate-100 0 focus:text-slate-900 focus:dark:text-slate-300 disabled:text-slate-400 disabled:hover:text-slate-400 "
            : "cursor-pointer p-2 rounded-lg last-of-type:border-b-0 focus:shadow-outline-purple focus:outline-0 focus:bg-slate-100 0 focus:text-slate-900 focus:dark:text-slate-300 disabled:text-slate-400 disabled:hover:text-slate-400"
        }
        key={user.id}
        onClick={() => {
          navigate(`?user_id=${user.id}`);
        }}
      >
        {user.name}
      </List.Item>
    );
  });

  return (
    <Modal
      opened={addMembers}
      onClose={close}
      title="Add Members to Department"
      centered
    >
      <div className="flex flex-col gap-3">
        <List className="p-2 border-2 rounded-xl">
          <span className="text-sm font-semibold ">Choose a new member</span>
          {Users}
        </List>
        <Button
          onClick={() => {
            axios
              .post(
                POSTNEWMEMBERS + `?user_id=${selectedUserId}`,
                {},
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                  },
                }
              )
              .then(() => {
                close();
                setAddMembers(false);
              });
          }}
          className="bg-indigo-500 hover:bg-indigo-600 rounded-xl w-40  "
        >
          Confirm
        </Button>
      </div>
    </Modal>
  );
};

export default AddMembers;
