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
// ==============================
// KELOLA / HAPUS CHAPTER
// ==============================

const deleteChapterComic =
    document.getElementById("deleteChapterComic");

const deleteChapterSelect =
    document.getElementById("deleteChapterSelect");


// Isi daftar komik untuk hapus chapter
async function loadDeleteChapterComics() {

    if (!deleteChapterComic) return;

    const { data, error } = await db
        .from("comics")
        .select("id, title")
        .order("title");

    if (error) {
        alert(
            "Gagal memuat daftar komik:\n" +
            error.message
        );
        return;
    }

    deleteChapterComic.innerHTML =
        '<option value="">Pilih Komik</option>';

    data.forEach(komik => {

        const option =
            document.createElement("option");

        option.value = komik.id;
        option.textContent = komik.title;

        deleteChapterComic.appendChild(option);

    });
}


// Saat komik dipilih, tampilkan chapternya
if (deleteChapterComic) {

    deleteChapterComic.addEventListener(
        "change",
        async function () {

            const comicId =
                this.value;

            deleteChapterSelect.innerHTML =
                '<option value="">Memuat chapter...</option>';

            if (!comicId) {

                deleteChapterSelect.innerHTML =
                    '<option value="">Pilih Chapter</option>';

                return;
            }


            const { data, error } = await db
                .from("chapters")
                .select("id, chapter_number")
                .eq("comic_id", comicId)
                .order("chapter_number", {
                    ascending: true
                });


            if (error) {

                alert(
                    "Gagal memuat chapter:\n" +
                    error.message
                );

                return;
            }


            deleteChapterSelect.innerHTML =
                '<option value="">Pilih Chapter</option>';


            data.forEach(chapter => {

                const option =
                    document.createElement("option");

                option.value =
                    chapter.id;

                option.textContent =
                    "Chapter " +
                    chapter.chapter_number;

                deleteChapterSelect.appendChild(
                    option
                );

            });

        }
    );

}


// Hapus chapter
const btnHapusChapter =
    document.getElementById("btnHapusChapter");


if (btnHapusChapter) {

    btnHapusChapter.addEventListener(
        "click",
        async function () {

            const chapterId =
                deleteChapterSelect.value;


            if (!chapterId) {

                alert(
                    "Pilih chapter yang mau dihapus!"
                );

                return;
            }


            const yakin =
                confirm(
                    "Yakin ingin menghapus chapter ini?\n\n" +
                    "Data chapter DAN semua gambar halamannya akan dihapus."
                );


            if (!yakin) return;


            btnHapusChapter.disabled = true;

            btnHapusChapter.textContent =
                "Menghapus...";


            try {

                // Ambil data chapter
                const { data: chapter, error: chapterError } =
                    await db
                        .from("chapters")
                        .select(
                            "id, comic_id, chapter_number"
                        )
                        .eq("id", chapterId)
                        .single();


                if (chapterError) {

                    throw chapterError;
                }


                const folder =
                    `${chapter.comic_id}/chapter-${chapter.chapter_number}`;


                // Cari semua gambar di folder chapter
                const { data: files, error: listError } =
                    await db.storage
                        .from("chapters")
                        .list(folder);


                if (listError) {

                    throw listError;
                }


                // Hapus semua gambar
                if (files && files.length > 0) {

                    const filePaths =
                        files.map(file =>
                            `${folder}/${file.name}`
                        );


                    const { error: removeError } =
                        await db.storage
                            .from("chapters")
                            .remove(filePaths);


                    if (removeError) {

                        throw removeError;
                    }

                }


                // Hapus data chapter dari database
                const { error: deleteError } =
                    await db
                        .from("chapters")
                        .delete()
                        .eq("id", chapterId);


                if (deleteError) {

                    throw deleteError;
                }


                alert(
                    "✅ Chapter " +
                    chapter.chapter_number +
                    " berhasil dihapus!"
                );


                // Refresh daftar chapter
                deleteChapterComic.dispatchEvent(
                    new Event("change")
                );


            } catch (error) {

                console.error(error);

                alert(
                    "❌ Gagal menghapus chapter:\n" +
                    error.message
                );

            }


            btnHapusChapter.disabled = false;

            btnHapusChapter.textContent =
                "🗑️ Hapus Chapter";

        }
    );

}


// Isi daftar komik untuk fitur hapus
loadDeleteChapterComics();
// ==============================
// HAPUS KOMIK
// ==============================

const deleteComicSelect =
    document.getElementById("deleteComicSelect");

const btnHapusKomik =
    document.getElementById("btnHapusKomik");


async function loadDeleteComics() {

    if (!deleteComicSelect) return;

    const { data, error } = await db
        .from("comics")
        .select("id, title, cover")
        .order("title");

    if (error) {

        alert(
            "Gagal memuat daftar komik:\n" +
            error.message
        );

        return;
    }

    deleteComicSelect.innerHTML =
        '<option value="">Pilih Komik</option>';

    data.forEach(komik => {

        const option =
            document.createElement("option");

        option.value = komik.id;

        option.textContent =
            komik.title;

        option.dataset.cover =
            komik.cover || "";

        deleteComicSelect.appendChild(
            option
        );

    });
}


if (btnHapusKomik) {

    btnHapusKomik.addEventListener(
        "click",
        async function () {

            const comicId =
                deleteComicSelect.value;

            if (!comicId) {

                alert(
                    "Pilih komik yang mau dihapus!"
                );

                return;
            }


            const option =
                deleteComicSelect.options[
                    deleteComicSelect.selectedIndex
                ];

            const comicTitle =
                option.textContent;


            const yakin =
                confirm(
                    "Yakin ingin menghapus komik:\n\n" +
                    comicTitle +
                    "\n\n" +
                    "Semua chapter dan gambar chapter-nya juga akan dihapus."
                );


            if (!yakin) return;


            btnHapusKomik.disabled = true;

            btnHapusKomik.textContent =
                "Menghapus...";


            try {

                // 1. Ambil semua chapter
                const { data: chapters, error: chapterError } =
                    await db
                        .from("chapters")
                        .select(
                            "id, chapter_number"
                        )
                        .eq("comic_id", comicId);


                if (chapterError) {
                    throw chapterError;
                }


                // 2. Hapus gambar setiap chapter
                for (const chapter of chapters || []) {

                    const folder =
                        `${comicId}/chapter-${chapter.chapter_number}`;


                    const { data: files, error: listError } =
                        await db.storage
                            .from("chapters")
                            .list(folder);


                    if (listError) {
                        throw listError;
                    }


                    if (files && files.length > 0) {

                        const paths =
                            files.map(file =>
                                `${folder}/${file.name}`
                            );


                        const { error: removeError } =
                            await db.storage
                                .from("chapters")
                                .remove(paths);


                        if (removeError) {
                            throw removeError;
                        }

                    }

                }


                // 3. Hapus semua data chapter
                const { error: deleteChaptersError } =
                    await db
                        .from("chapters")
                        .delete()
                        .eq("comic_id", comicId);


                if (deleteChaptersError) {
                    throw deleteChaptersError;
                }


                // 4. Hapus data komik
                const { error: deleteComicError } =
                    await db
                        .from("comics")
                        .delete()
                        .eq("id", comicId);


                if (deleteComicError) {
                    throw deleteComicError;
                }


                // 5. Hapus cover jika berasal dari bucket covers
                const coverUrl =
                    option.dataset.cover;


                if (coverUrl) {

                    const marker =
                        "/storage/v1/object/public/covers/";

                    const index =
                        coverUrl.indexOf(marker);


                    if (index !== -1) {

                        const filePath =
                            decodeURIComponent(
                                coverUrl.substring(
                                    index + marker.length
                                )
                            );


                        await db.storage
                            .from("covers")
                            .remove([
                                filePath
                            ]);
                    }

                }


                alert(
                    "✅ Komik \"" +
                    comicTitle +
                    "\" berhasil dihapus!"
                );


                loadDeleteComics();


            } catch (error) {

                console.error(error);

                alert(
                    "❌ Gagal menghapus komik:\n" +
                    error.message
                );

            }


            btnHapusKomik.disabled = false;

            btnHapusKomik.textContent =
                "🗑️ Hapus Komik";

        }
    );

}


loadDeleteComics();
// ==============================
// EDIT KOMIK
// ==============================

const editComicSelect =
    document.getElementById("editComicSelect");

const btnEditKomik =
    document.getElementById("btnEditKomik");


async function loadEditComics() {

    if (!editComicSelect) return;

    const { data, error } = await db
        .from("comics")
        .select("id, title, cover, genre, status, description")
        .order("title");

    if (error) {

        alert(
            "Gagal memuat komik:\n" +
            error.message
        );

        return;
    }

    editComicSelect.innerHTML =
        '<option value="">Pilih Komik</option>';

    data.forEach(komik => {

        const option =
            document.createElement("option");

        option.value = komik.id;

        option.textContent =
            komik.title;

        option.dataset.title =
            komik.title || "";

        option.dataset.cover =
            komik.cover || "";

        option.dataset.genre =
            komik.genre || "";

        option.dataset.status =
            komik.status || "";

        option.dataset.description =
            komik.description || "";

        editComicSelect.appendChild(option);

    });
}


// Saat memilih komik
if (editComicSelect) {

    editComicSelect.addEventListener(
        "change",
        function () {

            const option =
                this.options[
                    this.selectedIndex
                ];

            if (!this.value) {

                document.getElementById(
                    "editJudul"
                ).value = "";

                document.getElementById(
                    "editGenre"
                ).value = "";

                document.getElementById(
                    "editStatus"
                ).value = "";

                document.getElementById(
                    "editDeskripsi"
                ).value = "";

                return;
            }


            document.getElementById(
                "editJudul"
            ).value =
                option.dataset.title || "";


            document.getElementById(
                "editGenre"
            ).value =
                option.dataset.genre || "";


            document.getElementById(
                "editStatus"
            ).value =
                option.dataset.status || "";


            document.getElementById(
                "editDeskripsi"
            ).value =
                option.dataset.description || "";

        }
    );

}


// Simpan perubahan
if (btnEditKomik) {

    btnEditKomik.addEventListener(
        "click",
        async function () {

            const comicId =
                editComicSelect.value;


            if (!comicId) {

                alert(
                    "Pilih komik terlebih dahulu!"
                );

                return;
            }


            const judul =
                document.getElementById(
                    "editJudul"
                ).value.trim();


            const genre =
                document.getElementById(
                    "editGenre"
                ).value.trim();


            const status =
                document.getElementById(
                    "editStatus"
                ).value.trim();


            const deskripsi =
                document.getElementById(
                    "editDeskripsi"
                ).value.trim();


            if (!judul) {

                alert(
                    "Judul komik tidak boleh kosong!"
                );

                return;
            }


            btnEditKomik.disabled = true;

            btnEditKomik.textContent =
                "Menyimpan...";


            try {

                const updateData = {

                    title: judul,

                    genre: genre,

                    status: status,

                    description: deskripsi

                };


                // Kalau memilih cover baru
                const coverInput =
                    document.getElementById(
                        "editCover"
                    );


                if (
                    coverInput.files &&
                    coverInput.files.length > 0
                ) {

                    const file =
                        coverInput.files[0];


                    const namaFile =
                        Date.now() +
                        "_" +
                        file.name.replace(
                            /[^a-zA-Z0-9._-]/g,
                            "_"
                        );


                    const { error: uploadError } =
                        await db.storage
                            .from("covers")
                            .upload(
                                namaFile,
                                file
                            );


                    if (uploadError) {

                        throw uploadError;
                    }


                    const { data: publicUrlData } =
                        db.storage
                            .from("covers")
                            .getPublicUrl(
                                namaFile
                            );


                    updateData.cover =
                        publicUrlData.publicUrl;

                }


                const { error } =
                    await db
                        .from("comics")
                        .update(updateData)
                        .eq("id", comicId);


                if (error) {

                    throw error;
                }


                alert(
                    "✅ Komik berhasil diperbarui!"
                );


                coverInput.value = "";


                loadEditComics();


                // Refresh dropdown tambah/hapus
                loadChapterComics();

                loadDeleteComics();


            } catch (error) {

                console.error(error);

                alert(
                    "❌ Gagal mengedit komik:\n" +
                    error.message
                );

            }


            btnEditKomik.disabled = false;

            btnEditKomik.textContent =
                "💾 Simpan Perubahan";

        }
    );

}


loadEditComics();
