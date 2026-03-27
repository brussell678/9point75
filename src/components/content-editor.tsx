import { updateSiteContent } from "@/app/admin/actions";

type ContentEditorProps = {
  sectionKey: string;
  title: string;
  heading: string;
  body: string;
  payload?: Record<string, string>;
};

export function ContentEditor({
  sectionKey,
  title,
  heading,
  body,
  payload = {},
}: ContentEditorProps) {
  return (
    <section className="admin-panel">
      <div className="admin-panel__header">
        <p className="section-heading__eyebrow">Content editor</p>
        <h2>{title}</h2>
      </div>

      <form action={updateSiteContent} className="admin-form">
        <input type="hidden" name="sectionKey" value={sectionKey} />

        <label>
          Heading
          <input type="text" name="heading" defaultValue={heading} />
        </label>

        <label>
          Body
          <textarea name="body" rows={6} defaultValue={body} />
        </label>

        <label>
          Payload JSON
          <textarea name="payload" rows={6} defaultValue={JSON.stringify(payload, null, 2)} />
        </label>

        <button type="submit" className="button button--secondary">
          Save Content
        </button>
      </form>
    </section>
  );
}
