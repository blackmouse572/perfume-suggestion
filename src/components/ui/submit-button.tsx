"use client";
import React from "react";
import { Button, ButtonProps } from "./button";
import { cn } from "@/lib/utils";
import { useFormStatus } from "react-dom";
import { Icons } from "../icons";

type Props = ButtonProps;

function SubmitButton({ className, ...p }: Props) {
  const { pending } = useFormStatus();
  if (pending)
    return (
      <Button {...p} disabled>
        <Icons.Loading className="w-6 h-6 mx-2 repeat-infinite animate-spin duration-1000" />
      </Button>
    );
  return <Button className={cn("", className)} {...p} />;
}

export default SubmitButton;
