const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");

function openModal() {
  modal.classList.remove("hidden");
  setTimeout(() => {
    modalContent.classList.remove("scale-95", "opacity-0");
    modalContent.classList.add("scale-100", "opacity-100");
  }, 100);
}

function closeModal() {
  modalContent.classList.remove("scale-100", "opacity-100");
  modalContent.classList.add("scale-95", "opacity-0");
  setTimeout(() => {
    modal.classList.add("hidden");
  }, 300);
}

function toggleAccordion(id) {
  const content = document.getElementById(id);

  // Toggle visibility
  content.classList.toggle("hidden");
  content.classList.toggle("block");
}
