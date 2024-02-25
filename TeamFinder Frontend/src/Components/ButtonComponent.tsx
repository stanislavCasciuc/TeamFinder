import { Button } from "@mantine/core";

interface ButtonProps {
  buttonText: string;
}

export default function ButtonComponent({ buttonText }: ButtonProps) {
  return (
    <Button
      variant="filled"
      color="primary" 
      size="xl"
      className="bg-indigo-500 hover:bg-indigo-600 w-full md:w-auto" 
    >
      {buttonText}
    </Button>
  );
}