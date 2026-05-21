const AUTH_KEY = "qd_super_admin_auth";
const DEFAULT_EMAIL = "admin@quickdoctor.ie";
const DEFAULT_PASSWORD = "admin123";

if (localStorage.getItem(AUTH_KEY) === "1") {
  window.location.href = "./index.html";
}

const form = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorEl = document.getElementById("login-error");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;

  if (email === DEFAULT_EMAIL && password === DEFAULT_PASSWORD) {
    localStorage.setItem(AUTH_KEY, "1");
    window.location.href = "./index.html";
    return;
  }

  errorEl.textContent = "Invalid credentials. Please use the default credentials shown below.";
});
