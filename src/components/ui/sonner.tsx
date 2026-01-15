"use client";

import { Toaster as Sonner, ToasterProps } from "sonner@2.0.3";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      style={
        {
          "--normal-bg": "hsl(262, 47%, 12%)",
          "--normal-text": "hsl(210, 40%, 90%)",
          "--normal-border": "hsl(262, 30%, 20%)",
          "--success-bg": "hsl(142, 76%, 36%)",
          "--success-text": "hsl(0, 0%, 100%)",
          "--error-bg": "hsl(0, 84%, 60%)",
          "--error-text": "hsl(0, 0%, 100%)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
