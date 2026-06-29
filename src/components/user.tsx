"use client";

import { Show, UserButton } from "@clerk/nextjs";
import { Coins } from "lucide-react";

export function User() {
  return (
    <Show when="signed-in">
      <UserButton>
        <UserButton.MenuItems>
          <UserButton.Link
            label="Pricing Page"
            labelIcon={<Coins size={16} />}
            href="/pricing"
          />
        </UserButton.MenuItems>
      </UserButton>
    </Show>
  );
}
