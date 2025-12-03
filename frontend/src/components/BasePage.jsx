import React from "react";

export default function BasePage({ title, children }) {
  return (
    <div>
      {title && <h1 style={{ marginBottom: 12 }}>{title}</h1>}
      <div>{children}</div>
    </div>
  );
}
