import { useState, useCallback } from "react";
import { createEditor, Transforms, Editor } from "slate";
import { Slate, Editable, withReact, DefaultElement } from "slate-react";
import { CodeElement, QuoteElement } from "./SlateCustomElements";

const initialValue = [
  {
    type: "paragraph",
    children: [{ text: "A line of text in a paragraph..." }],
  },
  {
    type: "block-quote",
    children: [{ text: "Good quote for live. (useCommand: ctrl + ')" }],
  },
  {
    type: "code",
    children: [{ text: '<SlateEditor kind="good" useCommand="ctrl + `">' }],
  },
];

enum CustomElementType {
  Code = "code",
  Quote = "block-quote",
  Default = "paragraph",
}

const ElementButtonToolbar = (
  elementType: CustomElementType,
  label: string
) => {
  return <button>{label}</button>;
};

export default function SlateEditor() {
  const [editor] = useState(() => withReact(createEditor()));

  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />;
      case "block-quote":
        return <QuoteElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  return (
    <section>
      <Slate editor={editor} value={initialValue}>
        <Editable
          renderElement={renderElement}
          onKeyDown={(event) => {
            // handle block code
            if (event.key === "`" && event.ctrlKey) {
              event.preventDefault();
              const [match] = Editor.nodes(editor, {
                match: (n) => n.type === "code",
              });
              Transforms.setNodes(
                editor,
                { type: match ? "paragraph" : "code" },
                { match: (n) => Editor.isBlock(editor, n) }
              );
            }
            // handle block quote
            if (event.key === "'" && event.ctrlKey) {
              event.preventDefault();
              const [match] = Editor.nodes(editor, {
                match: (n) => n.type === "block-quote",
              });
              Transforms.setNodes(
                editor,
                { type: match ? "paragraph" : "block-quote" },
                { match: (n) => Editor.isBlock(editor, n) }
              );
            }
          }}
        />
      </Slate>
    </section>
  );
}
