const form = document.getElementById("loginForm");
const submitBtn = document.getElementById("submitBtn");
const loader = document.getElementById("loading");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = form.email.value.trim();
  const password = form.password.value;

  submitBtn.disabled = true;
  loader.style.display = "inline-block";

  try {
    const res = await fetch('/api/auth/login', {
      method: "POST",
      headers: {
	"Content-Type" : "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
     localStorage.setItem("userId", data.user._id);
     alert(data.message);
     window.location.href = "index.html";
    } else {
      alert(data.message || "Login failed");
    }
  } catch (error) {
    console.error("Error logging in:", error);
    alert("Something went wrong");
  } finally {
    submitBtn.disabled = false;
    loader.style.display = "none";
  }
});
