alert("admin.js berhasil dimuat");

const SUPABASE_URL = "https://ejomjasqzlzcwzevqwjs.supabase.co";
const SUPABASE_KEY = "sb_publishable_Sg46KKG4LgPAginx9MLJkQ_ht3fw0Ua";

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

document.getElementById("btnTambah").addEventListener("click", simpan);

async function simpan(){

    const { error } = await supabase
    .from("comics")
    .insert([{
        title: document.getElementById("judul").value,
        cover: document.getElementById("cover").value,
        genre: document.getElementById("genre").value,
        status: document.getElementById("status").value,
        description: document.getElementById("deskripsi").value
    }]);

    if(error){
        alert(error.message);
        console.log(error);
        return;
    }

    alert("Komik berhasil ditambahkan!");

    document.getElementById("judul").value="";
    document.getElementById("cover").value="";
    document.getElementById("genre").value="";
    document.getElementById("status").value="";
    document.getElementById("deskripsi").value="";
}
const btn = document.getElementById("btnTambah");
if (btn) {
    btn.addEventListener("click", simpan);
}
