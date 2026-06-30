import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-large",
  apiKey: process.env.OPENAI_API_KEY,
});

export abstract class EmbeddingService {
  constructor() {}
  static async generateDocsEmbeddings(content: string, userId: string) {
    const document = new Document({
      pageContent: content,
      metadata: {
        userId,
      },
    });
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const chunks = await splitter.splitDocuments([document]);
    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      embeddings,
      {
        url: process.env.QDRANT_URL,
        collectionName: "rag-chatbot",
      },
    );
    await vectorStore.addDocuments(chunks);
    return {
      success: true,
      message: "embeddings created and stored successfully",
    };
  }
  static async getVectorStore(query: string, userId: string) {
    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      embeddings,
      {
        url: process.env.QDRANT_URL,
        collectionName: "rag-chatbot",
      },
    );
    const context = await vectorStore.similaritySearch(query, 5, {
      must: [
        {
          key: "metadata.userId",
          match: {
            value: userId,
          },
        },
      ],
    });
    return context;
  }
}
