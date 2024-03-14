import { Button } from "@mantine/core";
interface ButtonProps {
  buttonText: string;
  HandleButton: () => void;
}

export default function ButtonComponentWhite({ buttonText,HandleButton}: ButtonProps) {
  return (
    <Button
      variant="outline"
      size="xl"
      className="hover:bg-indigo-50 w-full md:w-auto shadow-md"
      onClick={HandleButton}
    >
      {buttonText}
    </Button>
  );
}
