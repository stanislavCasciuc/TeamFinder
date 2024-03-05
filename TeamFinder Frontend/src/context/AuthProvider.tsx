import { createContext, useState } from "react";


interface AuthContextType {
    auth: Auth | null;
    setAuth: React.Dispatch<React.SetStateAction<Auth | null>>;
  }
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

interface Auth {
    accessToken: string;
    roles: string[] | undefined;
    organization_id: number | undefined;
    id: number | undefined;
  }

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [auth, setAuth] = useState<Auth | null>(null);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
