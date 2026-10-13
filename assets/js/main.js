/**
 * IRONPULSE FITNESS CLUB - MASTER JAVASCRIPT
 * Full interactive logic: Sticky nav, mobile drawer, animated counters,
 * timetable tabs, pricing switch, gallery filter & lightbox, before/after comparison sliders,
 * interactive BMI calculator, testimonials slider, FAQ accordion, booking modals, and toasts.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeSwitcher();
  initNavbar();
  initStatsCounter();
  initTimetable();
  initPricingToggle();
  initGallery();
  initComparisonSliders();
  initBmiCalculator();
  initTestimonialsSlider();
  initFaqAccordion();
  initFormsAndModals();
  initFacilityModals();
  initScrollReveal();
  initBackToTop();
  initWhatsAppWidget();
});

/* ==========================================================================
   0. THEME SWITCHER (CYBER VOLT, CRIMSON, CYAN, GOLD)
   ========================================================================== */
function initThemeSwitcher() {
  const themePills = document.querySelectorAll('.theme-pill-btn');
  const savedTheme = localStorage.getItem('ironpulse_theme') || 'volt';

  function applyTheme(theme) {
    if (theme === 'volt') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
    localStorage.setItem('ironpulse_theme', theme);
    themePills.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-theme-name') === theme);
    });
  }

  applyTheme(savedTheme);

  themePills.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme-name');
      applyTheme(theme);
    });
  });
}


/* ==========================================================================
   1. NAVBAR & NAVIGATION
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileNavDrawer');
  const mobileBackdrop = document.getElementById('mobileNavBackdrop');
  const mobileClose = document.getElementById('mobileNavClose');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  // Sticky header background on scroll
  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile drawer open/close
  function openMobileNav() {
    mobileDrawer.classList.add('open');
    mobileBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    mobileDrawer.classList.remove('open');
    mobileBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (menuToggle) menuToggle.addEventListener('click', openMobileNav);
  if (mobileClose) mobileClose.addEventListener('click', closeMobileNav);
  if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMobileNav);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileNav();
      
      // Update active nav styling
      navLinks.forEach(l => l.classList.remove('active'));
      const targetHref = link.getAttribute('href');
      document.querySelectorAll(`a[href="${targetHref}"]`).forEach(l => l.classList.add('active'));
    });
  });

  // ScrollSpy to highlight active link based on scroll position
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset + 120;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   2. STATS COUNTER STRIP
   ========================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  let hasRun = false;

  const countUp = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1800; // ms
    const startTime = performance.now();

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeProgress * target);

      el.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString();
      }
    };

    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasRun) {
        hasRun = true;
        statNumbers.forEach(num => countUp(num));
        obs.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.getElementById('statsSection');
  if (statsSection) observer.observe(statsSection);
}

/* ==========================================================================
   3. CLASS TIMETABLE
   ========================================================================== */
const timetableData = {
  mon: [
    {
      time: '6:30 AM',
      name: 'HIIT Blast',
      coach: 'Danny Whitlock',
      duration: '50 Min',
      intensity: 'High (Flame x3)',
      category: 'Conditioning',
      spots: '4 spots left',
      desc: 'High-octane interval conditioning combining rower sprints, kettlebell swings, and plyo box jumps.'
    },
    {
      time: '6:00 PM',
      name: 'Spin Cycle',
      coach: 'Danny Whitlock',
      duration: '45 Min',
      intensity: 'High (Flame x3)',
      category: 'Cardio',
      spots: '6 spots left',
      desc: 'Rhythm-driven indoor cycling with hill climbs, sprint intervals, and neon immersive light visuals.'
    }
  ],
  tue: [
    {
      time: '7:00 AM',
      name: 'Yoga Flow',
      coach: 'Aisha Okafor',
      duration: '60 Min',
      intensity: 'Low-Med (Flame x1)',
      category: 'Mind & Body',
      spots: '8 spots left',
      desc: 'Vinyasa flow focusing on joint mobility, spinal decompression, deep breathwork, and athletic recovery.'
    },
    {
      time: '7:00 PM',
      name: 'Boxing Fit',
      coach: 'Marcus Reyes',
      duration: '55 Min',
      intensity: 'Very High (Flame x3)',
      category: 'Combat Conditioning',
      spots: '2 spots left',
      desc: 'Technical heavy bag combinations, footwork drills, and core conditioning in our dedicated fight studio.'
    }
  ],
  wed: [
    {
      time: '6:30 AM',
      name: 'Strength Foundations',
      coach: 'Marcus Reyes',
      duration: '60 Min',
      intensity: 'High (Flame x2)',
      category: 'Strength',
      spots: '5 spots left',
      desc: 'Compound barbell mastery focusing on the squat, deadlift, overhead press, and barbell rows.'
    },
    {
      time: '6:30 PM',
      name: 'Zumba Fit',
      coach: 'Priya Lindqvist',
      duration: '50 Min',
      intensity: 'Medium (Flame x2)',
      category: 'Dance Cardio',
      spots: '9 spots left',
      desc: 'Upbeat Latin dance cardio workout that torches calories while keeping energy levels soaring.'
    }
  ],
  thu: [
    {
      time: '6:00 PM',
      name: 'HIIT Blast',
      coach: 'Danny Whitlock',
      duration: '50 Min',
      intensity: 'High (Flame x3)',
      category: 'Conditioning',
      spots: '3 spots left',
      desc: 'Fast-paced circuit with assault bikes, turf sled pushes, and core burnouts.'
    },
    {
      time: '7:30 PM',
      name: 'Mobility Reset',
      coach: 'Aisha Okafor',
      duration: '45 Min',
      intensity: 'Gentle (Flame x1)',
      category: 'Recovery',
      spots: '10 spots left',
      desc: 'Targeted myofascial release, foam rolling, and hip/shoulder mobility for injury prevention.'
    }
  ],
  fri: [
    {
      time: '6:30 AM',
      name: 'Spin Cycle',
      coach: 'Danny Whitlock',
      duration: '45 Min',
      intensity: 'High (Flame x3)',
      category: 'Cardio',
      spots: '5 spots left',
      desc: 'Sunrise high-energy cycling beats to kickstart your Friday with sweat and endurance.'
    },
    {
      time: '6:00 PM',
      name: 'Full Body Burn',
      coach: 'Priya Lindqvist',
      duration: '55 Min',
      intensity: 'High (Flame x3)',
      category: 'Total Body',
      spots: '7 spots left',
      desc: 'Dumbbells, resistance bands, and bodyweight intervals designed to leave nothing in the tank.'
    }
  ],
  sat: [
    {
      time: '8:00 AM',
      name: 'Weekend Boot Camp',
      coach: 'Marcus Reyes & Danny',
      duration: '75 Min',
      intensity: 'Maximum (Flame x3)',
      category: 'Team Athletic',
      spots: 'Limited (3 left)',
      desc: 'Our flagship Saturday community workout across the indoor turf and strength floor.'
    },
    {
      time: '10:00 AM',
      name: 'Yoga Flow',
      coach: 'Aisha Okafor',
      duration: '60 Min',
      intensity: 'Mind & Body',
      category: 'Mind & Body',
      spots: '6 spots left',
      desc: 'Soothing restorative yoga to balance your weekend training and center your mind.'
    }
  ]
};

function initTimetable() {
  const dayButtons = document.querySelectorAll('.timetable-day-btn');
  const timetableContainer = document.getElementById('timetableGrid');
  if (!dayButtons.length || !timetableContainer) return;

  function renderDay(dayKey) {
    const classes = timetableData[dayKey] || [];
    timetableContainer.innerHTML = '';

    classes.forEach(cls => {
      const card = document.createElement('div');
      card.className = 'class-card';
      card.innerHTML = `
        <div>
          <div class="class-header">
            <span class="class-time"><i class="fa-regular fa-clock"></i> ${cls.time}</span>
            <span class="class-intensity"><i class="fa-solid fa-fire"></i> ${cls.category}</span>
          </div>
          <h4 class="class-title">${cls.name}</h4>
          <p style="color: var(--text-muted); font-size: 0.92rem; margin-bottom: 16px; line-height: 1.5;">${cls.desc}</p>
          <div class="class-meta">
            <span><i class="fa-solid fa-user-ninja"></i> ${cls.coach}</span>
            <span><i class="fa-regular fa-hourglass-half"></i> ${cls.duration}</span>
          </div>
        </div>
        <div class="class-footer">
          <span class="class-spots"><i class="fa-solid fa-circle-check"></i> ${cls.spots}</span>
          <button class="btn btn-outline-orange btn-sm book-class-trigger" data-class="${cls.name}" data-time="${cls.time}">
            Reserve Spot <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      `;
      timetableContainer.appendChild(card);
    });

    // Attach click event for booking triggers
    document.querySelectorAll('.book-class-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const className = e.currentTarget.getAttribute('data-class');
        const classTime = e.currentTarget.getAttribute('data-time');
        openClassModal(className, classTime);
      });
    });
  }

  dayButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      dayButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const dayKey = btn.getAttribute('data-day');
      renderDay(dayKey);
    });
  });

  // Render initial Monday
  renderDay('mon');
}

/* ==========================================================================
   4. PRICING TOGGLE
   ========================================================================== */
function initPricingToggle() {
  const toggle = document.getElementById('pricingToggle');
  const labelMonthly = document.getElementById('labelMonthly');
  const labelAnnual = document.getElementById('labelAnnual');
  const priceElements = document.querySelectorAll('.amount[data-monthly]');
  const periodElements = document.querySelectorAll('.period');

  if (!toggle) return;

  let isAnnual = false;

  function updatePrices() {
    toggle.classList.toggle('annual', isAnnual);
    labelMonthly.classList.toggle('active', !isAnnual);
    labelAnnual.classList.toggle('active', isAnnual);

    priceElements.forEach(el => {
      const monthly = el.getAttribute('data-monthly');
      const annual = el.getAttribute('data-annual');
      el.textContent = isAnnual ? annual : monthly;
    });

    periodElements.forEach(el => {
      el.textContent = isAnnual ? '/mo (billed yearly)' : '/mo';
    });
  }

  toggle.addEventListener('click', () => {
    isAnnual = !isAnnual;
    updatePrices();
  });

  if (labelMonthly) labelMonthly.addEventListener('click', () => { isAnnual = false; updatePrices(); });
  if (labelAnnual) labelAnnual.addEventListener('click', () => { isAnnual = true; updatePrices(); });
}

/* ==========================================================================
   5. GALLERY & LIGHTBOX
   ========================================================================== */
function initGallery() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImage');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let activeIndex = 0;
  let visibleItems = Array.from(galleryItems);

  // Filtering
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.classList.remove('hide');
        } else {
          item.classList.add('hide');
        }
      });

      visibleItems = Array.from(document.querySelectorAll('.gallery-item:not(.hide)'));
    });
  });

  // Lightbox functions
  function showLightbox(index) {
    if (!visibleItems.length) return;
    if (index < 0) index = visibleItems.length - 1;
    if (index >= visibleItems.length) index = 0;
    activeIndex = index;

    const item = visibleItems[activeIndex];
    const imgSrc = item.getAttribute('data-image') || item.querySelector('img').src;
    const title = item.getAttribute('data-title') || 'IronPulse Facility';
    const category = item.getAttribute('data-category-label') || 'Club View';

    lightboxImg.src = imgSrc;
    lightboxImg.alt = title;
    lightboxTitle.textContent = title;
    lightboxCategory.textContent = category;
    lightboxCounter.textContent = `${activeIndex + 1} / ${visibleItems.length}`;

    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      visibleItems = Array.from(document.querySelectorAll('.gallery-item:not(.hide)'));
      const idx = visibleItems.indexOf(item);
      showLightbox(idx >= 0 ? idx : 0);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => showLightbox(activeIndex - 1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => showLightbox(activeIndex + 1));

  // Lightbox keyboard controls
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showLightbox(activeIndex - 1);
    if (e.key === 'ArrowRight') showLightbox(activeIndex + 1);
  });

  // Click outside image closes lightbox
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

/* ==========================================================================
   6. BEFORE & AFTER (TRANSFORMATION COMPARISON SLIDER)
   ========================================================================== */
function initComparisonSliders() {
  const containers = document.querySelectorAll('.comparison-container');

  containers.forEach(container => {
    const afterWrapper = container.querySelector('.comparison-after-wrapper');
    const handle = container.querySelector('.comparison-handle');
    const sliderInput = container.querySelector('.comparison-slider-input');

    if (!afterWrapper || !handle || !sliderInput) return;

    const updateSlider = (percent) => {
      percent = Math.max(0, Math.min(100, percent));
      afterWrapper.style.width = `${percent}%`;
      handle.style.left = `${percent}%`;
    };

    // Range input for smooth touch and mouse interaction
    sliderInput.addEventListener('input', (e) => {
      updateSlider(e.target.value);
    });

    // Keep inner image matching width on resize
    const syncInnerImageWidth = () => {
      const containerWidth = container.offsetWidth;
      const innerImg = afterWrapper.querySelector('.comparison-image');
      if (innerImg) {
        innerImg.style.width = `${containerWidth}px`;
      }
    };

    syncInnerImageWidth();
    window.addEventListener('resize', syncInnerImageWidth);
  });
}

/* ==========================================================================
   7. INTERACTIVE BMI CALCULATOR
   ========================================================================== */
function initBmiCalculator() {
  const unitMetricBtn = document.getElementById('bmiUnitMetric');
  const unitImperialBtn = document.getElementById('bmiUnitImperial');
  const metricInputs = document.getElementById('bmiMetricInputs');
  const imperialInputs = document.getElementById('bmiImperialInputs');
  const calcBtn = document.getElementById('bmiCalcBtn');

  const scoreEl = document.getElementById('bmiScore');
  const catEl = document.getElementById('bmiCategory');
  const recEl = document.getElementById('bmiRecommendation');
  const planEl = document.getElementById('bmiSuggestedPlan');
  const gaugeEl = document.getElementById('bmiGauge');

  if (!calcBtn) return;

  let unit = 'metric'; // 'metric' or 'imperial'

  function setUnit(newUnit) {
    unit = newUnit;
    if (unit === 'metric') {
      unitMetricBtn.classList.add('active');
      unitImperialBtn.classList.remove('active');
      metricInputs.style.display = 'grid';
      imperialInputs.style.display = 'none';
    } else {
      unitImperialBtn.classList.add('active');
      unitMetricBtn.classList.remove('active');
      imperialInputs.style.display = 'grid';
      metricInputs.style.display = 'none';
    }
    calculateBmi();
  }

  if (unitMetricBtn) unitMetricBtn.addEventListener('click', () => setUnit('metric'));
  if (unitImperialBtn) unitImperialBtn.addEventListener('click', () => setUnit('imperial'));

  function calculateBmi() {
    let bmi = 0;

    if (unit === 'metric') {
      const heightCm = parseFloat(document.getElementById('bmiHeightMetric').value);
      const weightKg = parseFloat(document.getElementById('bmiWeightMetric').value);

      if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) return;
      const heightM = heightCm / 100;
      bmi = weightKg / (heightM * heightM);
    } else {
      const heightFt = parseFloat(document.getElementById('bmiHeightFt').value) || 0;
      const heightIn = parseFloat(document.getElementById('bmiHeightIn').value) || 0;
      const weightLbs = parseFloat(document.getElementById('bmiWeightImperial').value);

      const totalInches = (heightFt * 12) + heightIn;
      if (!totalInches || !weightLbs || totalInches <= 0 || weightLbs <= 0) return;
      bmi = (weightLbs / (totalInches * totalInches)) * 703;
    }

    bmi = Math.round(bmi * 10) / 10;
    displayBmiResults(bmi);
  }

  function displayBmiResults(bmi) {
    if (isNaN(bmi) || bmi <= 0) return;

    scoreEl.textContent = bmi.toFixed(1);

    let category = '';
    let recommendation = '';
    let plan = '';
    let color = '';

    if (bmi < 18.5) {
      category = 'Underweight';
      recommendation = 'Focus on progressive strength training and a structured calorie surplus with protein-rich nutrition to build lean mass.';
      plan = 'Strength Foundations + Nutrition Coaching';
      color = '#38bdf8';
    } else if (bmi >= 18.5 && bmi < 25) {
      category = 'Healthy Weight';
      recommendation = 'Optimal body composition. Maintain conditioning, athletic endurance, and muscle tone with our varied class lineup.';
      plan = 'Pulse Plan (Classes + Floor Access)';
      color = '#4ade80';
    } else if (bmi >= 25 && bmi < 30) {
      category = 'Overweight';
      recommendation = 'Recommended focus: high-density interval training (HIIT) paired with resistance training and steady recovery in our sauna.';
      plan = 'Pulse Plan + HIIT Blast';
      color = '#fbbf24';
    } else {
      category = 'High BMI / Obesity';
      recommendation = 'Targeted, coach-guided metabolic conditioning and low-impact functional strength to accelerate fat loss safely.';
      plan = 'Elite Plan with 1-on-1 PT Coaching';
      color = '#f87171';
    }

    catEl.textContent = category;
    catEl.style.color = color;
    recEl.textContent = recommendation;
    planEl.textContent = `Recommended for You: ${plan}`;
    gaugeEl.style.borderTopColor = color;
    gaugeEl.style.boxShadow = `0 0 25px ${color}33`;
  }

  calcBtn.addEventListener('click', calculateBmi);

  // Auto calculate on input change
  const allInputs = document.querySelectorAll('.bmi-form-grid input');
  allInputs.forEach(input => {
    input.addEventListener('input', calculateBmi);
  });

  // Calculate default
  calculateBmi();
}

/* ==========================================================================
   8. TESTIMONIALS SLIDER
   ========================================================================== */
function initTestimonialsSlider() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');
  const dotsContainer = document.getElementById('testimonialDots');

  if (!slides.length) return;

  let currentSlide = 0;
  let autoTimer = null;

  // Build dots
  dotsContainer.innerHTML = '';
  slides.forEach((_, idx) => {
    const dot = document.createElement('div');
    dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => goToSlide(idx));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.carousel-dot');

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    currentSlide = (index + slides.length) % slides.length;

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
    resetAutoTimer();
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);

  function resetAutoTimer() {
    clearInterval(autoTimer);
    autoTimer = setInterval(nextSlide, 7000);
  }

  resetAutoTimer();
}

/* ==========================================================================
   9. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(other => {
        other.classList.remove('active');
        const otherContent = other.querySelector('.faq-content');
        if (otherContent) otherContent.style.maxHeight = null;
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // Open first by default
  if (faqItems.length > 0) {
    const first = faqItems[0];
    first.classList.add('active');
    const firstContent = first.querySelector('.faq-content');
    if (firstContent) firstContent.style.maxHeight = firstContent.scrollHeight + 'px';
  }
}

/* ==========================================================================
   10. FORMS, MODALS & TOASTS
   ========================================================================== */
function showToast(title, message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.innerHTML = `
    <i class="fa-solid fa-circle-check toast-icon"></i>
    <div class="toast-text">
      <strong>${title}</strong>
      <p>${message}</p>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(60px)';
    toast.style.transition = 'all 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 4500);
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function openClassModal(className, classTime) {
  const modal = document.getElementById('classBookingModal');
  const classInput = document.getElementById('bookClassName');
  const timeInput = document.getElementById('bookClassTime');
  if (classInput) classInput.value = className;
  if (timeInput) timeInput.value = classTime;
  openModal('classBookingModal');
}

function initFormsAndModals() {
  // Free Trial Modal trigger buttons
  document.querySelectorAll('.open-trial-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const plan = btn.getAttribute('data-plan') || 'Pulse Plan ($49/mo)';
      const select = document.getElementById('trialPlanSelect');
      if (select) select.value = plan;
      openModal('trialModal');
    });
  });

  // Video Tour Modal triggers
  document.querySelectorAll('.open-video-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('videoModal');
    });
  });

  // Modal Close buttons
  document.querySelectorAll('.modal-close-btn, .modal-close-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) closeModal(modal.id);
    });
  });

  // Close modals on backdrop click
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal.id);
      }
    });
  });

  // ESC key closes modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(modal => {
        closeModal(modal.id);
      });
    }
  });

  // Contact Form Submission (Front-end only)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Reserving Your Pass...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        contactForm.reset();
        showToast('Pass Reserved!', 'Your 7-Day Free Trial pass has been sent to your email. See you on the floor!');
        openModal('confirmationModal');
      }, 1200);
    });
  }

  // Quick Trial Modal Form Submission
  const trialModalForm = document.getElementById('trialModalForm');
  if (trialModalForm) {
    trialModalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeModal('trialModal');
      showToast('Free Trial Activated!', 'Check your inbox for your digital IronPulse pass barcode.');
      openModal('confirmationModal');
      trialModalForm.reset();
    });
  }

  // Class Booking Form Submission
  const classBookingForm = document.getElementById('classBookingForm');
  if (classBookingForm) {
    classBookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const className = document.getElementById('bookClassName').value;
      closeModal('classBookingModal');
      showToast('Spot Reserved!', `You are booked for ${className}. Arrive 10 mins early with athletic shoes.`);
      classBookingForm.reset();
    });
  }

  // Footer Newsletter Form
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      newsletterForm.reset();
      showToast('Subscribed!', 'Welcome to the IronPulse Dispatch. Expect training tips every Monday.');
    });
  }
}

/* ==========================================================================
   11. SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-fade-up');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   12. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const backToTop = document.getElementById('backToTop');
  if (!backToTop) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  }, { passive: true });

  backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   13. FLOATING WHATSAPP BUTTON & CHAT SIMULATOR
   ========================================================================== */
function initWhatsAppWidget() {
  const waBtn = document.getElementById('floatingWhatsApp');
  if (!waBtn) return;

  waBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showToast('WhatsApp Chat', 'Opening IronPulse Concierge on (555) 014-2291...');
    setTimeout(() => {
      window.open('https://api.whatsapp.com/send?phone=15550142291&text=Hi%20IronPulse!%20I%20would%20like%20to%20know%20more%20about%20the%20gym.', '_blank');
    }, 600);
  });
}

/* ==========================================================================
   14. INTERACTIVE FACILITY DETAIL MODAL & ZONE EXPLORER
   ========================================================================== */
const facilityData = [
  {
    id: 'strength',
    title: 'Strength Floor',
    category: 'Heavy Iron & Power',
    icon: 'fa-solid fa-dumbbell',
    status: 'All Access Zone',
    tagline: 'Championship-grade Eleiko bars, 6 power racks, and dumbbells to 150 lbs.',
    image: 'assets/images/facility_strength.jpg',
    altImage: 'assets/images/facility_deadlift_focus.jpg',
    altImageCaption: 'Coached Deadlift Platform',
    desc: 'Spanning over 4,500 square feet, our Strength Floor is engineered for serious lifters, powerlifters, and athletes. Every barbell is competition calibrated, power cages feature heavy-duty spotter straps and chin-up bars, and deadlift platforms absorb maximum impact while preserving bar whip. No waiting around—we maintain multiple identical racks and dumbbells paired up to 150 lbs.',
    specs: [
      '6x Rogue Monster Series Power Cages with band pegs & spotter straps',
      'Eleiko IPF-certified calibrated barbells & 3,000+ kg competition bumper plates',
      'Dumbbells from 5 lbs up to 150 lbs with ergonomic knurled urethane grips',
      '3x Hardwood Olympic deadlift platforms with calibrated competition chalk bowls',
      '12x Adjustable incline, flat, and decline heavy-duty competition benches',
      'Full Hammer Strength plate-loaded iso-lateral machine circuit'
    ],
    highlights: [
      'Chalk Allowed & Provided',
      '1-Inch Shockproof Rubber Floors',
      'High-CFM Clean Air Ventilation',
      'Open 24/7 for Elite Members'
    ],
    hours: 'Mon–Fri 5:00 AM – 11:00 PM • Sat 6:00 AM – 9:00 PM • Sun 7:00 AM – 6:00 PM',
    access: 'Included in Starter, Pulse & Elite Memberships (24/7 with Elite)',
    idealFor: ['Powerlifting', 'Bodybuilding', 'Athletic Strength', 'Hypertrophy'],
    plan: 'Pulse Plan ($49/mo)'
  },
  {
    id: 'cardio',
    title: 'Cardio Zone',
    category: 'Endurance & Stamina',
    icon: 'fa-solid fa-person-running',
    status: 'Open Floor • All Hours',
    tagline: 'High-cadence stamina conditioning with panoramic skyline windows and telemetry tracking.',
    image: 'assets/images/facility_cardio.jpg',
    altImage: 'assets/images/hero.jpg',
    altImageCaption: 'High-Capacity Training Deck',
    desc: 'Positioned alongside our expansive skyline windows, the Cardio Zone combines elite aerobic equipment with motivating natural light. Featuring self-powered Woodway curved treadmills that recruit up to 30% more muscle fibers than standard motorized decks, Concept2 rowers, SkiErgs, and commercial stair climbers. Every station connects seamlessly with Apple Watch, Garmin, and Bluetooth heart-rate monitors.',
    specs: [
      '8x Woodway Curve self-powered non-motorized treadmills',
      '6x Concept2 Model D Rowers with PM5 wireless performance monitors',
      '4x Concept2 SkiErgs for upper-body conditioning & lactate threshold work',
      '8x Assault Fitness AirBikes for high-intensity sprint intervals',
      '4x Matrix commercial ClimbMills with personal cooling fans and device docks',
      'Bluetooth & ANT+ wireless heart-rate telemetry integration across all consoles'
    ],
    highlights: [
      'Panoramic Skyline Windows',
      'Personal Console Fans & USB Chargers',
      'Touchless Electrolyte Water Stations',
      'Heart-Rate Zone Sync'
    ],
    hours: 'Open during all club operating hours',
    access: 'Included in all membership tiers',
    idealFor: ['Marathon & HYROX Prep', 'Fat Burning', 'Cardiovascular Stamina', 'Low-Impact Aerobics'],
    plan: 'Starter Plan ($29/mo)'
  },
  {
    id: 'turf',
    title: 'Functional Athletic Turf',
    category: 'Athletics & Agility',
    icon: 'fa-solid fa-stopwatch-20',
    status: 'Open Floor Outside Classes',
    tagline: '30-meter continuous indoor turf for sprint conditioning and heavy sled work.',
    image: 'assets/images/facility_turf.jpg',
    altImage: 'assets/images/facility_boxing_zone.jpg',
    altImageCaption: 'Boxing & Sled Arena',
    desc: 'Our 30-meter high-density turf strip is designed for real athletic movement. Whether you are pushing heavy prowler sleds, generating explosive force with battle ropes, or testing agility with sprint cones, this area eliminates machine restrictions and lets you train for power, speed, and real-world durability.',
    specs: [
      '30-meter seamless heavy-duty athletic turf marked every 5 yards',
      '3x Heavy Rogue Dog Sleds & prowlers with low and high handles',
      '50-foot thick braided battle ropes (1.5" and 2" diameters)',
      'Full kettlebell rack from 8 kg (18 lbs) up to 48 kg (106 lbs)',
      'Soft-sided non-slip plyometric jump boxes (20", 24", 30" heights)',
      'Heavy slam balls & reinforced concrete cinder wall for rotational slams'
    ],
    highlights: [
      'Programmable Wall Interval Timers',
      'Unobstructed Deceleration Space',
      'Agility Hurdles & Sprint Parachutes',
      'Open Floor Between Team Classes'
    ],
    hours: 'All Club Open Hours (Class priority during scheduled turf sessions)',
    access: 'Included in Starter, Pulse & Elite Memberships',
    idealFor: ['Speed & Acceleration', 'Rotational Power', 'HYROX & Cross-Training', 'Metabolic Conditioning'],
    plan: 'Pulse Plan ($49/mo)'
  },
  {
    id: 'classes',
    title: 'Group Fitness Studio',
    category: 'Community & Energy',
    icon: 'fa-solid fa-users-line',
    status: 'Coach-Led Sessions',
    tagline: 'Over 25 coach-guided group classes weekly with concert sound and club lighting.',
    image: 'assets/images/facility_group_class.jpg',
    altImage: 'assets/images/facility_yoga_studio.jpg',
    altImageCaption: 'Mind-Body Yoga Sanctuary',
    desc: 'Step into an immersive, community-driven studio experience. Our coach-led sessions range from heart-pumping HIIT Blast and Rhythm Spin Cycle to restorative Yoga Flow and Boxing Fit. Featuring a joint-cushioning spring floor, concert Martin Audio acoustics, and instructor-controlled atmospheric lighting to keep motivation sky-high.',
    specs: [
      'Joint-friendly floating acoustic hardwood studio subfloor',
      'Martin Audio high-fidelity sound system with sub-bass tuning',
      'Tempo-responsive ambient color lighting rigs',
      '25+ weekly sessions included with Pulse and Elite memberships',
      'Individual equipment cubbies sanitized after each session',
      '24-member class cap for personalized instructor form corrections'
    ],
    highlights: [
      'Real-Time Heart-Rate Wall Display',
      'Complimentary Fresh Sweat Towels',
      'One-Click Mobile Class Booking',
      'Beginner to Advanced Scalability'
    ],
    hours: 'Morning, Noon, and Evening sessions Monday through Saturday',
    access: 'Unlimited on Pulse & Elite (Drop-in passes available for Starter)',
    idealFor: ['Accountability', 'High-Energy Cardio', 'Flexibility & Flow', 'Total Body Sculpting'],
    plan: 'Pulse Plan ($49/mo)'
  },
  {
    id: 'pt',
    title: 'Personal Training Pods',
    category: '1-on-1 Coaching',
    icon: 'fa-solid fa-user-check',
    status: 'Certified Coaches On-Site',
    tagline: 'Private coaching pods, biomechanical motion analysis, and periodized blueprints.',
    image: 'assets/images/facility_deadlift_focus.jpg',
    altImage: 'assets/images/trainer_marcus.jpg',
    altImageCaption: 'Head Strength Coach Marcus',
    desc: 'Fast-track your personal fitness milestones with IronPulse Master Coaches. We combine clinical biomechanical screening, 3D motion-capture bar path analysis, and periodized nutritional programming tailored to your unique anatomy. Sessions occur in dedicated semi-private pods away from general floor traffic.',
    specs: [
      'Dedicated semi-private coaching pods equipped with private cages & platforms',
      'High-speed 3D motion analysis & bar velocity feedback cameras',
      'Comprehensive FMS functional movement baseline assessment',
      'Periodized programming delivered directly via IronPulse mobile app',
      'Master Coaches holding CSCS, NASM-CPT, and USA Weightlifting credentials',
      'Private 1:1 and semi-private 2:1 coaching formats available'
    ],
    highlights: [
      'Monthly InBody 570 Scans Included',
      'Direct WhatsApp & In-App Coach Access',
      'Dedicated Warm-Up & Mobility Zone',
      'Custom Macro & Nutrition Blueprints'
    ],
    hours: 'Bookable with your coach 6:00 AM – 9:00 PM Daily',
    access: 'Included with Elite Plan or standalone coaching packs',
    idealFor: ['Beginner Guidance', 'Breaking Strength Plateaus', 'Post-Rehab Conditioning', 'Competitive Lifters'],
    plan: 'Elite Plan ($89/mo)'
  },
  {
    id: 'recovery',
    title: 'Nordic Recovery Lounge',
    category: 'Restoration & Wellness',
    icon: 'fa-solid fa-hot-tub-person',
    status: 'Luxury Recovery Suite',
    tagline: 'Scandinavian cedar sauna, eucalyptus steam, cold plunge, and Theraguns.',
    image: 'assets/images/facility_recovery_sauna.jpg',
    altImage: 'assets/images/facility_locker_room.jpg',
    altImageCaption: 'Spa Dressing Suites',
    desc: 'True athletic performance is built in recovery. Our Nordic Recovery Lounge features contrast therapy to slash inflammation, flush metabolic waste, and stimulate parasympathetic relaxation. Move between our 190°F Finnish cedar sauna, cold plunge tubs cooled to 48°F, eucalyptus steam room, and Theragun massage percussive stations.',
    specs: [
      'Authentic Finnish Scandinavian cedar sauna (heats up to 190°F / 88°C)',
      'Herbal eucalyptus aromatherapy steam room with continuous vapor',
      'Dual continuous-chilled cold plunge tubs maintained at 48°F / 9°C',
      '4x Commercial Theragun PRO massage stations with sanitation wipes',
      'Normatec 3 dynamic pneumatic leg compression boots',
      'Zero-gravity heated lounge recliners with ambient acoustic soundscapes'
    ],
    highlights: [
      'Chilled Eucalyptus Towels on Ice',
      'Infused Alkaline Mineral Hydration Bar',
      'Strict Quiet Relaxation Policy',
      'Private Rinse Showers Adjacent'
    ],
    hours: 'Mon–Fri 6:00 AM – 10:30 PM • Sat–Sun 7:00 AM – 8:00 PM',
    access: 'Unlimited with Pulse & Elite memberships',
    idealFor: ['Muscle Soreness Relief', 'Contrast Therapy', 'Immune System Boost', 'Deep Sleep Optimization'],
    plan: 'Pulse Plan ($49/mo)'
  },
  {
    id: 'nutrition',
    title: 'Nutrition & Smoothie Bar',
    category: 'Fuel & Dietetics',
    icon: 'fa-solid fa-apple-whole',
    status: 'Whole Food Fuel Bar',
    tagline: 'Clinical InBody 570 body scans, certified diet plans, and clean fuel shakes.',
    image: 'assets/images/facility_smoothie_bar.jpg',
    altImage: 'assets/images/trainer_priya.jpg',
    altImageCaption: 'Nutrition Coach Priya',
    desc: 'Training breaks down muscle—nutrition builds it back stronger. At our on-site fuel bar and nutrition consulting suite, certified sports nutritionists analyze your body composition with clinical InBody 570 scans and provide practical, delicious meal strategies. Refuel immediately after your session with zero-sugar, grass-fed protein smoothies.',
    specs: [
      'Clinical InBody 570 medical multi-frequency body composition analyzer',
      'Direct consultation with registered sports nutritionists',
      'Personalized daily caloric, macro, and hydration targets',
      'Over 14 handcrafted artisan protein smoothies with organic ingredients',
      'Grass-fed whey isolate, micellar casein, and organic plant proteins',
      'Grab-and-go vacuum-sealed macro meal prep from local culinary partners'
    ],
    highlights: [
      'Zero Artificial Syrups or Fillers',
      'Free InBody Scan with Pulse & Elite Plans',
      'Cold Brew & Organic Espresso Available',
      'Pre-Workout & BCAA Drink Dispensers'
    ],
    hours: 'Mon–Fri 6:30 AM – 8:30 PM • Sat 7:30 AM – 4:00 PM',
    access: 'Open to all members and public guests',
    idealFor: ['Lean Muscle Hypertrophy', 'Healthy Fat Loss', 'Athletic Energy & Recovery', 'Lifestyle Health'],
    plan: 'Pulse Plan ($49/mo)'
  },
  {
    id: 'extras',
    title: 'Executive Member Suites',
    category: 'Comfort & Luxury',
    icon: 'fa-solid fa-shower',
    status: 'Executive Locker Suites',
    tagline: 'Walnut keypad lockers, rainfall showers, Malin+Goetz apothecary, and fiber Wi-Fi.',
    image: 'assets/images/facility_locker_room.jpg',
    altImage: 'assets/images/facility_reception.jpg',
    altImageCaption: 'Welcome Lounge & Desk',
    desc: 'Designed for effortless transitions between hard training and your busy workday. Our executive locker suites provide the quiet luxury of a boutique hotel: electronic keypad lockers, private rainfall showers, plush Turkish cotton towels, and Malin+Goetz grooming essentials. Unwind before or after your workout in our co-working member lounge.',
    specs: [
      '120+ dark walnut lockers with individual digital electronic keypad locks',
      '12x private high-pressure rainfall shower suites with frosted glass doors',
      'Complimentary luxury Malin+Goetz shampoo, conditioner, and body wash',
      'Dyson Supersonic hair styling stations and illuminated grooming mirrors',
      'Plush 100% Turkish cotton shower towels and gym sweat towels',
      'Private co-working lounge with gigabit fiber Wi-Fi & laptop charging desks',
      'Private gated 85-vehicle parking lot with security cameras free for members'
    ],
    highlights: [
      'Keyless RFID Wristband & Phone Entry',
      'Overnight Locker & Laundry Service (Elite Tier)',
      'Chilled Bottled Water & Espresso Bar',
      'Private Dressing Stalls'
    ],
    hours: 'Accessible during all club operating hours',
    access: 'Included with all memberships',
    idealFor: ['Pre-Work Morning Lifters', 'Lunch Break Warriors', 'Remote Professionals', 'All Members'],
    plan: 'Pulse Plan ($49/mo)'
  }
];

let currentFacilityIndex = 0;

function updateFacilityModal(index) {
  currentFacilityIndex = (index + facilityData.length) % facilityData.length;
  const f = facilityData[currentFacilityIndex];
  if (!f) return;

  const modalImg = document.getElementById('facilityModalImage');
  const modalBadge = document.getElementById('facilityModalBadge');
  const modalCounter = document.getElementById('facilityModalCounter');
  const modalIcon = document.getElementById('facilityModalIcon');
  const modalTitle = document.getElementById('facilityModalTitle');
  const modalTagline = document.getElementById('facilityModalTagline');
  const modalStatus = document.getElementById('facilityModalStatus');
  const modalDesc = document.getElementById('facilityModalDesc');
  const modalSpecs = document.getElementById('facilityModalSpecs');
  const modalHighlights = document.getElementById('facilityModalHighlights');
  const modalAltImg = document.getElementById('facilityModalAltImage');
  const modalAltCaption = document.getElementById('facilityModalAltCaption');
  const modalHours = document.getElementById('facilityModalHours');
  const modalAccess = document.getElementById('facilityModalAccess');
  const modalIdeal = document.getElementById('facilityModalIdeal');
  const trialBtn = document.getElementById('facilityBookTrialBtn');

  if (modalImg) {
    modalImg.src = f.image;
    modalImg.alt = f.title + ' at IronPulse';
  }
  if (modalBadge) modalBadge.textContent = f.category;
  if (modalCounter) modalCounter.textContent = `Amenity ${currentFacilityIndex + 1} of ${facilityData.length}`;
  if (modalIcon) modalIcon.innerHTML = `<i class="${f.icon}"></i>`;
  if (modalTitle) modalTitle.textContent = f.title;
  if (modalTagline) modalTagline.textContent = f.tagline;
  if (modalStatus) modalStatus.textContent = f.status;
  if (modalDesc) modalDesc.textContent = f.desc;

  if (modalSpecs) {
    modalSpecs.innerHTML = f.specs.map(spec => `
      <div class="facility-spec-card">
        <i class="fa-solid fa-circle-check"></i>
        <span>${spec}</span>
      </div>
    `).join('');
  }

  if (modalHighlights) {
    modalHighlights.innerHTML = f.highlights.map(hl => `
      <span class="facility-highlight-chip">
        <i class="fa-solid fa-star"></i>
        <span>${hl}</span>
      </span>
    `).join('');
  }

  if (modalAltImg) {
    modalAltImg.src = f.altImage;
    modalAltImg.alt = f.altImageCaption;
  }
  if (modalAltCaption) modalAltCaption.textContent = f.altImageCaption;
  if (modalHours) modalHours.textContent = f.hours;
  if (modalAccess) modalAccess.textContent = f.access;

  if (modalIdeal) {
    modalIdeal.innerHTML = f.idealFor.map(tag => `
      <span class="facility-ideal-tag">${tag}</span>
    `).join('');
  }

  if (trialBtn) {
    trialBtn.setAttribute('data-plan', f.plan);
    trialBtn.setAttribute('data-facility', f.title);
  }

  // Scroll body back to top on switch
  const modalBody = document.querySelector('.facility-modal-body');
  if (modalBody) modalBody.scrollTop = 0;
}

function initFacilityModals() {
  const cards = document.querySelectorAll('.facility-card[data-facility]');
  if (!cards.length) return;

  cards.forEach(card => {
    const openCard = () => {
      const facId = card.getAttribute('data-facility');
      const idx = facilityData.findIndex(f => f.id === facId);
      if (idx !== -1) {
        updateFacilityModal(idx);
        openModal('facilityDetailModal');
      }
    };

    // Click event
    card.addEventListener('click', openCard);

    // Keyboard accessibility (Enter or Space)
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openCard();
      }
    });
  });

  // Previous & Next navigation buttons
  const prevBtn = document.getElementById('facilityPrevBtn');
  const nextBtn = document.getElementById('facilityNextBtn');

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      updateFacilityModal(currentFacilityIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      updateFacilityModal(currentFacilityIndex + 1);
    });
  }

  // Keyboard navigation when modal is open (ArrowLeft / ArrowRight)
  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('facilityDetailModal');
    if (!modal || !modal.classList.contains('open')) return;

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      updateFacilityModal(currentFacilityIndex - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      updateFacilityModal(currentFacilityIndex + 1);
    }
  });

  // Modal close buttons
  const closeBtn = document.getElementById('facilityModalClose');
  const closeBottomBtn = document.getElementById('facilityModalCloseBottom');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeModal('facilityDetailModal'));
  }
  if (closeBottomBtn) {
    closeBottomBtn.addEventListener('click', () => closeModal('facilityDetailModal'));
  }

  // "Claim Free Pass" inside facility modal
  const trialBtn = document.getElementById('facilityBookTrialBtn');
  if (trialBtn) {
    trialBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const plan = trialBtn.getAttribute('data-plan') || 'Pulse Plan ($49/mo)';
      closeModal('facilityDetailModal');
      setTimeout(() => {
        const select = document.getElementById('trialPlanSelect');
        if (select) select.value = plan;
        openModal('trialModal');
      }, 150);
    });
  }
}

