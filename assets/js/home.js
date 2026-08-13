const komik = [
  {
    judul: "Komik Pertamaku",
    gambar: "gambar/onee-san-mode.jpg",
    chapter: "Chapter 1",
    link: "detail.html"
  }
];

function tampilkanKomik(data) {
  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  data.forEach(item => {
    grid.innerHTML += `
      <a href="${item.link}">
        <div class="card" data-title="${item.judul}">
          <img src="${item.gambar}">
          <h3>${item.judul}</h3>
          <p>${item.chapter}</p>
        </div>
      </a>
    `;
  });
}

function cariKomik() {
  const keyword = document.getElementById("search").value.toLowerCase();

  const hasil = komik.filter(item =>
    item.judul.toLowerCase().includes(keyword)
  );

  tampilkanKomik(hasil);
}

tampilkanKomik(komik);
