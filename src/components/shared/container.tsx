import { cn } from "@/lib/utils";
import React from "react";

const Container = ({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <>
      <div
        className={cn("w-full container mx-auto px-5 md:px-7", className)}
        {...props}
      >
        {children}
      </div>
    </>
  );
};

export default Container;
