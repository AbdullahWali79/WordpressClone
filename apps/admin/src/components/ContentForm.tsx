import { useState, type FormEvent } from "react";
import type { Category, ContentStatus } from "../types";

type ContentFormProps = {
  label: string;
  categories: Category[];
  onSubmit: (payload: {
    title: string;
    slug: string;
    excerpt: string;
    body: string;
    featuredImage: string;
    status: ContentStatus;
    categoryId: string;
    authorEmail: string;
  }) => Promise<void>;
};

const initialState = {
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  featuredImage: "",
  status: "DRAFT" as ContentStatus,
  categoryId: "",
  authorEmail: "admin@wpclone.local"
};

export function ContentForm({ label, categories, onSubmit }: ContentFormProps) {
  const [form, setForm] = useState(initialState);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await onSubmit(form);
      setForm(initialState);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>{label}</h2>
      </div>
      <form className="content-form" onSubmit={handleSubmit}>
        <label>
          Title
          <input
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            required
          />
        </label>
        <label>
          Slug
          <input
            value={form.slug}
            onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
            required
          />
        </label>
        <label>
          Excerpt
          <textarea
            rows={2}
            value={form.excerpt}
            onChange={(event) => setForm((current) => ({ ...current, excerpt: event.target.value }))}
          />
        </label>
        <label>
          Body
          <textarea
            rows={6}
            value={form.body}
            onChange={(event) => setForm((current) => ({ ...current, body: event.target.value }))}
            required
          />
        </label>
        <label>
          Featured Image URL
          <input
            value={form.featuredImage}
            onChange={(event) => setForm((current) => ({ ...current, featuredImage: event.target.value }))}
          />
        </label>
        <label>
          Status
          <select
            value={form.status}
            onChange={(event) =>
              setForm((current) => ({ ...current, status: event.target.value as ContentStatus }))
            }
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="SCHEDULED">Scheduled</option>
          </select>
        </label>
        <label>
          Category
          <select
            value={form.categoryId}
            onChange={(event) => setForm((current) => ({ ...current, categoryId: event.target.value }))}
          >
            <option value="">No category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Author Email
          <input
            type="email"
            value={form.authorEmail}
            onChange={(event) => setForm((current) => ({ ...current, authorEmail: event.target.value }))}
            required
          />
        </label>

        {error ? <p className="form-error">{error}</p> : null}

        <button className="primary-button" type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Item"}
        </button>
      </form>
    </section>
  );
}
