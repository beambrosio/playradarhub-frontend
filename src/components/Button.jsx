import React from "react";

export default function Button({ variant = "primary", href, children, className = "", style = {}, icon = null, iconPosition = "left", ...props }) {
  const cls = ["button-cta", variant, iconPosition === "right" ? "icon-right" : "", className].filter(Boolean).join(" ");
  const iconNode = icon ? <span className="button-icon" aria-hidden="true">{icon}</span> : null;
  const labelNode = <span className="button-label">{children}</span>;
  if (href) {
    return (
      <a className={cls} href={href} style={style} {...props}>
        {iconPosition === "left" && iconNode}
        {labelNode}
        {iconPosition === "right" && iconNode}
      </a>
    );
  }
  return (
    <button className={cls} style={style} {...props}>
      {iconPosition === "left" && iconNode}
      {labelNode}
      {iconPosition === "right" && iconNode}
    </button>
  );
}
