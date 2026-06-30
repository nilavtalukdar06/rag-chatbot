"use client";

import type { ChatStatus } from "ai";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "../ui/input-group";
import { usePrompt } from "../context/prompt-context";
import TextareaAutosize from "react-textarea-autosize";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { ArrowUpIcon } from "lucide-react";
import { Spinner } from "../ui/spinner";

interface Props {
  sendMessage: (message: { text: string }) => void;
  status: ChatStatus;
}

export function PromptInput({ sendMessage, status }: Props) {
  const { prompt, setPrompt } = usePrompt();

  const mutation = useMutation({
    mutationFn: async () => {
      const { data } = await axios.post("/api/messages", { text: prompt });
      return data;
    },
    onSuccess: () => {
      sendMessage({ text: prompt });
      setPrompt("");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || error.message);
    },
  });
  return (
    <div className="grid w-full">
      <InputGroup className="bg-white rounded-2xl shadow-md p-2 border border-neutral-300">
        <TextareaAutosize
          data-slot="input-group-control"
          className="flex field-sizing-content min-h-16 w-full resize-none rounded-2xl bg-transparent px-3 py-2.5 text-base transition-[color,box-shadow] outline-none md:text-sm"
          placeholder="Enter your prompt"
          value={prompt}
          disabled={mutation.isPending}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <InputGroupAddon align="block-end">
          <InputGroupButton
            className="ml-auto"
            size="sm"
            variant="default"
            onClick={() => mutation.mutate()}
            disabled={
              Boolean(!prompt) ||
              status === "streaming" ||
              status === "submitted"
            }
          >
            {mutation.isPending ? <Spinner /> : <ArrowUpIcon />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
