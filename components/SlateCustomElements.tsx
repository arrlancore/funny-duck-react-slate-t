export const CodeElement = (props) => {
  return (
    <code style={{ background: "#efefef" }} {...props.attributes}>
      {props.children}
    </code>
  );
};

export const QuoteElement = (props) => {
  return (
    <blockquote
      style={{
        borderLeft: "2px solid #ddd",
        marginLeft: "0",
        marginRight: "0",
        paddingLeft: "10px",
        color: "#aaa",
        fontStyle: "italic",
      }}
      {...props.attributes}
    >
      {props.children}
    </blockquote>
  );
};

export const DefaultElement = (props) => {
  return <p {...props.attributes}>{props.children}</p>;
};
