import { UploadIcon } from "lucide-react";
import { Button } from "./ui/button";

export function UploadButton() {
  return (
    <Button>
      <span>Upload</span>
      <UploadIcon />
    </Button>
  );
}
