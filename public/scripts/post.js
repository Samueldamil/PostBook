document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("postForm");
  const userIdInput = document.getElementById("userIdInput");
  const submitBtn = document.getElementById("submitBtn");
  const loader = document.getElementById("loading");
  const userId = localStorage.getItem("userId");

  if (userIdInput && userId) {
    userIdInput.value = userId;
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
	
      submitBtn.disabled = true;
      loader.style.display = "inline-block";

      try {
        const res = await fetch("/api/posts/create", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (res.ok) {
          alert(data.message);
          window.location.href = "index.html";
        } else {
          alert(data.message || "Upload failed");
        }
      } catch (error) {
        console.error("Upload error:", error);
        alert("Something went wrong");
      } finally {
	submitBtn.disabled = false;
	loader.style.display = "none";
      }
    });
  }
});
