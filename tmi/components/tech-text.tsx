"use client";

import React from "react";

interface TechTextProps {
  text: string;
  className?: string;
  trigger?: "mount" | "hover" | "view";
}

export function TechText({ text, className = "" }: TechTextProps) {
  return (
    <span className={className}>
      {text}
    </span>
  );
}

