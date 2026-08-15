const SUPABASE_URL = "https://ejomjasqzlzcwzevqwjs.supabase.co";
const SUPABASE_KEY = "sb_publishable_Sg46KKG4LgPAginx9MLJkQ_ht3fw0Ua";

const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const btn = document.getElementById("btnTambah");

btn.addEventListener("click", simpan);

async function simpan() {

    btn.disabled = true;
    btn.textContent = "Menyimpan...";

    const komik = {
        title: document.getElementById("judul").value.trim(),
        cover: document.getElementById("cover").value.trim(),
        genre: document.getElementById("genre").value.trim(),
        status: document.getElementById("status").value.trim(),
        description: document.getElementById("deskripsi").value.trim()
    };

    try {

        const { error } = await db
            .from("comics")
            .insert([komik]);

        if (error) {
            alert("Gagal menyimpan:\n" + error.message);
            return;
        }

        alert("✅ Komik berhasil ditambahkan!");

        document.getElementById("judul").value = "";
        document.getElementById("cover").value = "";
        document.getElementById("genre").value = "";
        document.getElementById("status").value = "";
        document.getElementById("deskripsi").value = "";

    } catch (error) {

        alert("Error:\n" + error.message);

    } finally {

        btn.disabled = false;
        btn.textContent = "Tambah Komik";

    }
}
