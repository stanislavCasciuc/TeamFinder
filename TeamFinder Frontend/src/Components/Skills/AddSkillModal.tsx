
import { Modal, TextInput, Button } from "@mantine/core";

interface AddSkillModalProps {
    opened: boolean;
    close: () => void;
    newName: string;
    setNewName: (value: string) => void;
    newDescription: string;
    setNewDescription: (value: string) => void;
    newCategory: string;
    setNewCategory: (value: string) => void;
    handleCreateSkill: () => void;
    }


const AddSkillModal = ({ opened, close ,
newName, setNewName,
newDescription, setNewDescription,
newCategory, setNewCategory,
handleCreateSkill

}:
AddSkillModalProps
) => {

return (
<Modal opened={opened} onClose={close} title="Create Department" centered>
<div className="flex flex-col gap-3">
  <TextInput
    label="Skill's Name"
    value={newName}
    onChange={(event) => setNewName(event.currentTarget.value)}
  />
  <TextInput
    label="Description"
    value={newDescription}
    onChange={(event) => setNewDescription(event.currentTarget.value)}
  />
  <TextInput
    label="Category"
    value={newCategory}
    onChange={(event) => setNewCategory(event.currentTarget.value)}
  />

  <Button
    onClick={() => {
      handleCreateSkill();
      close();
      
    }}
    className="bg-indigo-500 hover:bg-indigo-600 rounded-xl w-40  "
  >
    Confirm
  </Button>
</div>
</Modal>
);

}

export default AddSkillModal;
