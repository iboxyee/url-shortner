const owner = "iboxyee";  // Ganti dengan username GitHub-mu
const repo = "url-shortner";  // Ganti dengan nama repo GitHub-mu
const path = "urls.json";
const token = "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";  // Ganti dengan token baru

async function generateShortURL() {
    let longURL = document.getElementById("longURL").value;
    if (!longURL) return alert("Masukkan URL!");

    let shortCode = Math.random().toString(36).substr(2, 6);

    try {
        let response = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/main/${path}`);
        let json = await response.json();
        json[shortCode] = longURL;
        const content = btoa(JSON.stringify(json, null, 2));

        let sha = await getSha();
        await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
            method: "PUT",
            headers: { "Authorization": `token ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({ message: "Tambah URL", content: content, sha: sha })
        });

        let shortLink = `${window.location.origin}/url-shortner?c=${shortCode}`;
        document.getElementById("result").innerHTML = `URL Pendek: <a href="${shortLink}" target="_blank">${shortLink}</a>`;
    } catch (error) {
        console.error("Error:", error);
        alert("Gagal menyimpan URL!");
    }
}

async function getSha() {
    let res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
        headers: { "Authorization": `token ${token}` }
    });
    let data = await res.json();
    return data.sha;
}

async function redirect() {
    let urlParams = new URLSearchParams(window.location.search);
    let code = urlParams.get("c");
    if (!code) return;

    try {
        let response = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/main/${path}`);
        let json = await response.json();

        if (json[code]) {
            window.location.href = json[code];
        } else {
            document.body.innerHTML = "<h1>URL tidak ditemukan!</h1>";
        }
    } catch (error) {
        console.error("Error:", error);
        document.body.innerHTML = "<h1>Gagal mengambil data URL!</h1>";
    }
}

// Jalankan redirect saat halaman dimuat
redirect();
