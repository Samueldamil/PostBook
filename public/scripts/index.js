async function loadPosts() {
  const loader = document.getElementById("loadingPost");
  const emptyMessage = document.getElementById("emptyMessage");
  try {
    loader.style.display = "block";

    const userId = localStorage.getItem("userId");
    const response = await fetch(`/api/posts?userId=${userId}`);
    const posts = await response.json();

    const container = document.getElementById("postsContainer");
    container.innerHTML = '';

    if (posts.length === 0) {
      emptyMessage.style.display = "block";
    } else {
      emptyMessage.style.display = "none";
      
      posts.forEach(post => {
        const postEl = document.createElement("div");
	
	postEl.classList.add("post-item");

        let imagesHtml = '';
        if (Array.isArray(post.fileUrls) && post.fileUrls.length > 0) {
          if (post.fileUrls.length === 1) {
	    imagesHtml = `<div class="single-image"><img src="${post.fileUrls[0]}" alt="Post image" /></div>`
	  } else {
	    imagesHtml = `<div class="image-grid">
	      ${post.fileUrls.map(url => `<img src="${url}" alt="Post image" />`).join('')}
	  </div>`
	  }
        }

        postEl.innerHTML = `
          <p>${post.content}</p>
	  ${imagesHtml}
	  <small>Posted on: ${new Date(post.createdAt).toLocaleString()}</small>
	  <div class="post-actions">
	    <a href="edit.html?id=${post._id}" class="edit-btn">Edit</a>
	    <button class="delete-btn" data-id="${post._id}">Delete</button>
	  </div>
        `;
        container.appendChild(postEl);
      });

      document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", async (e) => {
          const postId = e.target.dataset.id;
          if (confirm("Are you sure you want to delete this post?")) {
            await deletePost(postId);
            loadPosts(); // reload posts after deletion
          }
        });
      });
    }
  } catch (error) {
    console.error("Error loading posts:", error);
  } finally {
    loader.style.display = "none";
  }
}

async function deletePost(postId) {
  try {
   const res = await fetch(`/api/posts/${postId}`, {
     method: "DELETE",
   });
   const data = await res.json();
	
   if (!res.ok) {
     throw new Error(data.message || "Failed to delete");
   }
  } catch (error) {
    console.error("Delete failed:", error);
    alert("Error deleting post");
  }
}

window.addEventListener("DOMContentLoaded", loadPosts);
