import React, { useEffect, useRef } from "react";
import "./SlideOver.css";
import { FaTimes } from "react-icons/fa";
import { SearchFilters } from "./SearchFilters";

export default function SlideOver({ open, onClose, searchTerm, filters, onSearchChange, onFilterChange }) {
  const panelRef = useRef(null);
  const firstFocusRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const prevActive = document.activeElement;
    // focus first focusable element inside panel after open
    const timer = setTimeout(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable && focusable.length) focusable[0].focus();
    }, 50);

    function handleKey(e) {
      if (e.key === "Escape") onClose && onClose();
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = Array.from(panel.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter(el => !el.disabled);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKey);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleKey);
      // restore focus
      try { prevActive && prevActive.focus(); } catch (e) {}
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <>
      <div className="slideover-overlay" onClick={onClose} />
      <aside ref={panelRef} className="slideover-panel" role="dialog" aria-modal="true" aria-label="Search and filters">
        <div className="slideover-header">
          <h3>Search & Filters</h3>
          <button className="slideover-close" onClick={onClose} aria-label="Close search panel"><FaTimes /></button>
        </div>
        <div className="slideover-content">
          <SearchFilters
            searchTerm={searchTerm}
            filters={filters}
            onSearchChange={onSearchChange}
            onFilterChange={onFilterChange}
          />
        </div>
      </aside>
    </>
  );
}
