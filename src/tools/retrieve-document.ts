import { EmbeddingService } from "@/services/embeddings";
import { tool } from "ai";
import { z } from "zod";

export function retrieveDocumentsTool(userId: string) {
  return tool({
    description:
      "Searches the user's uploaded PDF documents for information relevant to answering the user's question",
    inputSchema: z.object({
      query: z.string().describe("the search query"),
    }),
    execute: async ({ query }) => {
      const docs = await EmbeddingService.getVectorStore(query, userId);
      return docs.map((doc) => ({
        pageContent: doc.pageContent,
        metadata: doc.metadata,
      }));
    },
  });
}
