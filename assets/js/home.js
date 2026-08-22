const SUPABASE_URL = "https://ejomjasqzlzcwzevqwjs.supabase.co";
const SUPABASE_KEY = "sb_publishable_Sg46KKG4LgPAginx9MLJkQ_ht3fw0Ua";

const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

let semuaKomik = [];


// ==============================
// LOAD KOMIK
// ==============================

async function loadKomik() {

    const grid =
        document.getElementById("grid");

    if (!grid) return;

    grid.innerHTML =
        "<p>Memuat komik...</p>";


    const { data, error } = await db
        .from("comics")
        .select("*")
        .order("id", {
            ascending: false
        });


    if (error) {

        console.error(error);

        grid.innerHTML =
            "<p>Gagal memuat komik.</p>";

        return;
    }


    semuaKomik = data || [];

    tampilkanKomik(semuaKomik);
}


// ==============================
// TAMPILKAN KOMIK
// ==============================

function tampilkanKomik(daftar) {

    const grid =
        document.getElementById("grid");

    if (!grid) return;


    if (!daftar || daftar.length === 0) {

        grid.innerHTML =
            "<p>Komik tidak ditemukan.</p>";

        return;
    }


    grid.innerHTML = "";


    daftar.forEach(komik => {

        const link =
            document.createElement("a");

        link.href =
            "detail.html?id=" +
            encodeURIComponent(komik.id);

        link.className =
            "comic-link";


        const card =
            document.createElement("div");

        card.className =
            "card";

        card.dataset.title =
            (komik.title || "").toLowerCase();


        const img =
            document.createElement("img");

        img.src =
            komik.cover || "";

        img.alt =
            komik.title || "Cover komik";


        const title =
            document.createElement("h3");

        title.textContent =
            komik.title || "Tanpa Judul";


        const genre =
            document.createElement("p");

        genre.textContent =
            komik.genre || "";


        const status =
            document.createElement("small");

        status.textContent =
            komik.status || "";


        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(genre);
        card.appendChild(status);

        link.appendChild(card);

        grid.appendChild(link);

    });
}


// ==============================
// SEARCH KOMIK
// ==============================

function cariKomik() {

    const input =
        document
            .getElementById("search")
            .value
            .trim()
            .toLowerCase();


    if (!input) {

        tampilkanKomik(semuaKomik);

        return;
    }


    const hasil =
        semuaKomik.filter(komik => {

            const judul =
                (komik.title || "")
                    .toLowerCase();

            return judul.includes(input);

        });


    tampilkanKomik(hasil);
}


loadKomik();
