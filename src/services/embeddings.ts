import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export abstract class EmbeddingService {
  constructor() {}
  static async generateDocsEmbeddings(content: string) {
    const document = new Document({
      pageContent: content,
      metadata: {},
    });
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const chunks = await splitter.splitDocuments([document]);
    const embeddings = new OpenAIEmbeddings({
      model: "text-embedding-3-large",
      apiKey: process.env.OPENAI_API_KEY,
    });
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
}
