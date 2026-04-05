import type { Category, ContentItem, ContentStatus, DashboardResponse } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

type ContentPayload = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  featuredImage: string;
  status: ContentStatus;
  categoryId: string;
  authorEmail: string;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json"
    },
    ...init
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed." }));
    throw new Error(error.message || "Request failed.");
  }

  return response.json() as Promise<T>;
}

export const api = {
  getDashboard() {
    return request<DashboardResponse>("/api/dashboard");
  },
  getPosts() {
    return request<ContentItem[]>("/api/posts");
  },
  getPages() {
    return request<ContentItem[]>("/api/pages");
  },
  getCategories() {
    return request<Category[]>("/api/categories");
  },
  createPost(payload: ContentPayload) {
    return request<ContentItem>("/api/posts", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  createPage(payload: ContentPayload) {
    return request<ContentItem>("/api/pages", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  createCategory(payload: Pick<Category, "name" | "slug" | "description">) {
    return request<Category>("/api/categories", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  }
};
