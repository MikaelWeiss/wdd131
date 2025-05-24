function initialSetup() {
  // If the size class is less than 700px, hide the menu
  if (window.innerWidth < 700) {
    document.getElementById("menu").classList.add("hide")
    console.log(`hide, inner width: ${window.innerWidth}`);
  }

  // Fetch any values or items needed
  const images = document.querySelectorAll(".gallery img");
  const modal = document.getElementById("viewer");

  // Add any listeners
  document.getElementById("menu_button").addEventListener("click", toggleMenu);
  window.addEventListener("resize", handleResize);
  images.forEach(image => {
    image.addEventListener("click", openViewer);
  });
  document.getElementById("close-viewer").addEventListener("click", closeViewer);
  modal.addEventListener("click", closeViewer);

  // Log that we're done
  console.log("Done with initialSetup");
  handleResize();
}

function handleResize() {
  console.log(`resize, inner width: ${window.innerWidth}`);
  if (window.innerWidth > 1000) {
    document.getElementById("menu").classList.remove("hide");
  } else {
    document.getElementById("menu").classList.add("hide");
  }
}

function toggleMenu() {
  // If the size class is less than 700px, hide the menu
  console.log(`toggle, inner width: ${window.innerWidth}`);
  if (window.innerWidth < 700) {
    document.getElementById("menu").classList.toggle("hide");
  }
}

function openViewer(event) {
  const image = event.target;
  document.getElementById("viewer-image").src = image.src;
  document.getElementById("viewer").showModal();
}

function closeViewer() {
  document.getElementById("viewer").close();
}

initialSetup();