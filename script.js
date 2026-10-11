/**
 * HAFIZ TALHA RAZA ATTARI - PORTFOLIO & ONLINE ACADEMY
 * Vanilla JavaScript ES6+ Architecture
 * Fast, lightweight, zero external runtime dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initLanguageSwitcher();
  initReviewFilters();
  initAdmissionForm();
  initBackToTop();
  updateCurrentYear();
});

/* ==========================================================================
   1. NAVBAR & MOBILE DRAWER LOGIC
   ========================================================================== */
function initNavbar() {
  const header = document.getElementById('header');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');
  const drawerOverlay = document.getElementById('mobileDrawerOverlay');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky header class on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
    highlightActiveNavLink();
  });

  // Mobile menu toggle
  function toggleMobileMenu() {
    const isOpen = navMenu.classList.contains('open');
    if (isOpen) {
      navMenu.classList.remove('open');
      drawerOverlay.classList.remove('active');
      document.body.style.overflow = '';
    } else {
      navMenu.classList.add('open');
      drawerOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  }

  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', toggleMobileMenu);
  }

  // Close menu on nav link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        toggleMobileMenu();
      }
    });
  });

  // Highlight active link based on scroll section
  function highlightActiveNavLink() {
    const sections = document.querySelectorAll('section[id], header[id]');
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
}

/* ==========================================================================
   2. MULTI-LANGUAGE / SCRIPT VIEW TOGGLE
   ========================================================================== */
function initLanguageSwitcher() {
  const langBtns = document.querySelectorAll('.lang-btn');

  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      langBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const mode = btn.dataset.lang;
      const urduElements = document.querySelectorAll('.ur-text, .hero-desc-urdu, .title-urdu');

      if (mode === 'urdu') {
        document.body.classList.add('lang-urdu-priority');
        showToast('اردو فونٹ اور لے آؤٹ فعال کر دیا گیا ہے');
      } else {
        document.body.classList.remove('lang-urdu-priority');
        showToast('Bilingual English & Urdu view active');
      }
    });
  });
}

/* ==========================================================================
   3. INTERACTIVE FACEBOOK REVIEW CARDS
   ========================================================================== */
function initReviewFilters() {
  const filterBtns = document.querySelectorAll('.rf-btn');
  const cards = document.querySelectorAll('.fb-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.dataset.filter;

      cards.forEach(card => {
        const category = card.dataset.category;
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInCard 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// Like reaction toggle function
window.toggleCardLike = function(button, countId) {
  const countEl = document.getElementById(countId);
  let currentCount = parseInt(countEl.textContent, 10) || 0;
  const isLiked = button.classList.contains('liked');

  if (isLiked) {
    button.classList.remove('liked');
    button.querySelector('i').className = 'fa-regular fa-thumbs-up';
    countEl.textContent = currentCount - 1;
    showToast('Reaction removed');
  } else {
    button.classList.add('liked');
    button.querySelector('i').className = 'fa-solid fa-thumbs-up';
    countEl.textContent = currentCount + 1;
    showToast('Liked review! 👍');
  }
};

// Share review testimonial quote
window.shareTestimonial = function(reviewerName) {
  const text = `Read review by ${reviewerName} for Hafiz Talha Raza Attari's Online Quran Academy: https://wa.me/923126571673`;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`Review link for ${reviewerName} copied to clipboard!`);
    }).catch(() => {
      showToast('Review shared successfully!');
    });
  } else {
    showToast('Review shared!');
  }
};

// Reply box expand
window.openReplyBox = function(cardId) {
  const replyBox = document.getElementById(`reply-box-${cardId}`);
  if (replyBox) {
    replyBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    showToast('Viewing verified response by Hafiz Talha Raza');
  } else {
    showToast('Thank you for your feedback!');
  }
};

/* ==========================================================================
   4. COURSE ENROLLMENT HELPER
   ========================================================================== */
window.selectCourseOption = function(courseName) {
  const courseSelect = document.getElementById('selectedCourse');
  if (courseSelect) {
    for (let i = 0; i < courseSelect.options.length; i++) {
      if (courseSelect.options[i].text.toLowerCase().includes(courseName.toLowerCase())) {
        courseSelect.selectedIndex = i;
        break;
      }
    }
  }

  // Smooth scroll to admission form
  const admissionsSection = document.getElementById('admissions');
  if (admissionsSection) {
    admissionsSection.scrollIntoView({ behavior: 'smooth' });
    showToast(`Selected course: ${courseName}`);
  }
};

/* ==========================================================================
   5. STUDENT ADMISSIONS FORM LOGIC (7 REQUIRED FIELDS)
   ========================================================================== */
function initAdmissionForm() {
  const form = document.getElementById('admissionForm');
  const modal = document.getElementById('admissionModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const printReceiptBtn = document.getElementById('printReceiptBtn');
  const receiptContent = document.getElementById('receiptContent');
  const modalWaBtn = document.getElementById('modalWaBtn');

  if (!form) return;

  // Form Fields
  const studentNameInput = document.getElementById('studentName');
  const fatherNameInput = document.getElementById('fatherName');
  const studentAgeInput = document.getElementById('studentAge');
  const studentDobInput = document.getElementById('studentDob');
  const studentQualificationInput = document.getElementById('studentQualification');
  const contactNumberInput = document.getElementById('contactNumber');
  const studentAddressInput = document.getElementById('studentAddress');
  const selectedCourseInput = document.getElementById('selectedCourse');
  const preferredShiftInput = document.getElementById('preferredShift');

  // Input Validation Helper
  function validateField(input, errorId, condition) {
    const errorEl = document.getElementById(errorId);
    if (!condition) {
      input.classList.add('is-invalid');
      if (errorEl) errorEl.classList.add('visible');
      return false;
    } else {
      input.classList.remove('is-invalid');
      if (errorEl) errorEl.classList.remove('visible');
      return true;
    }
  }

  // Real-time clearance of invalid errors
  const inputsToTrack = [
    studentNameInput, fatherNameInput, studentAgeInput,
    studentDobInput, studentQualificationInput, contactNumberInput,
    studentAddressInput
  ];

  inputsToTrack.forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('is-invalid');
      const err = document.getElementById(input.id + 'Error');
      if (err) err.classList.remove('visible');
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Field 1: Student Name
    const isNameValid = validateField(
      studentNameInput, 
      'studentNameError', 
      studentNameInput.value.trim().length >= 2
    );

    // Field 2: Father Name
    const isFatherValid = validateField(
      fatherNameInput, 
      'fatherNameError', 
      fatherNameInput.value.trim().length >= 2
    );

    // Field 3: Age
    const ageVal = parseInt(studentAgeInput.value, 10);
    const isAgeValid = validateField(
      studentAgeInput, 
      'studentAgeError', 
      !isNaN(ageVal) && ageVal >= 3 && ageVal <= 85
    );

    // Field 7: Date of Birth
    const isDobValid = validateField(
      studentDobInput, 
      'studentDobError', 
      studentDobInput.value.trim().length > 0
    );

    // Field 4: Qualification
    const isQualValid = validateField(
      studentQualificationInput, 
      'studentQualificationError', 
      studentQualificationInput.value.trim().length >= 2
    );

    // Field 5: Contact Number
    const contactVal = contactNumberInput.value.trim();
    const isContactValid = validateField(
      contactNumberInput, 
      'contactNumberError', 
      contactVal.length >= 7
    );

    // Field 6: Address
    const isAddressValid = validateField(
      studentAddressInput, 
      'studentAddressError', 
      studentAddressInput.value.trim().length >= 4
    );

    if (!isNameValid || !isFatherValid || !isAgeValid || !isDobValid || !isQualValid || !isContactValid || !isAddressValid) {
      showToast('Please correct the highlighted fields in the form.');
      return;
    }

    // Extraction of form values
    const studentData = {
      name: studentNameInput.value.trim(),
      father: fatherNameInput.value.trim(),
      age: studentAgeInput.value.trim(),
      dob: studentDobInput.value,
      qualification: studentQualificationInput.value.trim(),
      contact: contactNumberInput.value.trim(),
      address: studentAddressInput.value.trim(),
      course: selectedCourseInput.value,
      shift: preferredShiftInput.value,
      regDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    // Format professional WhatsApp message string
    const waMessage = 
`*NEW STUDENT ADMISSION APPLICATION*
*Hafiz Talha Raza Attari Online Academy*
----------------------------------------
👤 *1. Student Name:* ${studentData.name}
👨‍👦 *2. Father Name:* ${studentData.father}
🎂 *3. Age:* ${studentData.age} Years
📅 *7. Date of Birth:* ${studentData.dob}
📚 *4. Qualification:* ${studentData.qualification}
📞 *5. Contact Number:* ${studentData.contact}
📍 *6. Address:* ${studentData.address}
----------------------------------------
📖 *Desired Course:* ${studentData.course}
⏰ *Preferred Shift:* ${studentData.shift}
🗓️ *Application Date:* ${studentData.regDate}
----------------------------------------
Assalam-o-Alaikum Hafiz Talha Raza! Please confirm my 3-Day Free Demo Trial Class.`;

    const encodedMessage = encodeURIComponent(waMessage);
    const waUrl = `https://wa.me/923126571673?text=${encodedMessage}`;

    // Populate Receipt Modal
    receiptContent.innerHTML = `
      <div class="receipt-title">Student Registration Slip #${Math.floor(100000 + Math.random() * 900000)}</div>
      <div class="receipt-grid">
        <div class="receipt-field"><span class="rf-label">Student Name:</span><span class="rf-val">${studentData.name}</span></div>
        <div class="receipt-field"><span class="rf-label">Father Name:</span><span class="rf-val">${studentData.father}</span></div>
        <div class="receipt-field"><span class="rf-label">Age:</span><span class="rf-val">${studentData.age} Years</span></div>
        <div class="receipt-field"><span class="rf-label">Date of Birth:</span><span class="rf-val">${studentData.dob}</span></div>
        <div class="receipt-field"><span class="rf-label">Qualification:</span><span class="rf-val">${studentData.qualification}</span></div>
        <div class="receipt-field"><span class="rf-label">Contact / WhatsApp:</span><span class="rf-val">${studentData.contact}</span></div>
        <div class="receipt-field" style="grid-column: span 2;"><span class="rf-label">Address:</span><span class="rf-val">${studentData.address}</span></div>
        <div class="receipt-field"><span class="rf-label">Course:</span><span class="rf-val text-gold">${studentData.course}</span></div>
        <div class="receipt-field"><span class="rf-label">Preferred Timing:</span><span class="rf-val">${studentData.shift}</span></div>
      </div>
    `;

    modalWaBtn.href = waUrl;

    // Show confirmation modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Also trigger direct WhatsApp in new tab for instant high-conversion flow
    window.open(waUrl, '_blank');

    showToast('Admission submitted! Opening WhatsApp...');
  });

  // Close Modal handlers
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Print Receipt
  if (printReceiptBtn) {
    printReceiptBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

/* ==========================================================================
   6. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const backBtn = document.getElementById('backToTopBtn');
  if (!backBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 450) {
      backBtn.classList.add('visible');
    } else {
      backBtn.classList.remove('visible');
    }
  });

  backBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   7. DYNAMIC YEAR
   ========================================================================== */
function updateCurrentYear() {
  const yr = document.getElementById('currentYear');
  if (yr) {
    yr.textContent = new Date().getFullYear();
  }
}

/* ==========================================================================
   8. TOAST NOTIFICATION HELPER
   ========================================================================== */
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toastNotification');
  const toastText = document.getElementById('toastText');

  if (!toast || !toastText) return;

  toastText.textContent = message;
  toast.classList.add('active');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('active');
  }, 3200);
}

// Fade in animation helper for filtered cards
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInCard {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .lang-urdu-priority .hero-desc { display: none; }
  .lang-urdu-priority .hero-desc-urdu { font-size: 1.35rem; }
`;
document.head.appendChild(style);
