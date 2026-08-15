const SUPABASE_URL = "https://ejomjasqzlzcwzevqwjs.supabase.co";
const SUPABASE_KEY = "sb_publishable_Sg46KKG4LgPAginx9MLJkQ_ht3fw0Ua";

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

document.getElementById("btnTambah").addEventListener("click", async () => {
    try {
        const dataKomik = {
            title: document.getElementById("judul").value,
            cover: document.getElementById("cover").value,
            genre: document.getElementById("genre").value,
            status: document.getElementById("status").value,
            description: document.getElementById("deskripsi").value
        };

        alert("Mengirim data...");

        const { data, error } = await supabase
            .from("comics")
            .insert([dataKomik])
            .select();

        if (error) {
    alert(
      "Message: " + error.message +
      "\nCode: " + error.code +
      "\nDetails: " + error.details +
      "\nHint: " + error.hint
    );
    return;
        }

        alert("BERHASIL!\nID: " + data[0].id);

    } catch (e) {
        alert("ERROR JAVASCRIPT:\n" + e.message);
    }
});
