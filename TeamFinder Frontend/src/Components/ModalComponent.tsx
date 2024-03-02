import { useDisclosure } from "@mantine/hooks";
import { Modal as MantineModal, Button } from "@mantine/core";

interface ModalProps {
  content: React.ReactNode;
  title: string;
  handleSubmitModal: () => void;
  value: string;
}

function Modal({ content, title, value, handleSubmitModal }: ModalProps) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <MantineModal opened={opened} onClose={close} title={title}>
        {content}
      </MantineModal>

      <Button
        onClick={() => {
          open();
          handleSubmitModal();
        }}
      >
        {value}
      </Button>
    </>
  );
}
export default Modal;
