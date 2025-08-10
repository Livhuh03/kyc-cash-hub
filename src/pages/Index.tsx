import { useState } from "react";
import { Dashboard } from "@/components/Dashboard";
import { LoginForm } from "@/components/LoginForm";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return isLoggedIn ? (
    <Dashboard />
  ) : (
    <LoginForm onLogin={() => setIsLoggedIn(true)} />
  );
};

export default Index;
