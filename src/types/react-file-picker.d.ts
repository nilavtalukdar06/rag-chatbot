declare module "react-file-picker" {
  import { ReactNode, FC } from "react";

  export interface FilePickerProps {
    extensions?: string[];
    onChange?: (file: File) => void;
    onError?: (error: string) => void;
    children?: ReactNode;
    maxSize?: number;
    minSize?: number;
    dims?: {
      minWidth?: number;
      maxWidth?: number;
      minHeight?: number;
      maxHeight?: number;
    };
  }

  export const FilePicker: FC<FilePickerProps>;
}
