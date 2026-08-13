function simpan() {
    const komik = {
        judul: document.getElementById("judul").value,
        cover: document.getElementById("cover").value,
        genre: document.getElementById("genre").value,
        status: document.getElementById("status").value,
        deskripsi: document.getElementById("deskripsi").value
    };

    let daftar = JSON.parse(localStorage.getItem("komik")) || [];

    daftar.push(komik);

    localStorage.setItem("komik", JSON.stringify(daftar));

    alert("Komik berhasil disimpan!");
}
