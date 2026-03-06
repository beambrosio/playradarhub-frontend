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
    <div className={styles.container} style={{ maxWidth: 800, margin: '0 auto', padding: '32px 16px' }}>
      <h2 className={styles.heading} style={{ fontSize: '2.4rem', color: '#0ff', marginBottom: 24, textAlign: 'center', fontFamily: 'Orbitron, Arial, sans-serif' }}>About PlayRadarHub</h2>
      <div style={{ display: 'grid', gap: 32 }}>
        <section className={styles.section} style={{ background: '#20232a', borderRadius: 12, boxShadow: '0 2px 8px #0004', padding: 24 }}>
          <h3 style={{ color: '#ff9800', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span role="img" aria-label="star">⭐</span> Featured Games
          </h3>
          <p style={{ color: '#ccc', fontSize: 16 }}>Explore our curated list of the most anticipated games. We highlight upcoming releases and trending titles to keep you informed.</p>
        </section>
        <section className={styles.section} style={{ background: '#20232a', borderRadius: 12, boxShadow: '0 2px 8px #0004', padding: 24 }}>
          <h3 style={{ color: '#00bcd4', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span role="img" aria-label="rocket">🚀</span> How It Works
          </h3>
          <p style={{ color: '#ccc', fontSize: 16 }}>PlayRadarHub helps you stay updated on the latest game releases. Use our advanced filters to find games that match your interests, and track performance metrics for your favorite titles.</p>
        </section>
        <section className={styles.section} style={{ background: '#20232a', borderRadius: 12, boxShadow: '0 2px 8px #0004', padding: 24 }}>
          <h3 style={{ color: '#4caf50', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span role="img" aria-label="trophy">🏆</span> Why Choose Us?
          </h3>
          <ul style={{ color: '#ccc', fontSize: 16, paddingLeft: 24 }}>
            <li>Comprehensive game database</li>
            <li>Accurate release dates and platform information</li>
            <li>Easy-to-use interface</li>
          </ul>
        </section>
        <section className={styles.section} style={{ background: '#20232a', borderRadius: 12, boxShadow: '0 2px 8px #0004', padding: 24 }}>
           <h3 className={styles.subheading} style={{ color: '#0ff', fontSize: '1.5rem', marginBottom: 8, fontWeight: 700, letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span role="img" aria-label="globe">🌍</span> Our Mission
          </h3>
          <p className={styles.paragraph} style={{ color: '#ccc', fontSize: 16 }}>We aim to provide a comprehensive and user-friendly platform that keeps gamers informed about the latest releases and trends in the gaming world.</p>
        </section>
        <section className={styles.section} style={{ background: '#20232a', borderRadius: 12, boxShadow: '0 2px 8px #0004', padding: 24 }}>
          <h3 className={styles.subheading} style={{ color: '#00bcd4', fontSize: '1.5rem', marginBottom: 8, fontWeight: 700, letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span role="img" aria-label="calendar">📅</span> Future Roadmap
          </h3>
          <p className={styles.paragraph} style={{ color: '#ccc', fontSize: 16 }}>We are constantly working to improve PlayRadarHub. Upcoming features include personalized game recommendations, community forums, and exclusive content for our users.</p>
        </section>
      </div>
      <div className={styles.socialLinks} style={{ marginTop: 32, display: 'flex', gap: 24, justifyContent: 'center' }}>
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
      <p className={styles.footer} style={{ color: '#aaa', textAlign: 'center', marginTop: 32 }}>Thanks for visiting. Stay tuned for more updates!</p>
    </div>
  );
}
