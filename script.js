document.addEventListener("DOMContentLoaded", () => {
  // All your existing JS code goes here inside this function
  
  const video = document.getElementById("video");
  const captureBtn = document.getElementById("capture");
  const strip = document.getElementById("strip");
  const countdown = document.getElementById("countdown");
  const welcomeScreen = document.getElementById("welcome-screen");
  const app = document.getElementById("app");
  const startBtn = document.getElementById("start-btn");
  const downloadBtn = document.getElementById("download");
  const resetBtn = document.getElementById("reset");
  const backBtn = document.getElementById("back-btn");
  
  const filterBtn = document.getElementById("toggle-filter"); // ✅ moved here
  let isGrayscale = false;

  if (filterBtn) {
    filterBtn.addEventListener("click", () => {
      console.log("Grayscale toggled:", isGrayscale, video.className);

      isGrayscale = !isGrayscale;
      video.classList.toggle("grayscale", isGrayscale);
    });
  }
 backBtn.addEventListener("click", () => {
  console.log("Back button clicked!");

  app.classList.add("hidden");
  welcomeScreen.classList.remove("hidden");
  document.body.classList.add("no-scroll");

  console.log("Welcome screen display:", welcomeScreen.style.display);
  console.log("App classes:", app.className);

  if (video.srcObject) {
    video.srcObject.getTracks().forEach(track => track.stop());
    video.srcObject = null;
  }

  countdown.textContent = "";
  strip.innerHTML = "";
});

  startBtn.addEventListener("click", () => {
    welcomeScreen.classList.add("hidden");
    app.classList.remove("hidden");
    document.body.classList.remove("no-scroll");

    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        video.srcObject = stream;
      })
      .catch((err) => {
        console.error("Camera error:", err);
        alert("Please allow camera access.");
      });
  });

  captureBtn.addEventListener("click", () => {
    if (strip.children.length >= 4) {
      alert("You already have 4 photos.");
      return;
    }

    let timeLeft = 3;
    countdown.textContent = timeLeft;


    const interval = setInterval(() => {
      timeLeft--;
      if (timeLeft > 0) {
        countdown.textContent = timeLeft;

        const flash = document.getElementById("flash");

// inside your countdown interval when timeLeft hits 0:
if (timeLeft === 0) {
  clearInterval(interval);
  countdown.textContent = "";

  // Flash in
  flash.style.opacity = "1";

  // Flash out after 300ms
  setTimeout(() => {
    flash.style.opacity = "0";
  }, 300);

  // Then do your canvas capture after a slight delay to let flash show
  setTimeout(() => {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");

    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    if (isGrayscale) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
        imageData.data[i] = avg;
        imageData.data[i + 1] = avg;
        imageData.data[i + 2] = avg;
      }
      ctx.putImageData(imageData, 0, 0);
    }

    const imgData = canvas.toDataURL("image/png");
    photoData.push(imgData);
    localStorage.setItem("photoStrip", JSON.stringify(photoData));
  }, 350); // delay capture slightly after flash
}


      } else {
        clearInterval(interval);
        countdown.textContent = "";

        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");

        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

if (isGrayscale) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
        imageData.data[i] = avg;
        imageData.data[i + 1] = avg;
        imageData.data[i + 2] = avg;
      }
      ctx.putImageData(imageData, 0, 0);
    }

        const img = document.createElement("img");
        img.src = canvas.toDataURL("image/png");
        img.className = "w-[550px] mx-auto rounded-xl shadow-md";
        strip.appendChild(img);
      }
    }, 1000);
  });

  downloadBtn.addEventListener("click", () => {
    if (strip.children.length < 4) {
      alert("Take 4 photos before downloading.");
      return;
    }

    html2canvas(strip, {
      scale: 4,
      useCORS: true,
    }).then((canvas) => {
      const link = document.createElement("a");
      link.download = "photo-strip.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  });

  resetBtn.addEventListener("click", () => {
    strip.innerHTML = "";
  });

});
