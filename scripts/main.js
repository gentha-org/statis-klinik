$(function () {
  $(window).on("load", function () {
    setTimeout(() => {
      $("#preloader").addClass("opacity-0 pointer-events-none");
      setTimeout(() => $("#preloader").addClass("hidden"), 700);
    }, 500);
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          $(entry.target).addClass("active");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  $(".reveal").each(function () {
    revealObserver.observe(this);
  });

  // Status Operasional Klinik Real-time
  function perbaruiStatusKlinik() {
    const teksStatus = "Klinik Buka 24 Jam";
    const warnaDot = "bg-green-500";
    const teksBadge = "OPEN";

    $("#status-text").text(teksStatus);
    $("#status-dot").attr(
      "class",
      `w-2.5 h-2.5 rounded-full ${warnaDot} animate-pulse`
    );

    $("#status-indicator-mobile").removeClass("hidden").html(`
            <span class="w-1.5 h-1.5 rounded-full ${warnaDot} animate-pulse"></span>
            ${teksBadge}
        `);
  }
  perbaruiStatusKlinik();
  setInterval(perbaruiStatusKlinik, 60000);

  // Mode Gelap
  const gantiTema = () => {
    if ($("html").hasClass("dark")) {
      $("html").removeClass("dark");
      localStorage.setItem("theme", "light");
    } else {
      $("html").addClass("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  if (
    localStorage.getItem("theme") === "dark" ||
    (!localStorage.getItem("theme") &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    $("html").addClass("dark");
  }

  $("#theme-toggle, #theme-toggle-mobile").click(function () {
    gantiTema();
    $(this).find("i").toggleClass("fa-moon fa-sun");
  });

  // Sidebar Navigasi
  const bukaSidebar = () => {
    $("#mobile-sidebar").removeClass("translate-x-full");
    $("#sidebar-overlay").removeClass("hidden").addClass("block");
    setTimeout(() => $("#sidebar-overlay").addClass("opacity-100"), 10);
    $("body").addClass("overflow-hidden");
    $("#speed-dial-container").addClass("hidden-dial");
  };

  const tutupSidebar = () => {
    $("#mobile-sidebar").addClass("translate-x-full");
    $("#sidebar-overlay").removeClass("opacity-100");
    setTimeout(() => {
      $("#sidebar-overlay").removeClass("block").addClass("hidden");
      $("body").removeClass("overflow-hidden");
    }, 300);
    $("#speed-dial-container").removeClass("hidden-dial");
  };

  $("#sidebar-toggle").click(bukaSidebar);
  $("#sidebar-close, #sidebar-overlay, .sidebar-link").click(tutupSidebar);

  // Kalkulator BMI
  $("#calc-bmi-btn").click(function () {
    const w = parseFloat($("#weight").val());
    const h = parseFloat($("#height").val()) / 100;

    if (w > 10 && h > 0.5) {
      const bmi = (w / (h * h)).toFixed(1);
      let status = "",
        color = "",
        adv = "",
        pct = 0;

      if (bmi < 18.5) {
        status = "Kekurangan Berat Badan";
        color = "#fbbf24";
        adv =
          "Anda disarankan untuk meningkatkan asupan nutrisi seimbang dan konsultasi dengan ahli gizi kami.";
        pct = 25;
      } else if (bmi < 25) {
        status = "Berat Badan Ideal";
        color = "#22c55e";
        adv =
          "Selamat! Pertahankan pola makan dan olahraga rutin Anda untuk menjaga performa tubuh.";
        pct = 50;
      } else if (bmi < 30) {
        status = "Overweight";
        color = "#f59e0b";
        adv =
          "Atur kembali porsi makan dan tingkatkan aktivitas kardio minimal 30 menit sehari.";
        pct = 75;
      } else {
        status = "Obesitas (Risiko Tinggi)";
        color = "#ef4444";
        adv =
          "Sangat disarankan untuk melakukan konsultasi medis guna manajemen berat badan yang strategis.";
        pct = 95;
      }

      $("#bmi-result").removeClass("hidden").hide().slideDown(500);
      $("#bmi-val").text(bmi).css("color", color);
      $("#bmi-status").text(status);
      $("#bmi-adv").text(adv);
      $("#bmi-bar").css({ width: pct + "%", "background-color": color });
    } else {
      alert("Silakan masukkan data yang valid.");
    }
  });

  // Filter Layanan
  $(".service-btn").click(function () {
    const filter = $(this).data("filter");
    $(".service-btn")
      .removeClass(
        "active bg-white dark:bg-slate-700 shadow-lg text-primary-light"
      )
      .addClass("text-secondary");
    $(this)
      .addClass(
        "active bg-white dark:bg-slate-700 shadow-lg text-primary-light"
      )
      .removeClass("text-secondary");

    if (filter === "all") {
      $(".service-card").fadeIn(400);
    } else {
      $(".service-card").fadeOut(200);
      setTimeout(() => {
        $(`.service-card[data-category="${filter}"]`).fadeIn(400);
      }, 250);
    }
  });

  // Pendaftaran Booking
  $("#final-apt-form").submit(function (e) {
    e.preventDefault();

    const name = $("#apt-user").val();
    const phone = $("#apt-phone").val();
    const category = $("#apt-cat option:selected").text();
    const detail = $("#apt-detail").val();
    const date = $("#apt-date").val();
    const message = $("#apt-msg").val();

    const waText =
      `Halo Prisdhy Clinic, saya *${name}* ingin melakukan booking:%0A%0A` +
      `🏥 *Poli/Layanan:* ${category}%0A` +
      (detail ? `✨ *Layanan Spesifik:* ${detail}%0A` : "") +
      `📅 *Tanggal:* ${date}%0A` +
      `📱 *WhatsApp:* ${phone}%0A` +
      `📝 *Catatan:* ${message || "-"}%0A%0A` +
      `Mohon segera dikonfirmasi. Terima kasih.`;

    const waLink = `https://wa.me/6281553148979?text=${waText}`;

    $("#apt-loader").removeClass("hidden").addClass("flex");

    setTimeout(() => {
      $("#apt-loader").addClass("hidden").removeClass("flex");
      window.open(waLink, "_blank");

      tampilkanModalAplikasi(`
                <div class="text-center">
                    <div class="w-32 h-32 bg-green-50 dark:bg-green-500/10 text-green-500 rounded-full flex items-center justify-center text-6xl mx-auto mb-10 shadow-inner">
                        <i class="fas fa-paper-plane animate-bounce"></i>
                    </div>
                    <h3 class="text-4xl font-black mb-6 dark:text-white">Booking Terkirim!</h3>
                    <p class="text-slate-500 dark:text-slate-400 text-xl leading-relaxed mb-10">
                        Permintaan booking Anda sedang diteruskan ke WhatsApp resmi kami. Mohon selesaikan pesan di sana.
                    </p>
                    <button class="modal-cls-btn px-12 py-5 bg-primary-light text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-primary-light/30 transition-all hover:scale-105 active:scale-95">
                        Selesai
                    </button>
                </div>
            `);

      $("#final-apt-form")[0].reset();
    }, 2000);
  });

  // FAQ Akordeon
  $(".faq-toggle").click(function () {
    const item = $(this).closest(".faq-item");
    const content = item.find(".faq-content");
    const icon = item.find(".faq-icon");

    $(".faq-item").not(item).find(".faq-content").css("max-height", "0");
    $(".faq-item").not(item).find(".faq-icon").css("transform", "rotate(0)");
    $(".faq-item").not(item).removeClass("border-primary-light/50");

    if (content.css("max-height") === "0px") {
      content.css("max-height", content[0].scrollHeight + "px");
      icon.css("transform", "rotate(45deg)");
      item.addClass("border-primary-light/50");
    } else {
      content.css("max-height", "0");
      icon.css("transform", "rotate(0)");
      item.removeClass("border-primary-light/50");
    }
  });

  // Sistem Modal
  function tampilkanModalAplikasi(content) {
    $("#modal-injection").html(content);
    $("#global-modal").removeClass("hidden").addClass("flex");
    setTimeout(() => {
      $("#global-modal").addClass("opacity-100");
      $("#modal-box").addClass("scale-100");
    }, 10);
    $("body").addClass("overflow-hidden");
  }

  const tutupModalAplikasi = () => {
    $("#global-modal").removeClass("opacity-100");
    $("#modal-box").removeClass("scale-100").addClass("scale-95");
    setTimeout(() => {
      $("#global-modal").removeClass("flex").addClass("hidden");
      $("body").removeClass("overflow-hidden");
    }, 500);
  };

  $(document).on(
    "click",
    "#modal-cls, .modal-cls-btn, #global-modal",
    function (e) {
      if (e.target !== this && !$(this).hasClass("modal-cls-btn")) return;
      tutupModalAplikasi();
    }
  );

  // Navigasi & Scroll Top
  $(window).scroll(function () {
    const scroll = $(window).scrollTop();
    if (scroll > 100) {
      $("#navbar").addClass("scrolled");
      $("#scroll-top").removeClass(
        "opacity-0 pointer-events-none translate-y-10"
      );
    } else {
      $("#navbar").removeClass("scrolled");
      $("#scroll-top").addClass("opacity-0 pointer-events-none translate-y-10");
    }
  });

  $("#scroll-top").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 300);
  });

  $('a[href^="#"]').click(function (e) {
    const target = $(this.getAttribute("href"));
    if (target.length) {
      e.preventDefault();
      $("html, body").animate(
        {
          scrollTop: target.offset().top - 80,
        },
        300
      );
    }
  });

  // Efek Ripple
  $(document).on("mousedown", "button, .px-10, .px-12", function (e) {
    const btn = $(this);
    const circle = $('<span class="ripple"></span>');
    const d = Math.max(btn.outerWidth(), btn.outerHeight());
    const r = d / 2;

    circle.css({
      width: d + "px",
      height: d + "px",
      left: e.pageX - btn.offset().left - r + "px",
      top: e.pageY - btn.offset().top - r + "px",
    });

    btn.append(circle);
    setTimeout(() => circle.remove(), 600);
  });

  // Auto fill Layanan/Dokter
  $(document).on("click", "[data-service]", function () {
    const service = $(this).data("service");
    const detail = $(this).data("detail");
    if (service) {
      $("#apt-cat").val(service).change();
    }
    if (detail) {
      $("#apt-detail").val(detail);
    } else {
      $("#apt-detail").val("");
    }
  });

  // Carousel Testimoni
  const $track = $(".carousel-track");
  const $dots = $(".dot");
  let currentIndex = 0;
  let autoplayInterval;

  function updateCarousel() {
    const cardWidth = $(".testimonial-card").outerWidth(true);
    $track.css("transform", `translateX(-${currentIndex * cardWidth}px)`);

    $dots.removeClass("active");
    $dots.eq(currentIndex).addClass("active");
  }

  function startAutoplay() {
    autoplayInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % $dots.length;
      updateCarousel();
    }, 4000);
  }

  $dots.on("click", function () {
    currentIndex = $(this).data("index");
    updateCarousel();
    clearInterval(autoplayInterval);
    startAutoplay();
  });

  $(".carousel-container")
    .on("mouseenter", () => clearInterval(autoplayInterval))
    .on("mouseleave", startAutoplay);

  // Carousel Fasilitas
  const $facTrack = $("#facilities-track");
  let facIndex = 0;

  function updateFacCarousel() {
    if (window.innerWidth > 640) {
      $facTrack.css("transform", "none");
      return;
    }
    const cardWidth = $(".facility-card").outerWidth(true);
    const transformValue = facIndex * cardWidth;
    $facTrack.css("transform", `translateX(-${transformValue}px)`);
  }

  $("#next-facility").on("click", function () {
    const visibleCards = Math.floor(
      $(".carousel-container").width() / $(".facility-card").outerWidth(true)
    );
    const totalCards = $(".facility-card").length;
    if (facIndex < totalCards - visibleCards) {
      facIndex++;
      updateFacCarousel();
    } else {
      facIndex = 0;
      updateFacCarousel();
    }
  });

  $("#prev-facility").on("click", function () {
    if (facIndex > 0) {
      facIndex--;
    } else {
      const visibleCards = Math.floor(
        $(".carousel-container").width() / $(".facility-card").outerWidth(true)
      );
      facIndex = $(".facility-card").length - visibleCards;
    }
    updateFacCarousel();
  });

  // Modal Detail Layanan
  const $serviceModal = $("#service-modal");

  $(".open-service-modal").on("click", function () {
    const $btn = $(this);
    const title = $btn.data("title");
    const desc = $btn.data("desc");
    const duration = $btn.data("duration");
    const icon = $btn.data("icon");
    const service = $btn.data("service");

    $("#modal-title").text(title);
    $("#modal-desc").text(desc);
    $("#modal-duration").text(duration);
    $("#modal-icon").attr("class", `fas ${icon}`);
    $("#modal-book-btn").attr("data-service", service);

    $serviceModal.removeClass("hidden").addClass("flex");
    $("body").addClass("overflow-hidden");
  });

  function closeServiceModal() {
    $serviceModal.addClass("hidden").removeClass("flex");
    $("body").removeClass("overflow-hidden");
  }

  $("#close-modal, #modal-overlay").on("click", closeServiceModal);
  $("#modal-book-btn").on("click", closeServiceModal);

  // Inisialisasi & Resize
  function initDynamicUI() {
    if ($track.length) {
      updateCarousel();
      startAutoplay();
    }
    if ($facTrack.length) {
      updateFacCarousel();
    }
  }

  initDynamicUI();
  $(window).on("resize", initDynamicUI);
});
