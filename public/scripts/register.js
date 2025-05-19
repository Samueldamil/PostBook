const form = document.getElementById("registerForm");
const submitBtn = document.getElementById("submitBtn");
const loader = document.getElementById("loading");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = form.username.value.trim();
  const email = form.email.value.trim();
  const password = form.password.value;

  submitBtn.disabled = true;
  loader.style.display = "inline-block";

  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
	"Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();
    if (res.ok) {
      alert(data.message);
      window.location.href = "login.html"
    } else {
      alert(data.message || "Registration failed");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong");
  } finally {
    submitBtn.disabled = false;
    loader.style.display = "none";
  }
});
