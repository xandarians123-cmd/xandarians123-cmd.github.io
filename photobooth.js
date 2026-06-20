
const retakeBtn = document.getElementById("retakeBtn");
const templateSelect = document.getElementById("templateSelect");
const templateStylesheet = document.getElementById("templateStylesheet");
const video = document.getElementById("video");
const startBtn = document.getElementById("startBtn");
const countdown = document.getElementById("countdown");
const captureCanvas = document.getElementById("captureCanvas");
const stripCanvas = document.getElementById("stripCanvas");
const downloadBtn = document.getElementById("downloadBtn");
const photoCounter =
    document.getElementById("photoCounter");

const dots =
    document.querySelectorAll(".dot");
const orientationModal =
    document.getElementById("orientationModal");

const closeOrientationModal =
    document.getElementById("closeOrientationModal");

const captureCtx = captureCanvas.getContext("2d");
const stripCtx = stripCanvas.getContext("2d");

let photos = [];
let isRendering = false;

function updateProgress(current) {

    photoCounter.textContent =
        `📷 ${current} / 4`;

    dots.forEach((dot, index) => {

        dot.classList.toggle(
            "active",
            index < current
        );

    });

}

photos = [];

updateProgress(0);

function isPortrait() {

    return window.innerHeight >
        window.innerWidth;

}

// ================= CSS HELPER (IMPORTANT FIX) =================
function getCssVar(name, fallback = "") {
    return getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim() || fallback;
}

function getTheme() {
    const value = templateSelect.value;
    return value; // JAUH lebih aman
}

// ================= CAMERA =================
async function initCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        });

        video.srcObject = stream;

        await new Promise(resolve => {
            video.onloadedmetadata = resolve;
        });

    } catch (error) {
        console.error("Gagal mengakses kamera:", error);
        alert("Tidak dapat mengakses kamera.");
    }
}

initCamera();

// ================= UTILS =================
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ================= START PHOTO SESSION =================
async function startPhotobooth() {

    photos = [];

    startBtn.disabled = true;
    downloadBtn.disabled = true;
    retakeBtn.disabled = true;

    for (let i = 0; i < 4; i++) {

        let timeLeft = 5;
        countdown.textContent = timeLeft;

        const timer = setInterval(() => {
            timeLeft--;
            if (timeLeft >= 0) {
                countdown.textContent = timeLeft;
            }
        }, 1000);

        await wait(5000);
        clearInterval(timer);

        countdown.textContent = "📸";

        await capturePhoto();
        updateProgress(i + 1);
        await wait(400);
    }

    countdown.textContent = "✔";

    startBtn.disabled = false;
    downloadBtn.disabled = false;
    retakeBtn.disabled = false;
}

// ================= CAPTURE =================
async function capturePhoto() {

    captureCanvas.width = video.videoWidth;
    captureCanvas.height = video.videoHeight;

    captureCtx.drawImage(
        video,
        0,
        0,
        captureCanvas.width,
        captureCanvas.height
    );

    const imageData = captureCanvas.toDataURL("image/jpeg");
    photos.push(imageData);

    await renderStrip();
}

// ================= RENDER STRIP (STABLE FIXED) =================
async function renderStrip() {

    if (isRendering) return;
    isRendering = true;

    try {

        const width = 600;
        const height = 1800;

        const ctx = stripCtx;

        stripCanvas.width = width;
        stripCanvas.height = height;

        const theme = getTheme(); // "classic" | "dark" | "pink"

        // ================= RESET =================
        ctx.clearRect(0, 0, width, height);
        ctx.textAlign = "center";

        // ======================================================
        // 🔥 DARK THEME
        // ======================================================
        if (theme === "dark") {

            const bg = ctx.createLinearGradient(0, 0, 0, height);
            bg.addColorStop(0, "#0a0a0a");
            bg.addColorStop(1, "#1a1a1a");

            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, width, height);

            ctx.strokeStyle = "rgba(255,255,255,0.8)";
            ctx.lineWidth = 4;
            ctx.strokeRect(12, 12, width - 24, height - 24);

            ctx.fillStyle = "#fff";
            ctx.font = "bold 44px Cormorant Garamond, serif";
            ctx.fillText("DAFFA & DIVA", width / 2, 120);

            ctx.fillStyle = "rgba(255,255,255,0.6)";
            ctx.font = "18px Inter";
            ctx.fillText("Eternal Night Love", width / 2, 160);

            ctx.fillStyle = "rgba(255,255,255,0.15)";
            ctx.font = "60px serif";
            ctx.fillText("✦", 80, 220);
            ctx.fillText("✦", width - 80, 220);
        }

        // ======================================================
        // 💖 PINK THEME
        // ======================================================
        else if (theme === "pink") {

            const bg = ctx.createLinearGradient(0, 0, 0, height);
            bg.addColorStop(0, "#fff0f5");
            bg.addColorStop(1, "#ffe4ec");

            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, width, height);

            ctx.strokeStyle = "#ff4f88";
            ctx.lineWidth = 6;
            ctx.strokeRect(14, 14, width - 28, height - 28);

            ctx.fillStyle = "#ff4f88";
            ctx.font = "bold 44px Cormorant Garamond, serif";
            ctx.fillText("DAFFA & DIVA", width / 2, 120);

            ctx.fillStyle = "#c2185b";
            ctx.font = "18px Inter";
            ctx.fillText("Sweet Forever Love", width / 2, 160);

            ctx.fillStyle = "rgba(255,79,136,0.25)";
            ctx.font = "60px serif";
            ctx.fillText("❤", 80, 220);
            ctx.fillText("❤", width - 80, 220);
        }

        // ======================================================
        // 🤍 CLASSIC / WEDDING PREMIUM
        // ======================================================
        else {

            const bg = ctx.createLinearGradient(0, 0, 0, height);
            bg.addColorStop(0, "#fffafc");
            bg.addColorStop(0.5, "#ffffff");
            bg.addColorStop(1, "#f7f0f5");

            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, width, height);

            ctx.strokeStyle = "rgba(212, 175, 55, 0.8)";
            ctx.lineWidth = 6;
            ctx.strokeRect(10, 10, width - 20, height - 20);

            ctx.fillStyle = "#b76e79";
            ctx.font = "bold 42px Cormorant Garamond, serif";
            ctx.fillText("DAFFA & DIVA", width / 2, 120);

            ctx.fillStyle = "#7a6a6f";
            ctx.font = "18px Inter";
            ctx.fillText("Our Memories", width / 2, 185);

            ctx.strokeStyle = "rgba(183,110,121,0.4)";
            ctx.beginPath();
            ctx.moveTo(140, 150);
            ctx.lineTo(width - 140, 150);
            ctx.stroke();
        }

        // ======================================================
        // 📸 PHOTOS (COMMON ALL THEMES)
        // ======================================================

        const padding = 50;
        const photoWidth = width - padding * 2;
        const photoHeight = 320;

        for (let i = 0; i < photos.length; i++) {

            const img = new Image();
            img.src = photos[i];

            await new Promise(resolve => {
                img.onload = resolve;
            });

            const y = 230 + i * (photoHeight + 25);

            ctx.shadowColor = "rgba(0,0,0,0.18)";
            ctx.shadowBlur = 20;
            ctx.shadowOffsetY = 10;

            ctx.drawImage(img, padding, y, photoWidth, photoHeight);

            ctx.shadowBlur = 0;
        }

        // ======================================================
        // 📅 FOOTER (COMMON)
        // ======================================================

        const date = new Date().toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });

        ctx.fillStyle = theme === "dark"
            ? "rgba(255,255,255,0.7)"
            : "#6b5b61";

        ctx.font = "20px Inter";
        ctx.fillText(date, width / 2, height - 60);

        ctx.font = "16px Inter";
        ctx.fillText("Forever Starts Here ♥", width / 2, height - 30);

    } finally {
        isRendering = false;
    }
}

// ================= DOWNLOAD =================
downloadBtn.addEventListener("click", () => {

    const link = document.createElement("a");
    link.download = `photobooth-${Date.now()}.png`;
    link.href = stripCanvas.toDataURL("image/png");
    link.click();
});

// ================= TEMPLATE SWITCH (ANTI BUG FIX) =================
templateSelect.addEventListener("change", async () => {

    const value = templateSelect.value;

    templateStylesheet.href = `templates/template-${value}.css`;

    // paksa tunggu 1 frame + repaint
    await new Promise(r => requestAnimationFrame(r));
    await new Promise(r => requestAnimationFrame(r));

    if (photos.length) {
        await renderStrip();
    }
});

// ================= RETAKE =================
retakeBtn.addEventListener("click", async () => {

    photos = [];

    stripCtx.clearRect(
        0,
        0,
        stripCanvas.width,
        stripCanvas.height
    );

    downloadBtn.disabled = true;
    retakeBtn.disabled = true;

    await startPhotobooth();
});

// ================= START =================
startBtn.addEventListener("click", () => {

    if (isPortrait()) {

        orientationModal.classList.add("show");

        return;
    }

    startPhotobooth();

});

closeOrientationModal.addEventListener("click", () => {

    orientationModal.classList.remove("show");

});