const SUPABASE_URL = "https://ejomjasqzlzcwzevqwjs.supabase.co";
const SUPABASE_KEY = "sb_publishable_Sg46KKG4LgPAginx9MLJkQ_ht3fw0Ua";

const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const btn = document.getElementById("btnTambah");

btn.addEventListener("click", simpan);

async function simpan() {

    const judul = document.getElementById("judul").value.trim();
    const file = document.getElementById("cover").files[0];
    const genre = document.getElementById("genre").value.trim();
    const status = document.getElementById("status").value.trim();
    const deskripsi = document.getElementById("deskripsi").value.trim();

    if (!judul) {
        alert("Judul komik belum diisi!");
        return;
    }

    if (!file) {
        alert("Silakan pilih gambar cover!");
        return;
    }

    btn.disabled = true;
    btn.textContent = "Mengupload gambar...";

    try {

        // Buat nama file unik
        const namaFile =
            Date.now() + "_" +
            file.name.replace(/[^a-zA-Z0-9._-]/g, "_");

        // Upload gambar ke Storage
        const { error: uploadError } = await db.storage
            .from("covers")
            .upload(namaFile, file);

        if (uploadError) {
            throw new Error("Upload gambar gagal: " + uploadError.message);
        }

        // Ambil URL gambar
        const { data: publicUrlData } = db.storage
            .from("covers")
            .getPublicUrl(namaFile);

        const coverUrl = publicUrlData.publicUrl;

        btn.textContent = "Menyimpan komik...";

        // Simpan data komik ke database
        const { error: insertError } = await db
            .from("comics")
            .insert([{
                title: judul,
                cover: coverUrl,
                genre: genre,
                status: status,
                description: deskripsi
            }]);

        if (insertError) {
            throw new Error("Gagal menyimpan komik: " + insertError.message);
        }

        alert("✅ Komik berhasil ditambahkan!");

        document.getElementById("judul").value = "";
        document.getElementById("cover").value = "";
        document.getElementById("genre").value = "";
        document.getElementById("status").value = "";
        document.getElementById("deskripsi").value = "";

    } catch (error) {

        alert("❌ " + error.message);

    } finally {

        btn.disabled = false;
        btn.textContent = "Tambah Komik";

    }
        }
