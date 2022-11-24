import { useState, useCallback } from "react";
import {
  createEditor,
  Transforms,
  Editor,
  BaseEditor,
  Descendant,
  Element as SlateElement,
} from "slate";
import {
  Slate,
  Editable,
  withReact,
  DefaultElement,
  RenderElementProps,
  ReactEditor,
} from "slate-react";
import { CodeElement, QuoteElement } from "./SlateCustomElements";

type CustomElement = {
  type: "paragraph" | "code" | "block-quote";
  children: CustomText[];
};
type CustomText = { text: string; bold?: true };

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const initialValue: Descendant[] = [
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

export default function SlateEditor() {
  const [editor] = useState(() => withReact(createEditor()));

  const renderElement = useCallback((props: RenderElementProps) => {
    console.log(props);
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
                match: (n) => SlateElement.isElement(n) && n.type === "code",
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
                match: (n) =>
                  SlateElement.isElement(n) && n.type === "block-quote",
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
