"use client";

import Image from "next/image";
import { DeleteMessages } from "./chat/delete-messages";
import { User } from "./user";
import { UploadButton } from "./upload";

export function Navbar() {
  return (
    <header className="p-4 w-full flex justify-between items-center">
      <div className="flex justify-start items-center gap-x-2">
        <Image src="/logo.svg" height={30} width={30} alt="logo_image" />
      </div>
      <div className="flex gap-x-2 items-center">
        <UploadButton />
        <DeleteMessages />
        <User />
      </div>
    </header>
  );
}
