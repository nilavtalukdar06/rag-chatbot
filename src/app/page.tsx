import { PromptProvider } from "@/components/context/prompt-context";
import { User } from "@/components/user";

export default function Home() {
  return (
    <PromptProvider>
      <div className="w-full p-4">
        <User />
      </div>
    </PromptProvider>
  );
}
