import { Content, Category, User } from "@prisma/client";

type ContentWithRelations = Content & {
  author: User;
  category: Category | null;
};

export function serializeContent(content: ContentWithRelations) {
  return {
    id: content.id,
    title: content.title,
    slug: content.slug,
    excerpt: content.excerpt,
    body: content.body,
    featuredImage: content.featuredImage,
    status: content.status,
    type: content.type,
    publishedAt: content.publishedAt,
    createdAt: content.createdAt,
    updatedAt: content.updatedAt,
    author: {
      id: content.author.id,
      name: content.author.name,
      email: content.author.email,
      role: content.author.role
    },
    category: content.category
      ? {
          id: content.category.id,
          name: content.category.name,
          slug: content.category.slug
        }
      : null
  };
}
