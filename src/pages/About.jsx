import React from "react";
import styles from "../styles/About.module.css";
import { FaInstagram, FaTiktok, FaXTwitter, FaYoutube } from "react-icons/fa6";

const SOCIAL = [
  { href: "https://www.instagram.com/playradarhub/", label: "Instagram", Icon: FaInstagram },
  { href: "https://www.tiktok.com/@playradarhub?is_from_webapp=1&sender_device=pc", label: "TikTok", Icon: FaTiktok },
  { href: "https://youtube.com/@playradarhub?si=0EXOJ8hFkq3XWvma", label: "YouTube", Icon: FaYoutube },
  { href: "https://x.com/playradarhub", label: "X (Twitter)", Icon: FaXTwitter },
];

export default function About() {
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>About PlayRadarHub</h2>
      <p className={styles.paragraph}>
        Hi! I'm the developer of this project, which is just getting started but already aims to grow more and more, bringing accessibility and ease to the reader. Feel free to follow the news and updates!
      </p>
      <p style={{ fontSize: 13, color: "#aaa", marginBottom: 24 }}>
        All the information displayed here is sourced from the IGDB website.
      </p>
      <div className={styles.socialLinks}>
        {SOCIAL.map(({ href, label, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit our ${label} page`}
            style={{ color: "inherit", display: "inline-flex", alignItems: "center" }}
          >
            <Icon size={36} style={{ color: "#fff" }} title={label} />
          </a>
        ))}
      </div>
      <p className={styles.footer}>Thanks for visiting.</p>
    </div>
  );
}
