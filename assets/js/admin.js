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

    const files =
        document.getElementById("chapterImages").files;

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

    if (!files || files.length === 0) {
        alert("Pilih gambar halaman chapter terlebih dahulu!");
        return;
    }


    btn.disabled = true;
    btn.textContent = "Mengupload...";


    try {

        const imageUrls = [];


        // Upload semua gambar
        for (let i = 0; i < files.length; i++) {

            const file = files[i];

            const extension =
                file.name.split(".").pop();

            const fileName =
                `${comicId}/chapter-${chapterNumber}/${String(i + 1).padStart(3, "0")}.${extension}`;


            const { error: uploadError } =
                await db.storage
                    .from("chapters")
                    .upload(fileName, file, {
                        upsert: true
                    });


            if (uploadError) {
                throw uploadError;
            }


            const { data: publicData } =
                db.storage
                    .from("chapters")
                    .getPublicUrl(fileName);


            imageUrls.push(publicData.publicUrl);


            btn.textContent =
                `Mengupload ${i + 1}/${files.length}...`;
        }


        // Simpan data chapter
        const { error: chapterError } =
            await db
                .from("chapters")
                .insert([{
                    comic_id: comicId,
                    chapter_number: Number(chapterNumber),
                    content: JSON.stringify(imageUrls)
                }]);
let chapterFiles = [];


// ==============================
// TAMBAH HALAMAN SATU PER SATU
// ==============================

const btnTambahHalaman =
    document.getElementById("btnTambahHalaman");

if (btnTambahHalaman) {

    btnTambahHalaman.addEventListener("click", function () {

        const input =
            document.getElementById("chapterImage");

        if (!input.files || input.files.length === 0) {

            alert("Pilih gambar halaman dulu!");

            return;
        }


        const file =
            input.files[0];

        chapterFiles.push(file);


        input.value = "";


        document.getElementById("pageCount").textContent =
            chapterFiles.length +
            " halaman sudah ditambahkan.";


        const pageList =
            document.getElementById("pageList");


        const item =
            document.createElement("div");

        item.textContent =
            chapterFiles.length +
            ". " +
            file.name;

        item.style.padding = "8px 0";

        pageList.appendChild(item);

    });

}


// ==============================
// SIMPAN CHAPTER
// ==============================

async function simpanChapter() {

    const comicId =
        document.getElementById("chapterComic").value;

    const chapterNumber =
        document.getElementById("chapterNumber").value;

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


    if (chapterFiles.length === 0) {

        alert("Tambahkan minimal satu halaman!");

        return;
    }


    btn.disabled = true;

    btn.textContent =
        "Mengupload...";


    try {

        const imageUrls = [];


        // ==============================
        // UPLOAD SEMUA HALAMAN
        // ==============================

        for (
            let i = 0;
            i < chapterFiles.length;
            i++
        ) {

            const file =
                chapterFiles[i];


            const extension =
                file.name
                    .split(".")
                    .pop();


            const fileName =
                `${comicId}/chapter-${chapterNumber}/${String(i + 1).padStart(3, "0")}.${extension}`;


            const { error: uploadError } =
                await db.storage
                    .from("chapters")
                    .upload(
                        fileName,
                        file,
                        {
                            upsert: true
                        }
                    );


            if (uploadError) {

                throw uploadError;
            }


            const { data: publicData } =
                db.storage
                    .from("chapters")
                    .getPublicUrl(
                        fileName
                    );


            imageUrls.push(
                publicData.publicUrl
            );


            btn.textContent =
                "Mengupload " +
                (i + 1) +
                "/" +
                chapterFiles.length +
                "...";

        }


        // ==============================
        // SIMPAN DATA CHAPTER
        // ==============================

        const { error: chapterError } =
            await db
                .from("chapters")
                .insert([{

                    comic_id:
                        comicId,

                    chapter_number:
                        Number(chapterNumber),

                    content:
                        JSON.stringify(imageUrls)

                }]);


        if (chapterError) {

            throw chapterError;
        }


        alert(
            "✅ Chapter " +
            chapterNumber +
            " berhasil ditambahkan!\n\n" +
            chapterFiles.length +
            " halaman berhasil diupload."
        );


        // Bersihkan form

        chapterFiles = [];

        document.getElementById(
            "chapterNumber"
        ).value = "";

        document.getElementById(
            "pageList"
        ).innerHTML = "";

        document.getElementById(
            "pageCount"
        ).textContent =
            "Belum ada halaman.";


    } catch (error) {

        console.error(error);

        alert(
            "❌ Gagal menambahkan chapter:\n" +
            error.message
        );

    }


    btn.disabled = false;

    btn.textContent =
        "Simpan Chapter";
    }


// Hubungkan tombol chapter
const btnChapter =
    document.getElementById("btnTambahChapter");

if (btnChapter) {
    btnChapter.addEventListener("click", simpanChapter);
}


// Isi pilihan komik
loadChapterComics();
