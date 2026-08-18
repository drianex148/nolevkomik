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


async function loadChapterComics() {

    const select = document.getElementById("chapterComic");

    if (!select) return;

    const { data, error } = await db
        .from("comics")
        .select("id, title")
        .order("title");

    if (error) {
        alert("Gagal memuat daftar komik:\n" + error.message);
        return;
    }

    select.innerHTML = '<option value="">Pilih Komik</option>';

    data.forEach(komik => {

        const option = document.createElement("option");

        option.value = komik.id;
        option.textContent = komik.title;

        select.appendChild(option);

    });
}


async function simpanChapter() {

    const comicId =
        document.getElementById("chapterComic").value;

    const chapterNumber =
        document.getElementById("chapterNumber").value;

    const content =
        document.getElementById("chapterContent").value.trim();

    const btn =
        document.getElementById("btnTambahChapter");


    if (!comicId) {
        alert("Pilih komik terlebih dahulu!");
        return;
    }

    if (!chapterNumber) {
        alert("Masukkan nomor chapter!");
        return;
    }

    btn.disabled = true;
    btn.textContent = "Menyimpan...";


    const { error } = await db
        .from("chapters")
        .insert([{
    comic_id: comicId,
    chapter_number: Number(chapterNumber),
    content: content
}]);


    if (error) {

        alert("Gagal menyimpan chapter:\n" + error.message);

    } else {

        alert("✅ Chapter berhasil ditambahkan!");

        document.getElementById("chapterNumber").value = "";
        document.getElementById("chapterContent").value = "";

    }


    btn.disabled = false;
    btn.textContent = "Tambah Chapter";

}


// Hubungkan tombol chapter
const btnChapter =
    document.getElementById("btnTambahChapter");

if (btnChapter) {
    btnChapter.addEventListener("click", simpanChapter);
}


// Isi pilihan komik
loadChapterComics();
