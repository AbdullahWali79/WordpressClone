export type ContentStatus = "DRAFT" | "PUBLISHED" | "SCHEDULED";
export type ContentType = "POST" | "PAGE";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  _count?: {
    contents: number;
  };
};

export type Author = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type ContentItem = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  body: string;
  featuredImage?: string | null;
  status: ContentStatus;
  type: ContentType;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  author: Author;
  category: Category | null;
};

export type DashboardResponse = {
  stats: {
    posts: number;
    pages: number;
    categories: number;
    drafts: number;
  };
  recent: ContentItem[];
};
