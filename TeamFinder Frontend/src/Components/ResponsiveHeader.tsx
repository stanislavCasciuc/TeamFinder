
import { Text } from '@mantine/core';

interface ResponsiveHeaderProps{
    children:string;
}

const ResponsiveHeader = ({ children }:ResponsiveHeaderProps) => {
  return (
    <Text className="text-5xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-bold">
      {children}
    </Text>
  );
};

export default ResponsiveHeader;