const SUPABASE_URL = "https://ejomjasqzlzcwzevqwjs.supabase.co";
const SUPABASE_KEY = "sb_publishable_Sg46KKG4LgPAginx9MLJkQ_ht3fw0Ua";

const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

async function loadKomik() {

    const grid = document.getElementById("grid");

    if (!grid) {
        console.log("Elemen grid tidak ditemukan");
        return;
    }

    grid.innerHTML = "<p>Memuat komik...</p>";

    const { data, error } = await db
        .from("comics")
        .select("*")
        .order("id", { ascending: false });

    if (error) {
        grid.innerHTML = "<p>Gagal memuat komik.</p>";
        console.error(error);
        return;
    }

    if (!data || data.length === 0) {
        grid.innerHTML = "<p>Belum ada komik.</p>";
        return;
    }

    grid.innerHTML = "";

    data.forEach(komik => {

        grid.innerHTML += `
            <a href="detail.html?id=${komik.id}" class="comic-link">
                <div class="card">
                    <img src="${komik.cover}" alt="${komik.title}">
                    <h3>${komik.title}</h3>
                    <p>${komik.genre || ""}</p>
                    <small>${komik.status || ""}</small>
                </div>
            </a>
        `;

    });
}

loadKomik();
