const SUPABASE_URL = "PASTE_PROJECT_URL";
const SUPABASE_KEY = "PASTE_PUBLISHABLE_KEY";

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

async function simpan() {
    const { error } = await supabase
        .from("comics")
        .insert([
            {
                title: document.getElementById("judul").value,
                cover: document.getElementById("cover").value,
                genre: document.getElementById("genre").value,
                status: document.getElementById("status").value,
                description: document.getElementById("deskripsi").value
            }
        ]);

    if (error) {
        alert(error.message);
    } else {
        alert("Komik berhasil ditambahkan!");
    }
}
