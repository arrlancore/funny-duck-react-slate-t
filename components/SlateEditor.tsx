import React from "react";
import { createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";

const initialValue = [
  {
    type: "paragraph",
    children: [{ text: "A line of text in a paragraph..." }],
  },
];

export default function SlateEditor() {
  const [editor] = React.useState(() => withReact(createEditor()));

  return (
    <section>
      <Slate editor={editor} value={initialValue}>
        <Editable />
      </Slate>
    </section>
  );
}
