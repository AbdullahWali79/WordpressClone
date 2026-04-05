import { useEffect, useState } from "react";
import { api } from "./lib/api";
import { Sidebar } from "./components/Sidebar";
import { StatCard } from "./components/StatCard";
import { ContentTable } from "./components/ContentTable";
import { ContentForm } from "./components/ContentForm";
import { CategoryForm } from "./components/CategoryForm";
import type { Category, ContentItem, DashboardResponse } from "./types";

type View = "dashboard" | "posts" | "pages" | "categories" | "settings";

const emptyDashboard: DashboardResponse = {
  stats: {
    posts: 0,
    pages: 0,
    categories: 0,
    drafts: 0
  },
  recent: []
};

export default function App() {
  const [view, setView] = useState<View>("dashboard");
  const [dashboard, setDashboard] = useState<DashboardResponse>(emptyDashboard);
  const [posts, setPosts] = useState<ContentItem[]>([]);
  const [pages, setPages] = useState<ContentItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [dashboardData, postItems, pageItems, categoryItems] = await Promise.all([
        api.getDashboard(),
        api.getPosts(),
        api.getPages(),
        api.getCategories()
      ]);

      setDashboard(dashboardData);
      setPosts(postItems);
      setPages(pageItems);
      setCategories(categoryItems);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  async function handleCreatePost(payload: Parameters<typeof api.createPost>[0]) {
    await api.createPost(payload);
    await loadData();
    setView("posts");
  }

  async function handleCreatePage(payload: Parameters<typeof api.createPage>[0]) {
    await api.createPage(payload);
    await loadData();
    setView("pages");
  }

  async function handleCreateCategory(payload: Parameters<typeof api.createCategory>[0]) {
    await api.createCategory(payload);
    await loadData();
    setView("categories");
  }

  return (
    <div className="app-shell">
      <Sidebar activeView={view} onChange={(nextView) => setView(nextView as View)} />

      <main className="main-content">
        <header className="hero">
          <div>
            <span className="eyebrow">Publishing control center</span>
            <h1>WordPress-style CMS built in React and TypeScript</h1>
            <p>
              Start with posts, pages, categories, and dashboard analytics. Then extend it with auth,
              media, plugins, and theme controls.
            </p>
          </div>
        </header>

        {error ? <div className="error-banner">{error}</div> : null}
        {loading ? <div className="loading-card">Loading CMS data...</div> : null}

        {!loading && view === "dashboard" ? (
          <div className="stack">
            <section className="stats-grid">
              <StatCard label="Posts" value={dashboard.stats.posts} hint="Published and draft articles" />
              <StatCard label="Pages" value={dashboard.stats.pages} hint="Static website pages" />
              <StatCard label="Categories" value={dashboard.stats.categories} hint="Taxonomy structure" />
              <StatCard label="Drafts" value={dashboard.stats.drafts} hint="Content waiting for review" />
            </section>

            <ContentTable
              title="Recent Updates"
              items={dashboard.recent}
              emptyLabel="Your recent publishing activity will appear here."
            />
          </div>
        ) : null}

        {!loading && view === "posts" ? (
          <div className="two-column">
            <ContentForm label="Create Post" categories={categories} onSubmit={handleCreatePost} />
            <ContentTable title="All Posts" items={posts} emptyLabel="No posts yet." />
          </div>
        ) : null}

        {!loading && view === "pages" ? (
          <div className="two-column">
            <ContentForm label="Create Page" categories={categories} onSubmit={handleCreatePage} />
            <ContentTable title="All Pages" items={pages} emptyLabel="No pages yet." />
          </div>
        ) : null}

        {!loading && view === "categories" ? (
          <div className="two-column">
            <CategoryForm onSubmit={handleCreateCategory} />
            <section className="panel">
              <div className="panel-header">
                <h2>Category Library</h2>
              </div>
              <div className="category-list">
                {categories.map((category) => (
                  <article key={category.id} className="category-card">
                    <div>
                      <strong>{category.name}</strong>
                      <span>{category.slug}</span>
                    </div>
                    <small>{category._count?.contents || 0} items</small>
                  </article>
                ))}
              </div>
            </section>
          </div>
        ) : null}

        {!loading && view === "settings" ? (
          <section className="panel settings-panel">
            <div className="panel-header">
              <h2>Starter Roadmap</h2>
            </div>
            <ul className="roadmap-list">
              <li>Add JWT auth and admin roles.</li>
              <li>Attach a real rich text editor for post/page editing.</li>
              <li>Implement media uploads to local storage or cloud.</li>
              <li>Expose public routes for post/page rendering.</li>
              <li>Build plugin hooks and theme customization options.</li>
            </ul>
          </section>
        ) : null}
      </main>
    </div>
  );
}
