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
} from "../ui/dialog";
import { Button } from "../ui/button";
import { TriangleAlertIcon } from "lucide-react";
import { Spinner } from "../ui/spinner";

export function DeleteMessages() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete("/api/messages");
      return data;
    },
    onSuccess: () => {
      toast.success("Successfully deleted messages");
      queryClient.invalidateQueries({
        queryKey: ["messages"],
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
        <Button size="icon" variant="destructive">
          <TriangleAlertIcon className="text-red-500" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-normal">
            Are you absolutely sure?
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-light">
            This action cannot be undone. This will permanently delete your
            messages from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={mutation.isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? <Spinner /> : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
