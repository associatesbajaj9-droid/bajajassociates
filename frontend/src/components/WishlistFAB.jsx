import React, { useState, useEffect, useRef } from "react";
import { FaHeart, FaTimes, FaWhatsapp, FaTrash, FaShoppingBag } from "react-icons/fa";
import { useWishlist } from "../contexts/WishlistContext";
import OptimizedImage from "./OptimizedImage";
import "./WishlistFAB.css";

const WA_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "9111999271";

/* ── Helper: send enquiry to WhatsApp ── */
function buildWhatsAppUrl(wishlist) {
  const msg = wishlist
    .map((item, idx) => `${idx + 1}. ${item.title} — ${item.price}\n   Image: ${item.image}`)
    .join("\n\n");
  const text = encodeURIComponent(`Hi! I'd like to enquire about:\n\n${msg}`);
  return `https://wa.me/${WA_NUMBER}?text=${text}`;
}

/* ── Wishlist Item Card inside drawer ── */
function WishlistItem({ item }) {
  const { removeFromWishlist } = useWishlist();

  const waUrl = encodeURIComponent(
    `Hi! I'm interested in: ${item.title} (${item.price}).\nImage: ${item.image}`
  );

  return (
    <div className="wl-drawer-item">
      <div className="wl-drawer-img-wrap">
        <OptimizedImage src={item.image} alt={item.title} sizes="80px" />
      </div>
      <div className="wl-drawer-info">
        <p className="wl-drawer-name">{item.title}</p>
        <p className="wl-drawer-price">{item.price}</p>
        <div className="wl-drawer-actions">

          <button
            className="wl-remove-btn"
            onClick={() => removeFromWishlist(item.id)}
            title="Remove"
          >
            <FaTrash size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main FAB + Drawer ── */
export default function WishlistFAB() {
  const { wishlist, clearWishlist } = useWishlist();
  const [open, setOpen] = useState(false);
  const [bounce, setBounce] = useState(false);
  const prevCount = useRef(wishlist.length);

  // Badge bounce animation when count increases
  useEffect(() => {
    if (wishlist.length > prevCount.current) {
      setBounce(true);
      const t = setTimeout(() => setBounce(false), 600);
      return () => clearTimeout(t);
    }
    prevCount.current = wishlist.length;
  }, [wishlist.length]);

  // Close drawer on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Prevent body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (wishlist.length === 0 && !open) return null;

  const sendAll = () => {
    if (!wishlist.length) return;
    window.open(buildWhatsAppUrl(wishlist), "_blank");
    setOpen(false);
  };

  return (
    <>
      {/* ── Backdrop ── */}
      {open && (
        <div
          className="wl-backdrop"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Slide-in Drawer ── */}
      <aside className={`wl-drawer ${open ? "wl-drawer--open" : ""}`} role="dialog" aria-label="Wishlist">
        {/* Header */}
        <div className="wl-drawer-header">
          <div className="wl-drawer-title">
            <FaHeart size={15} style={{ color: "var(--accent)" }} />
            <span>My Wishlist</span>
            <span className="wl-drawer-count">{wishlist.length}</span>
          </div>
          <div className="wl-drawer-header-actions">
            {wishlist.length > 0 && (
              <button className="wl-clear-btn" onClick={clearWishlist} title="Clear all">
                Clear all
              </button>
            )}
            <button className="wl-close-btn" onClick={() => setOpen(false)} aria-label="Close">
              <FaTimes size={16} />
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="wl-drawer-body">
          {wishlist.length === 0 ? (
            <div className="wl-empty">
              <div className="wl-empty-icon"><FaShoppingBag size={32} style={{opacity: 0.3}} /></div>
              <p>Your wishlist is empty</p>
              <span>Add items from any product page</span>
            </div>
          ) : (
            <div className="wl-items-list">
              {wishlist.map((item) => (
                <WishlistItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer CTA */}
        {wishlist.length > 0 && (
          <div className="wl-drawer-footer">
            <p className="wl-footer-summary">
              {wishlist.length} item(s) selected
            </p>
            <button className="wl-send-all-btn" onClick={sendAll}>
              <FaWhatsapp size={18} />
              Send All Enquiries on WhatsApp
            </button>
          </div>
        )}
      </aside>

      {/* ── Floating Action Button ── */}
      <button
        id="wishlist-fab"
        className={`wl-fab ${bounce ? "wl-fab--bounce" : ""} ${open ? "wl-fab--active" : ""}`}
        onClick={() => setOpen((p) => !p)}
        aria-label="View Wishlist"
        title="Wishlist"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        {wishlist.length > 0 && (
          <span className={`wl-fab-badge ${bounce ? "wl-fab-badge--pop" : ""}`}>
            {wishlist.length > 99 ? "99+" : wishlist.length}
          </span>
        )}
        <span className="wl-fab-ripple" />
      </button>
    </>
  );
}
