"use client";

import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { UploadIcon } from "lucide-react";
import { Spinner } from "./ui/spinner";
import dynamic from "next/dynamic";

const FilePicker = dynamic(
  () => import("react-file-picker").then((mod) => mod.FilePicker),
  { ssr: false },
);

export function UploadButton() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("pdf", file);
      const { data } = await axios.post("/api/upload", formData);
      return data;
    },
    onSuccess: () => {
      toast.success("Successfully uploaded document");
      queryClient.invalidateQueries({
        queryKey: ["documents"],
      });
      setIsOpen(false);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || error.message);
    },
  });

  return (
    <Dialog open={isOpen || mutation.isPending} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <span>Upload</span>
          <UploadIcon className="w-4 h-4 ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-normal">Upload PDF Document</DialogTitle>
          <DialogDescription className="text-muted-foreground font-light">
            Please select a PDF document from your device to upload and generate
            embeddings.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={mutation.isPending}>
              Cancel
            </Button>
          </DialogClose>
          <FilePicker
            extensions={["pdf"]}
            maxSize={10}
            onChange={(file: File) => mutation.mutate(file)}
            onError={(error: string) => toast.error(error)}
          >
            <Button disabled={mutation.isPending}>
              {mutation.isPending ? <Spinner /> : "Upload"}
            </Button>
          </FilePicker>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
