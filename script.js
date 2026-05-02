const pagesData = [
  `<h2>Bab 1</h2><p>Di suatu pagi yang sunyi, matahari belum sepenuhnya terbit...</p>`,

  `<h2>Bab 2</h2><p>Langkah kaki itu terdengar semakin jelas...</p>`,

  `<h2>Bab 3</h2><p>Rahasia mulai terungkap satu per satu...</p>`
];

const pagesContainer = document.getElementById("pages");

let currentPage = 0;

/* RENDER PAGES */
pagesData.forEach((content, index) => {
  const page = document.createElement("div");
  page.classList.add("page");
  page.style.zIndex = pagesData.length - index;
  page.innerHTML = content;
  pagesContainer.appendChild(page);
});

const pages = document.querySelectorAll(".page");
const frontCover = document.querySelector(".cover.front");
const backCover = document.querySelector(".cover.back");

/* NEXT */
function nextPage() {

  // buka cover depan
  if (currentPage === 0) {
    frontCover.classList.add("flipped");
  }

  // flip halaman
  else if (currentPage <= pages.length) {
    pages[currentPage - 1].classList.add("flipped");
  }

  // MASUK COVER BELAKANG
  else if (currentPage === pages.length + 1) {
    backCover.classList.add("show");
    backCover.classList.add("flipped");
  }

  currentPage++;
}

/* PREV */
function prevPage() {

  // dari cover belakang
  if (currentPage === pages.length + 2) {
    backCover.classList.remove("flipped");
    setTimeout(() => {
      backCover.classList.remove("show");
    }, 500);
  }

  // balik halaman
  else if (currentPage > 1 && currentPage <= pages.length + 1) {
    pages[currentPage - 2].classList.remove("flipped");
  }

  // tutup cover depan
  else if (currentPage === 1) {
    frontCover.classList.remove("flipped");
  }

  currentPage--;
}

/* DARK MODE */
function toggleDark() {
  document.body.classList.toggle("dark");
}