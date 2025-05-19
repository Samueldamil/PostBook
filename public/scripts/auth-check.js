document.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    // Redirect to login if not logged in
    window.location.href = "login.html";
  }
});

document.getElementById("logoutBtn").addEventListener("click", function (e) {
  e.preventDefault();

  localStorage.removeItem("userId");
  window.location.href = "login.html"
});
