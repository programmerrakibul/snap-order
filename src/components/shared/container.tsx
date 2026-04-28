import { cn } from "@/lib/utils";
import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container = ({ children, className }: ContainerProps) => {
  return (
    <>
      <div className={cn("w-full container mx-auto px-5 md:px-7", className)}>
        {children}
      </div>
    </>
  );
};

export default Container;
