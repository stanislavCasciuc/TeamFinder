import { Button } from "@mantine/core";

interface ButtonProps {
  buttonText: string;
}

export default function ButtonComponentWhite({ buttonText }: ButtonProps) {
  return (
    <Button variant="outline" size="xl" className="hover:bg-indigo-50 w-full md:w-auto" >
      {buttonText}
    </Button>
  );
}
