const komik = JSON.parse(localStorage.getItem("komik")) || [];

function tampilkan(data) {
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
    const kata = document.getElementById("search").value.toLowerCase();

    const hasil = komik.filter(item =>
        item.judul.toLowerCase().includes(kata)
    );

    tampilkan(hasil);
}

tampilkan(komik);
