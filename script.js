/**
 * Hafiz Talha Raza Attari - Digital Portfolio & Admissions
 * Pure Vanilla JavaScript (Ultra-Fast, No External Dependencies)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- 1. Dynamic Year in Footer ---
  const currentYearEl = document.getElementById('currentYear');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  // --- 2. Header Scroll Effect & Active Nav Link Highlighting ---
  const siteHeader = document.getElementById('header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');

  const handleScroll = () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Header background change
    if (siteHeader) {
      if (scrollY > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
      if (scrollY > 450) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Highlight current section in navbar
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Smooth scroll for Back-To-Top button
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- 3. Mobile Navigation Drawer ---
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  const openDrawer = () => {
    if (mobileDrawer) {
      mobileDrawer.classList.add('active');
      mobileDrawer.setAttribute('aria-hidden', 'false');
      if (mobileMenuToggle) mobileMenuToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeDrawer = () => {
    if (mobileDrawer) {
      mobileDrawer.classList.remove('active');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      if (mobileMenuToggle) mobileMenuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  };

  if (mobileMenuToggle) mobileMenuToggle.addEventListener('click', openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // --- 4. Rotating Role Words / Cycling Animation in Hero ---
  const cycleItems = document.querySelectorAll('#roleCycleBox .cycle-item');
  if (cycleItems.length > 0) {
    let currentIdx = 0;
    setInterval(() => {
      const prevItem = cycleItems[currentIdx];
      prevItem.classList.remove('active');
      prevItem.classList.add('leaving');

      setTimeout(() => {
        prevItem.classList.remove('leaving');
      }, 500);

      currentIdx = (currentIdx + 1) % cycleItems.length;
      cycleItems[currentIdx].classList.add('active');
    }, 3000);
  }

  // --- 5. Real-Time Authentic Metrics Animated Counter ---
  const counterElements = document.querySelectorAll('.counter-val');
  let countersAnimated = false;

  const animateCounters = () => {
    counterElements.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const duration = 1800; // ms
      const stepTime = 25;
      const totalSteps = duration / stepTime;
      const increment = target / totalSteps;
      let currentVal = 0;

      const updateCounter = () => {
        currentVal += increment;
        if (currentVal < target) {
          counter.textContent = Math.ceil(currentVal);
          setTimeout(updateCounter, stepTime);
        } else {
          counter.textContent = target;
        }
      };

      updateCounter();
    });
  };

  const metricsSection = document.getElementById('metrics');
  if (metricsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          animateCounters();
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    observer.observe(metricsSection);
  } else {
    // Fallback if IntersectionObserver is unsupported
    animateCounters();
  }

  // --- 6. Facebook Reviews Category Filter & Interaction ---
  const filterBtns = document.querySelectorAll('.reviews-filter-bar .filter-btn');
  const fbCards = document.querySelectorAll('.fb-comments-grid .fb-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      fbCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Facebook Like Button Toggle
  const fbLikeBtns = document.querySelectorAll('.fb-action-btn:first-child');
  fbLikeBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      this.classList.toggle('fb-liked');
      const countEl = this.closest('.fb-card').querySelector('.reaction-count');
      if (countEl) {
        let currentCount = parseInt(countEl.textContent, 10) || 0;
        if (this.classList.contains('fb-liked')) {
          countEl.textContent = currentCount + 1;
        } else {
          countEl.textContent = Math.max(0, currentCount - 1);
        }
      }
    });
  });

  // --- 7. Digital CV Modal Handling ---
  const quickCvBtn = document.getElementById('quickCvBtn');
  const cvModal = document.getElementById('cvModal');
  const cvModalClose = document.getElementById('cvModalClose');
  const cvModalBackdrop = document.getElementById('cvModalBackdrop');

  const openCvModal = () => {
    if (cvModal) {
      cvModal.classList.add('active');
      cvModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeCvModal = () => {
    if (cvModal) {
      cvModal.classList.remove('active');
      cvModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  if (quickCvBtn) quickCvBtn.addEventListener('click', openCvModal);
  if (cvModalClose) cvModalClose.addEventListener('click', closeCvModal);
  if (cvModalBackdrop) cvModalBackdrop.addEventListener('click', closeCvModal);

  // --- 8. Student Admission Form (Form-to-WhatsApp Mechanism) ---
  const admissionForm = document.getElementById('studentAdmissionForm');
  const submissionModal = document.getElementById('submissionModal');
  const submissionModalBackdrop = document.getElementById('submissionModalBackdrop');
  const closeSubmissionModalBtn = document.getElementById('closeSubmissionModalBtn');
  const waFormattedPreview = document.getElementById('waMessageFormattedPreview');
  const directWhatsAppLink = document.getElementById('directWhatsAppLink');

  // Input Fields
  const studentNameInput = document.getElementById('studentName');
  const fatherNameInput = document.getElementById('fatherName');
  const studentAgeInput = document.getElementById('studentAge');
  const studentQualInput = document.getElementById('studentQualification');
  const contactNumberInput = document.getElementById('contactNumber');
  const studentAddressInput = document.getElementById('studentAddress');
  const studentDobInput = document.getElementById('studentDob');
  const preferredCourseSelect = document.getElementById('preferredCourse');
  const preferredTimeInput = document.getElementById('preferredTime');
  const studentNotesTextarea = document.getElementById('studentNotes');

  // Error validation utility
  const validateField = (input, errorId, condition) => {
    const errorEl = document.getElementById(errorId);
    if (!condition) {
      input.classList.add('invalid');
      if (errorEl) errorEl.classList.add('visible');
      return false;
    } else {
      input.classList.remove('invalid');
      if (errorEl) errorEl.classList.remove('visible');
      return true;
    }
  };

  // Real-time clearance of invalid errors on input
  [studentNameInput, fatherNameInput, studentAgeInput, studentQualInput, contactNumberInput, studentAddressInput, studentDobInput].forEach(input => {
    if (input) {
      input.addEventListener('input', () => {
        input.classList.remove('invalid');
        const err = input.closest('.form-group')?.querySelector('.error-msg');
        if (err) err.classList.remove('visible');
      });
    }
  });

  if (admissionForm) {
    admissionForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Run validations
      const isNameValid = validateField(studentNameInput, 'studentNameError', studentNameInput.value.trim().length >= 2);
      const isFatherValid = validateField(fatherNameInput, 'fatherNameError', fatherNameInput.value.trim().length >= 2);
      const ageNum = parseInt(studentAgeInput.value, 10);
      const isAgeValid = validateField(studentAgeInput, 'studentAgeError', !isNaN(ageNum) && ageNum >= 4 && ageNum <= 75);
      const isQualValid = validateField(studentQualInput, 'studentQualificationError', studentQualInput.value.trim().length >= 2);
      const isContactValid = validateField(contactNumberInput, 'contactNumberError', contactNumberInput.value.trim().length >= 7);
      const isAddressValid = validateField(studentAddressInput, 'studentAddressError', studentAddressInput.value.trim().length >= 2);
      const isDobValid = validateField(studentDobInput, 'studentDobError', studentDobInput.value.trim().length > 0);

      if (!isNameValid || !isFatherValid || !isAgeValid || !isQualValid || !isContactValid || !isAddressValid || !isDobValid) {
        // Focus on first invalid input
        const firstInvalid = admissionForm.querySelector('.form-control.invalid');
        if (firstInvalid) {
          firstInvalid.focus();
        }
        return;
      }

      // Collect Data
      const studentName = studentNameInput.value.trim();
      const fatherName = fatherNameInput.value.trim();
      const age = studentAgeInput.value.trim();
      const qualification = studentQualInput.value.trim();
      const contactNumber = contactNumberInput.value.trim();
      const address = studentAddressInput.value.trim();
      const dob = studentDobInput.value.trim();
      const selectedCourse = preferredCourseSelect ? preferredCourseSelect.value : 'Madani Qaida';
      const preferredTime = preferredTimeInput && preferredTimeInput.value.trim() ? preferredTimeInput.value.trim() : 'Flexible / To be coordinated';
      const notes = studentNotesTextarea && studentNotesTextarea.value.trim() ? studentNotesTextarea.value.trim() : 'None';

      // Format WhatsApp Message (Clean, professional formatting with emojis)
      const waText = 
`*بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ*
*NEW STUDENT ADMISSION & DEMO CLASS APPLICATION*
----------------------------------------
👤 *Student Full Name:* ${studentName}
👨 *Father / Guardian:* ${fatherName}
🎂 *Age:* ${age} Years
🎓 *Qualification / Grade:* ${qualification}
📱 *Contact / WhatsApp:* ${contactNumber}
📍 *Address & Country:* ${address}
📅 *Date of Birth:* ${dob}
📖 *Preferred Course:* ${selectedCourse}
⏰ *Preferred Timezone/Slot:* ${preferredTime}
📝 *Student Learning Goals/Notes:* ${notes}
----------------------------------------
_Submitted via Hafiz Talha Raza Attari Online Portal_
_WhatsApp: 03126571673_`;

      // Target WhatsApp phone (923126571673)
      const targetWhatsAppNumber = '923126571673';
      const encodedMessage = encodeURIComponent(waText);
      const waUrl = `https://wa.me/${targetWhatsAppNumber}?text=${encodedMessage}`;

      // Update Modal content
      if (waFormattedPreview) {
        waFormattedPreview.textContent = waText;
      }

      if (directWhatsAppLink) {
        directWhatsAppLink.href = waUrl;
      }

      // Open Modal
      if (submissionModal) {
        submissionModal.classList.add('active');
        submissionModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }

      // Automatically launch WhatsApp in new tab
      try {
        window.open(waUrl, '_blank');
      } catch (err) {
        console.warn('Popup blocked, fallback to manual link in modal', err);
      }
    });
  }

  // Close Submission Modal
  const closeSubmissionModal = () => {
    if (submissionModal) {
      submissionModal.classList.remove('active');
      submissionModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  if (closeSubmissionModalBtn) closeSubmissionModalBtn.addEventListener('click', closeSubmissionModal);
  if (submissionModalBackdrop) submissionModalBackdrop.addEventListener('click', closeSubmissionModal);

  // Close modals on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      closeCvModal();
      closeSubmissionModal();
    }
  });

});
