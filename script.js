const video = document.getElementById('video');
const canvas = document.getElementById('dotCanvas');
const ctx = canvas.getContext('2d');
const videoUpload = document.getElementById('videoUpload');
const customUploadBtn = document.getElementById('customUploadBtn');
const playPauseBtn = document.getElementById('playPauseBtn');

// Route custom button click to hidden file input
customUploadBtn.addEventListener('click', () => videoUpload.click());

videoUpload.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const fileURL = URL.createObjectURL(file);
        video.src = fileURL;
        playPauseBtn.disabled = false;
        video.muted = false; 
        video.play();
    }
});

playPauseBtn.addEventListener('click', function() {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
});

video.addEventListener('play', () => {
    function renderFrame() {
        if (video.paused || video.ended) return;

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const frameData = tempCtx.getImageData(0, 0, canvas.width, canvas.height).data;

        // True pitch-black background for maximum matrix contrast
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // --- THE PIXELATION CONTROLS ---
        // Changed from 8 to 14. Higher number = bigger, chunkier pixel dots.
        const sampleSize = 14; 

        for (let y = 0; y < canvas.height; y += sampleSize) {
            for (let x = 0; x < canvas.width; x += sampleSize) {
                
                const pixelIndex = (y * canvas.width + x) * 4;
                const r = frameData[pixelIndex];
                const g = frameData[pixelIndex + 1];
                const b = frameData[pixelIndex + 2];

                ctx.beginPath();
                
                // Changing the math here (dividing by 3.2) shrinks the actual dot 
                // inside its grid square, leaving a crisp black grid gap between them.
                const dotRadius = sampleSize / 3.2; 
                
                ctx.arc(x + sampleSize/2, y + sampleSize/2, dotRadius, 0, Math.PI * 2);
                ctx.fillStyle = `rgb(${r},${g},${b})`;
                ctx.fill();
            }
        }

        requestAnimationFrame(renderFrame);
    }
    renderFrame();
});