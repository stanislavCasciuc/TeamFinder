import { Modal } from "@mantine/core";
import { GETDEPARTMENTUSERS } from "../EndPoints";
import { mutate } from "swr";

interface EditDepartmentNameModalProps {
  edit: boolean;
  department_id: number;
  setEdit: (value: boolean) => void;
  departmentName: string;
  setDepartmentName: (value: string) => void;
  handleSubmitEdit: () => void;
}

export const EditDepartmentNameModal = ({
  edit,
  department_id,
  setEdit,
  setDepartmentName,
  handleSubmitEdit,
}: EditDepartmentNameModalProps) => {
  return (
    <Modal
      opened={edit}
      onClose={() => setEdit(false)}
      className="flex items-center space-x-4"
    >
      <input
        type="text"
        placeholder="Department Name"
        className="w p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        onChange={(e) => setDepartmentName(e.target.value)}
      />
      <button
        onClick={() => {
          handleSubmitEdit();
          mutate(GETDEPARTMENTUSERS + `${department_id}`);
        }}
        className="bg-blue-500 text-white py-1 px-2 text-sm rounded hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
      >
        Submit
      </button>
    </Modal>
  );
};
