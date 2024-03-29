import { Button } from "@mantine/core";
interface ButtonProps {
  buttonText: string;
  HandleButton: () => void;
}

export default function ButtonComponent({ buttonText,HandleButton }: ButtonProps) {
  return (
    <Button
      onClick={HandleButton}
      variant="filled"
      color="primary"
      size="xl"
      className="bg-indigo-500 hover:bg-indigo-600 w-full md:w-auto shadow-md"
    >
      {buttonText}
    </Button>
  );
}
