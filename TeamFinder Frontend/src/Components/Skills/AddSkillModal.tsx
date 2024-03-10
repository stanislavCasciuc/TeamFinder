import { Modal, TextInput, Button, Textarea } from "@mantine/core";

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
  value: string;
  placeholder?: string;
}

const AddSkillModal = ({
  opened,
  close,
  newName,
  setNewName,
  newDescription,
  setNewDescription,
  newCategory,
  setNewCategory,
  handleCreateSkill,
  value,
  placeholder,
}: AddSkillModalProps) => {
  return (
    <Modal opened={opened} onClose={close} title={value} centered>
      <div className="flex flex-col gap-3">
        <TextInput
          placeholder={placeholder}
          label="Skill's Name"
          value={newName}
          onChange={(event) => setNewName(event.currentTarget.value)}
        />
        <Textarea
          placeholder={placeholder}
          label="Description"
          value={newDescription}
          onChange={(event) => setNewDescription(event.currentTarget.value)}
        />
        <TextInput
          placeholder={placeholder}
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
};

export default AddSkillModal;
