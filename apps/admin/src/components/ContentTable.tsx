import type { ContentItem } from "../types";

type ContentTableProps = {
  title: string;
  items: ContentItem[];
  emptyLabel: string;
};

export function ContentTable({ title, items, emptyLabel }: ContentTableProps) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>{title}</h2>
      </div>

      {items.length === 0 ? (
        <p className="empty-state">{emptyLabel}</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Author</th>
                <th>Category</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.title}</strong>
                    <span className="table-sub">{item.slug}</span>
                  </td>
                  <td>
                    <span className={`status-pill ${item.status.toLowerCase()}`}>{item.status}</span>
                  </td>
                  <td>{item.author.name}</td>
                  <td>{item.category?.name || "Unassigned"}</td>
                  <td>{new Date(item.updatedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
