document.addEventListener('DOMContentLoaded', () => {
    const galleryContainer = document.getElementById('galleryContainer');
    const batchSize = 50; // Jumlah foto yang dimuat per batch
    let allImageLinks = [];
    let imagesLoaded = 0;

    // Fungsi untuk memuat gambar ke dalam galeri
    function loadImages(startIndex, endIndex) {
        const fragment = document.createDocumentFragment();
        for (let i = startIndex; i < endIndex && i < allImageLinks.length; i++) {
            const imageUrl = allImageLinks[i];
            const galleryItem = document.createElement('div');
            galleryItem.classList.add('gallery-item');
            galleryItem.style.backgroundImage = `url('${imageUrl}')`;
            fragment.appendChild(galleryItem);
        }
        galleryContainer.appendChild(fragment);
        imagesLoaded = endIndex > allImageLinks.length ? allImageLinks.length : endIndex;
    }

    // Fungsi untuk mengambil data JSON
    async function fetchImages() {
        try {
            const response = await fetch('images.json'); // Pastikan file images.json ada di direktori yang sama
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allImageLinks = await response.json();
            loadImages(0, batchSize); // Muat batch pertama
        } catch (error) {
            console.error("Gagal memuat daftar gambar:", error);
            galleryContainer.innerHTML = '<p style="color: #ff6b6b; text-align: center;">Gagal memuat galeri. Pastikan file images.json ada dan formatnya benar.</p>';
        }
    }

    // Fungsi untuk handle lazy loading saat scroll
    function handleScroll() {
        // window.innerHeight: tinggi viewport browser
        // window.scrollY: seberapa banyak pengguna telah scroll dari atas
        // document.body.offsetHeight: tinggi total seluruh konten halaman
        // 100 (offset): muat gambar berikutnya 100px sebelum mencapai bagian bawah halaman
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && imagesLoaded < allImageLinks.length) {
            const nextStartIndex = imagesLoaded;
            const nextEndIndex = imagesLoaded + batchSize;
            loadImages(nextStartIndex, nextEndIndex);
        }
    }

    // Panggil fungsi untuk mengambil gambar
    fetchImages();

    // Tambahkan event listener untuk scroll
    window.addEventListener('scroll', handleScroll);
});