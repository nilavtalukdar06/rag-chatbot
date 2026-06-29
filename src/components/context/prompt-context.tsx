"use client";

interface ContextType {
  prompt: string;
  setPrompt: (prompt: string) => void;
}

import { createContext, useContext, useState } from "react";

export const PromptContext = createContext<ContextType | null>(null);

export function PromptProvider({ children }: { children: React.ReactNode }) {
  const [prompt, setPrompt] = useState<string>("");
  return (
    <PromptContext.Provider value={{ prompt, setPrompt }}>
      {children}
    </PromptContext.Provider>
  );
}

export const usePrompt = () => {
  const context = useContext(PromptContext);
  if (!context) {
    throw new Error("the app must be wrapped inside prompt provider");
  }
  const { prompt, setPrompt } = context;
  return {
    prompt,
    setPrompt,
  };
};
