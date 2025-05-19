document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("media");

  const previewContainer = document.getElementById("imagePreviewContainer");

  if (!fileInput || !previewContainer) return;

  fileInput.addEventListener("change", () => {
    const files = fileInput.files;

    if (files.length > 5) {
      alert("You can upload a maximum of 5 images");
      fileInput.value = '';
      previewContainer.innerHTML = '';
      return;
    }
    previewContainer.innerHTML = '';

    if (!files.length) return;

    [...files].forEach(file => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = document.createElement("img");

	img.src = e.target.result;
	img.alt = "Preview";
	img.style.width = "100px";
	img.style.height = "auto";
	img.style.margin = "8px";
	img.style.borderRadius = "6px";

	previewContainer.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
  });
});
