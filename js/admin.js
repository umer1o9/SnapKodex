// Firebase SDK loaded from Google CDN — do not bundle or host firebase packages locally.
import {
  collection,
  query,
  orderBy,
  getDocs,
  Timestamp,
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
import { db, auth } from "./firebase-config.js";

// Must match isInboxAdmin() in production/firestore.rules
const ADMIN_ALLOWLIST = ["hello@snapkodex.com"];

const loginGate = document.getElementById("login-gate");
const dashboard = document.getElementById("dashboard");
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");
const signOutBtn = document.getElementById("sign-out");
const messagesBody = document.getElementById("messages-body");
const messagesCards = document.getElementById("messages-cards");
const messagesEmpty = document.getElementById("messages-empty");
const messagesLoading = document.getElementById("messages-loading");

function isSuperAdmin(user) {
  return user && ADMIN_ALLOWLIST.includes(user.email);
}

function formatDate(value) {
  if (!value) return "—";
  const date = value instanceof Timestamp ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function showLogin() {
  loginGate.hidden = false;
  dashboard.hidden = true;
}

function showDashboard() {
  loginGate.hidden = true;
  dashboard.hidden = false;
}

function setLoginError(message) {
  if (!loginError) return;
  if (message) {
    loginError.hidden = false;
    loginError.textContent = message;
  } else {
    loginError.hidden = true;
    loginError.textContent = "";
  }
}

function renderMessages(docs) {
  if (!messagesBody || !messagesCards) return;

  messagesBody.innerHTML = "";
  messagesCards.innerHTML = "";

  if (docs.length === 0) {
    if (messagesEmpty) messagesEmpty.hidden = false;
    return;
  }

  if (messagesEmpty) messagesEmpty.hidden = true;

  docs.forEach((docSnap) => {
    const data = docSnap.data();
    const name = escapeHtml(data.name || "—");
    const email = escapeHtml(data.email || "");
    const message = escapeHtml(data.message || "");
    const date = formatDate(data.createdAt);
    const mailto = email ? `mailto:${data.email}` : "#";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td data-label="Date">${date}</td>
      <td data-label="Name">${name}</td>
      <td data-label="Email"><a href="${mailto}">${email || "—"}</a></td>
      <td data-label="Message">${message}</td>
    `;
    messagesBody.appendChild(row);

    const card = document.createElement("article");
    card.className = "message-card";
    card.innerHTML = `
      <header class="message-card__header">
        <span class="message-card__date">${date}</span>
        <strong class="message-card__name">${name}</strong>
      </header>
      <a class="message-card__email" href="${mailto}">${email || "—"}</a>
      <p class="message-card__body">${message}</p>
    `;
    messagesCards.appendChild(card);
  });
}

async function loadMessages() {
  if (messagesLoading) messagesLoading.hidden = false;
  if (messagesEmpty) messagesEmpty.hidden = true;

  try {
    const messagesRef = collection(db, "snapkodex", "inbox", "messages");
    const q = query(messagesRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    renderMessages(snapshot.docs);
  } catch (err) {
    console.error("Failed to load messages:", err);
    if (messagesEmpty) {
      messagesEmpty.hidden = false;
      messagesEmpty.textContent = "Could not load messages. Check Firestore rules and console.";
    }
  } finally {
    if (messagesLoading) messagesLoading.hidden = true;
  }
}

loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  setLoginError("");

  const email = loginForm.elements.namedItem("email")?.value?.trim() ?? "";
  const password = loginForm.elements.namedItem("password")?.value ?? "";
  const submitBtn = loginForm.querySelector('button[type="submit"]');

  if (!email || !password) {
    setLoginError("Enter email and password.");
    return;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Signing in…";
  }

  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    if (!isSuperAdmin(credential.user)) {
      await signOut(auth);
      setLoginError("This account is not authorized for admin access.");
      return;
    }
    showDashboard();
    await loadMessages();
  } catch (err) {
    console.error("Login failed:", err);
    setLoginError("Invalid email or password.");
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Sign in";
    }
  }
});

signOutBtn?.addEventListener("click", async () => {
  await signOut(auth);
  showLogin();
  setLoginError("");
});

onAuthStateChanged(auth, async (user) => {
  if (user && isSuperAdmin(user)) {
    showDashboard();
    await loadMessages();
  } else {
    if (user) await signOut(auth);
    showLogin();
  }
});
