import { Flex, Title } from "@mantine/core";
import { useParams } from "react-router-dom";

const SingleDepartmentPage = () => {
 
  const { department_name, department_id } = useParams();

  return (
    <Flex
      direction="column"
      className="w-full align-center md:px-24 md:py-12 px-12 py-6"
    >
      <Flex className="border-b-2 pb-6">
        <Title order={1} className="text-3xl ">
          {department_name}
        </Title>
      </Flex>

      
    </Flex>
  );
};

export default SingleDepartmentPage;
