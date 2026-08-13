const SUPABASE_URL = "https://ejomjasqzlzcwzevqwjs.supabase.co";
const SUPABASE_KEY = "sb_publishable_Sg46KKG4LgPAginx9MLJkQ_ht3fw0Ua";

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

async function loadKomik() {

    const { data, error } = await supabase
        .from("comics")
        .select("*")
        .order("id", { ascending: false });

    if (error) {
        console.log(error);
        return;
    }

    const grid = document.getElementById("grid");
    grid.innerHTML = "";

    data.forEach(k => {
        grid.innerHTML += `
        <a href="detail.html?id=${k.id}">
            <div class="card">
                <img src="${k.cover}">
                <h3>${k.title}</h3>
                <p>${k.genre}</p>
            </div>
        </a>`;
    });

}

loadKomik();
