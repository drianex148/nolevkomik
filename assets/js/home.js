const daftar = JSON.parse(localStorage.getItem("komik")) || [];

const grid = document.getElementById("grid");

daftar.forEach(komik => {

grid.innerHTML += `
<div class="card">

<img src="${komik.cover}">

<h3>${komik.judul}</h3>

<p>${komik.genre}</p>

</div>
`;

});
