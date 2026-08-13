function cariKomik() {
    const input = document
        .getElementById("search")
        .value
        .toLowerCase();

    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        const judul = card.dataset.title.toLowerCase();

        if (judul.includes(input)) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });
}
