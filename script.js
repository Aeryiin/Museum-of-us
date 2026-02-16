window.addEventListener("DOMContentLoaded", () => {
  /* =========================
     HELPERS
     ========================= */
  const $ = (id) => document.getElementById(id);

  const isInIframe = () => window.parent && window.parent !== window;
  const parentDoc = () => (isInIframe() ? window.parent.document : null);

  const showToast = (message) => {
    const toast = $("toast");
    const toastText = $("toastText");
    const toastClose = $("toastClose");

    if (!toast || !toastText) return;

    toastText.textContent = message;
    toast.style.display = "flex";

    const close = () => {
      toast.style.display = "none";
    };

    if (toastClose) toastClose.onclick = close;
    toast.onclick = (e) => {
      if (e.target === toast) close();
    };
};


const lockedExhibit3 = $("lockedExhibit3");
if (lockedExhibit3) {
  lockedExhibit3.addEventListener("click", (e) => {
    const unlocked = sessionStorage.getItem("exhibit3Unlocked");
    if (!unlocked) {
      e.preventDefault();
      e.stopPropagation();
      showToast("Hold on, love… ♡ No skipping po hehe, go through each exhibit first");
    }
  }); 
}

if (isInIframe()) {
  const page = document.body?.dataset?.page;

  if (page !== "exhibit3" && typeof window.parent.setMuseumTrack === "function") {
    window.parent.setMuseumTrack("assets/valentine.mp3", false);
  }
}

/* =========================
   EXHIBIT 2: Unlock Exhibit 03 when clicking "Next Exhibit"
   ========================= */
  const finaleLink = $("finaleLink");
  if (finaleLink) {
    finaleLink.addEventListener("click", () => {
      sessionStorage.setItem("exhibit3Unlocked", "1");
    });
  }


  /* =========================
     INDEX: HUG MODAL + ENTER
     ========================= */
  const enterBtn = $("enterBtn");
  const hugModal = $("hugModal");
  const confirmHug = $("confirmHug");

  if (enterBtn && hugModal) {
    enterBtn.addEventListener("click", () => {
      hugModal.style.display = "flex";
    });
  }

  if (confirmHug && hugModal) {
    confirmHug.addEventListener("click", () => {
      if (isInIframe() && typeof window.parent.startMuseumMusic === "function") {
        window.parent.startMuseumMusic();
      }

      hugModal.style.display = "none";

      if (isInIframe() && window.parent.frames && window.parent.frames["museumFrame"]) {
        window.parent.frames["museumFrame"].location.href = "gallery.html";
      } else {
        window.location.href = "gallery.html";
      }
    });
  }

  if (hugModal) {
    hugModal.addEventListener("click", (e) => {
      if (e.target === hugModal) hugModal.style.display = "none";
    });
  }

  /* =========================
     MUSIC TOGGLE (button inside iframe pages)
     ========================= */
  const musicToggle = $("musicToggle");
  if (musicToggle && isInIframe()) {
    const music = parentDoc()?.getElementById("bgMusic");

    if (music) {
      const syncText = () => {
        musicToggle.textContent = music.paused ? "♫ Music" : "♫ Pause";
      };

      syncText();

      musicToggle.addEventListener("click", () => {
        if (music.paused) {
          if (typeof window.parent.startMuseumMusic === "function") {
            window.parent.startMuseumMusic();
          } else {
            music.volume = 0.25;
            music.play().catch(() => {});
          }
        } else {
          music.pause();
        }
        syncText();
      });

      music.addEventListener("play", syncText);
      music.addEventListener("pause", syncText);
    }
  }

  /* =========================
   TOAST: show one-time message if set
   ========================= */
const toastMsg = sessionStorage.getItem("toastMessage");
if (toastMsg) showToast(toastMsg);


  /* =========================
     EXHIBIT 3: "BEFORE YOU READ" POPUP + SWITCH SONG
     Only runs if <body data-page="exhibit3">
     ========================= */

  if (document.body?.dataset?.page === "exhibit3") {

    const unlocked = sessionStorage.getItem("exhibit3Unlocked");
    if (!unlocked) {
      sessionStorage.setItem(
        "toastMessage",
        "Hold on, love… ♡ Exhibit 03 is the finale. Please finish Exhibit 02 first."
      );

      if (isInIframe() && window.parent.frames && window.parent.frames["museumFrame"]) {
        window.parent.frames["museumFrame"].location.href = "exhibit2.html";
      } else {
        window.location.href = "exhibit2.html";
      }
      return;
    }

    const beforeReadModal = $("beforeReadModal");
    const proceedLetter = $("proceedLetter");
    const pageContent = document.querySelector(".page-content");

    if (beforeReadModal) {
      beforeReadModal.style.display = "flex";
      if (pageContent) pageContent.classList.add("blurred");
    }

    if (proceedLetter && beforeReadModal) {
      proceedLetter.addEventListener("click", () => {
        beforeReadModal.style.display = "none";
        if (pageContent) pageContent.classList.remove("blurred");

        if (isInIframe() && typeof window.parent.setMuseumTrack === "function") {
          window.parent.setMuseumTrack("assets/bawatpiyesa.mp3", true);
        } else if (isInIframe() && typeof window.parent.startMuseumMusic === "function") {
          window.parent.startMuseumMusic();
        }
      });
    }

    if (beforeReadModal) {
      beforeReadModal.addEventListener("click", (e) => {
        if (e.target === beforeReadModal) beforeReadModal.style.display = "none";
      });
    }
  }

  /* =========================
     LIGHTBOX (Exhibit photo popup + shutter sound)
     ========================= */
  const lightbox = $("lightbox");
  const lightboxImg = $("lightboxImg");
  const lightboxCaption = $("lightboxCaption");

  if (lightbox && lightboxImg && lightboxCaption) {
    const clickSound = new Audio("assets/sounds/click.mp3");
    clickSound.volume = 0.4;

    const openLightbox = (src, alt, caption) => {
      clickSound.currentTime = 0;
      clickSound.play().catch(() => {});

      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");

      lightboxImg.src = src;
      lightboxImg.alt = alt || "";
      lightboxCaption.textContent = caption || "";

      document.body.style.overflow = "hidden";
    };

    const closeLightbox = () => {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");

      lightboxImg.src = "";
      lightboxCaption.textContent = "";
      document.body.style.overflow = "";
    };

    document.querySelectorAll(".moment").forEach((card) => {
      card.addEventListener("click", () => {
        const img = card.querySelector("img");
        if (!img) return;

        const caption =
          card.dataset.caption ||
          card.querySelector("figcaption")?.innerText ||
          "";

        openLightbox(img.src, img.alt, caption);
      });
    });

    lightbox.addEventListener("click", (e) => {
      if (e.target.matches("[data-close]")) closeLightbox();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightbox.classList.contains("is-open")) {
        closeLightbox();
      }
    });
  }
});
