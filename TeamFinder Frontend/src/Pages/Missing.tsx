import { useNavigate } from "react-router-dom";
import { Button, Paper, Text } from "@mantine/core";


const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <Paper p="lg" shadow="xs" className="text-center bg-white">
        <Text className="mb-4 bg-white font-bold text-3xl">
          404 - Page Not Found
        </Text>
        <Text size="md" className="mb-6 bg-white font-light">
          Oops! The page you are looking for does not exist.
        </Text>
        <Button
          size="lg"
          variant="outline"
          color="blue"
          onClick={() => navigate("/")}
        >
          Go Back
        </Button>
      </Paper>
    </div>
  );
};

export default NotFoundPage;
