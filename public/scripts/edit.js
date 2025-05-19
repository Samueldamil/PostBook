const form = document.getElementById("editForm");
const contentInput = document.getElementById("content");
const submitBtn = document.getElementById("submitBtn");
const loader = document.getElementById("loading");

const urlParams = new URLSearchParams(window.location.search);

const postId = urlParams.get("id");

async function loadPost() {
  try {
    const res = await fetch("/api/posts");
    const posts = await res.json();
    const post = posts.find(p => p._id === postId);
	
    if (post) {
      contentInput.value = post.content
    } else {
      alert("Post not found");
    }
  } catch (err) {
    console.error("Error loading post:", err);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const content = contentInput.value;

  submitBtn.disabled = true;
  loader.style.display = "inline-block";
 
  try {
    const res = await fetch(`/api/posts/${postId}`, {
      method: "PUT",
      headers: {
	"Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });
    const data = await res.json();

    if (res.ok) {
      alert("Post updated");
      window.location.href = "index.html";
    } else {
      alert(data.message || "Update failed");
    }
  } catch (err) {
    console.error("Error updating post:", err);
    alert("Something went wrong");
  } finally {
    submitBtn.disabled = false;
    loader.style.display = "none";
  }
});

window.addEventListener("DOMContentLoaded", loadPost);
