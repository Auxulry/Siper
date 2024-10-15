export declare namespace BookDeclaration {
  interface BookDocument {
    _id: string;
    title: string;
    slug: string;
    image: string;
    author: string;
    description: string;
    category: number;
    pages: number;
    publisher: string;
    publishedAt: Date;
    language: string;
    deleted: boolean;
    createdAt: Date;
    updatedAt: Date;
  }

  type BookPayload = {
    title: string;
    image: File;
    author: string;
    description: string;
    category: number;
    pages: number;
    publisher: string;
    publishedAt: Date;
    language: string;
  }
}
