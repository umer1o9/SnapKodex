// Firebase SDK loaded from Google CDN — do not bundle or host firebase packages locally.
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";
import { db } from "./firebase-config.js";

const form = document.querySelector(".contact__form");
if (!form) {
  console.warn("contact-form: .contact__form not found");
} else {
  const submitBtn = form.querySelector('button[type="submit"]');
  let statusEl = form.querySelector(".contact__status");

  if (!statusEl) {
    statusEl = document.createElement("div");
    statusEl.className = "contact__status";
    statusEl.setAttribute("role", "status");
    statusEl.setAttribute("aria-live", "polite");
    statusEl.hidden = true;
    form.appendChild(statusEl);
  }

  function setStatus(type, message) {
    statusEl.hidden = false;
    statusEl.className = `contact__status contact__status--${type}`;
    statusEl.textContent = message;
  }

  function clearStatus() {
    statusEl.hidden = true;
    statusEl.className = "contact__status";
    statusEl.textContent = "";
  }

  function setLoading(loading) {
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    submitBtn.classList.toggle("is-loading", loading);
    submitBtn.textContent = loading ? "Sending…" : "Send message";
  }

  function getSubmitErrorMessage(err) {
    const code = err?.code ?? "";
    if (code === "permission-denied") {
      const host = window.location.hostname;
      if (host === "127.0.0.1") {
        return "Submission blocked from 127.0.0.1. Open the site at http://localhost instead, or add 127.0.0.1 to your Firebase API key HTTP referrers.";
      }
      return "Submission was blocked. If testing locally, use http://localhost (not 127.0.0.1) and check Firebase API key HTTP referrer settings.";
    }
    if (code === "unavailable" || code === "failed-precondition") {
      return "Could not reach the server. Check your connection and try again.";
    }
    return "Something went wrong. Please try again or email hello@snapkodex.com.";
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearStatus();

    const name = form.elements.namedItem("name")?.value?.trim() ?? "";
    const email = form.elements.namedItem("email")?.value?.trim() ?? "";
    const message = form.elements.namedItem("message")?.value?.trim() ?? "";

    if (!name || !email || !message) {
      setStatus("error", "Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "snapkodex", "inbox", "messages"), {
        name,
        email,
        message,
        createdAt: serverTimestamp(),
        source: window.location.hostname || "snapkodex.com",
      });

      form.reset();
      setStatus("success", "Thanks! Your message was sent. We'll get back to you soon.");
    } catch (err) {
      console.error("Contact form submission failed:", err);
      setStatus("error", getSubmitErrorMessage(err));
    } finally {
      setLoading(false);
    }
  });
}
