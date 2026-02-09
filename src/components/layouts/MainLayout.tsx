import { ReactNode } from "react";
import Navbar from "../Navbar";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto p-4">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;