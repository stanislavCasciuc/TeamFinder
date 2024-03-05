import { Link, useLocation } from "react-router-dom";
import { Flex } from "@mantine/core";
import { useState, useEffect } from "react";

interface LinkComponentProps {
  icon: JSX.Element;
  value: string;
  setSidebar: (value: boolean) => void;
}

const LinkComponent = ({ icon, value, setSidebar }: LinkComponentProps) => {
  const location = useLocation();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(location.pathname === `/HomePage/${value}`);
  }, [location.pathname, value]);

  const linkClassName = `font-medium text-lg text-slate-600 hover:bg-indigo-100 rounded-r-xl p-2 ${isActive ? "bg-indigo-50" : ""}`;
  
  return (
    <Link
   
      to={`/HomePage/${value}`}
      className={linkClassName}
      onClick={() => {
        setSidebar(false);
      }}
    >
      <Flex direction="row" className="gap-4 align-center px-6">
        {icon && icon}
        <span>{value}</span>
      </Flex>
    </Link>
  );
};

export default LinkComponent;
