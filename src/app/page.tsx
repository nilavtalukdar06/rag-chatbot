import { MessageContainer } from "@/components/chat/message-container";
import { PromptProvider } from "@/components/context/prompt-context";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <div className="h-screen w-full max-w-3xl mx-auto flex flex-col">
      <Navbar />
      <PromptProvider>
        <MessageContainer />
      </PromptProvider>
    </div>
  );
}
