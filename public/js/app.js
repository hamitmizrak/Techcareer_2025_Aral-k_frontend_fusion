//alert('app.js alanındasınız');

// ======================================================================
// Import
// ======================================================================

// ======================================================================
// Toastify (showToast)
// ======================================================================
const showToast = (message, type = 'info') => {
  let background = '#3498db'; // info mavi

  if (type === 'success') {
    background = '#2ecc71'; // yeşil
  }

  if (type === 'error') {
    background = '#e74c3c'; // yeşil
  }

  if (type === 'warning') {
    background = '#d3de11ff'; // sarı
  }

  Toastify({
    text: message,
    duration: 3000,
    gravity: 'bottom', // `top` or `bottom`
    position: 'right', // `left`, `center` or `right`
    close: true,
    backgroundColor: background,
    stopOnFocus: true, // Prevents dismissing of toast on hover
  }).showToast();
};

// ======================================================================
// Auth işlemleri
// ======================================================================
(function handleAuthFromServer() {
  // Register
  if (window.afterRegister) {
    localStorage.setItem('user', JSON.stringify(window.afterRegister));
    showToast('Kayıt başarılı! Hoşgeldiniz ' + window.afterRegister.name, 'success');
    console.log('afterRegister', window.afterRegister);
    logger.info(`Kullanıcı kayıt oldu: ${email}`);
  }

  // Register
  if (window.afterLogin) {
    localStorage.setItem('user', JSON.stringify(window.afterLogin));
    showToast('Giriş başarılı! Hoşgeldiniz ' + window.afterLogin.name, 'success');
    console.log('afterRegister', window.afterLogin);
    logger.info(`Kullanıcı giriş yaptı: ${email}`);
  }
})();

// Register form validation
function initRegisterFormValidation() {
  // Register Form üzerinden DOM elemanlarını seç
  const registerForm = document.getElementById('registerForm');

  // Eğer sayfa Register Form değilse, fonksiyondan çık
  if (!registerForm) {
    return;
  }

  // Form submit olayısını yakalasın
  registerForm.addEventListener('submit', function (event) {
    // Browser'ın varsayılan form submit davranışını engelle
    event.preventDefault();

    // formData: { name: '', email: '', password: '', confirmPassword: '' },
    // Register form alanlarındaki input verileri seç
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    // Form genel geçerlilik durumu
    let isValid = true;

    // isim alanınını en az 3 karkter olup olmadığını kontrol etsin
    if (!nameInput.value || nameInput.value.trim().length < 3) {
      isValid = false;

      showToast('İsim en az 3 karakter olmalıdır.', 'error');
      logger.warn('Kayıt formu geçersiz: İsim en az 3 karakter olmalıdır.');

      nameInput.classList.add('is-invalid');
      nameInput.classList.remove('is-invalid');
    } else {
      nameInput.classList.remove('is-invalid');
      nameInput.classList.add('is-valid');
    }

    // email alanınını en az 8 karkter olup olmadığını kontrol etsin
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      !emailInput.value ||
      emailInput.value.trim().length < 8 ||
      !emailRegex.test(emailInput.value)
    ) {
      isValid = false;

      showToast('Geçerli bir e-posta giriniz (en az 8 karakter olmalıdır).', 'error');
      logger.warn('Kayıt formu geçersiz: İsim en az 3 karakter olmalıdır.');
      //alert('Email en az 8 karakter olmalıdır.');

      emailInput.classList.add('is-invalid');
      emailInput.classList.remove('is-invalid');
    } else {
      emailInput.classList.remove('is-invalid');
      emailInput.classList.add('is-valid');
    }

    // password alanınını en az 6 karakter olup olmadığını kontrol etsin
    if (!passwordInput.value || passwordInput.value.trim().length < 6) {
      isValid = false;

      showToast('Şifre  (en az 6 karakter olmalıdır).', 'error');
      logger.warn('Kayıt formu geçersiz: İsim en az 3 karakter olmalıdır.');
      //alert('Email en az 8 karakter olmalıdır.');

      passwordInput.classList.add('is-invalid');
      passwordInput.classList.remove('is-invalid');
    } else {
      passwordInput.classList.remove('is-invalid');
      passwordInput.classList.add('is-valid');
    }

    // Şifre ve onay şifresi eşleşme kontrolü
    if (!passwordInput.value || passwordInput.value !== confirmPasswordInput.value) {
      isValid = false;

      showToast('Şifre ve onay şifresi eşleşmiyor.', 'error');
      logger.warn('Şifre ve onay şifresi eşleşmiyor..');
      //alert('Şifre ve onay şifresi eşleşmiyor.');

      confirmPasswordInput.classList.add('is-invalid');
      confirmPasswordInput.classList.remove('is-invalid');
    }

    // Eğer form gerçli değilse, submit sen dur hiç bir şey yapma  kullanıcıya hata gösteriyorum
    // if(isValid === false) {
    //   return;
    // }
    if (!isValid) {
      return;
    }

    // Eğer tüm validasyonlar geçtiyse, formu submit et
    registerForm.submit();
  }); // end registerForm submit event listener
} // end of initRegisterFormValidation

// ======================================================================
// Login form validation
// ======================================================================
function initLoginFormValidation() {
  // Login Form üzerinden DOM elemanlarını seç
  const loginForm = document.getElementById('loginForm');

  // Eğer sayfa Login Form değilse, fonksiyondan çık
  if (!loginForm) {
    return;
  }

  // Form submit olayısını yakalasın
  loginForm.addEventListener('submit', function (event) {
    // Browser'ın varsayılan form submit davranışını engelle
    event.preventDefault();

    // formData: { name: '', email: '', password: '', confirmPassword: '' },
    // Register form alanlarındaki input verileri seç
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // Form genel geçerlilik durumu
    let isValid = true;

    // email alanınını en az 8 karkter olup olmadığını kontrol etsin
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      !emailInput.value ||
      emailInput.value.trim().length < 8 ||
      !emailRegex.test(emailInput.value)
    ) {
      isValid = false;

      showToast('Email en az 8 karakter olmalıdır.', 'error');
      logger.warn('Email en az 8 karakter olmalıdır...');
      //alert('Şifre ve onay şifresi eşleşmiyor.');

      emailInput.classList.add('is-invalid');
      emailInput.classList.remove('is-invalid');
    } else {
      emailInput.classList.remove('is-invalid');
      emailInput.classList.add('is-valid');
    }

    // password alanınını en az 6 karakter olup olmadığını kontrol etsin
    if (!passwordInput.value || passwordInput.value.trim().length < 6) {
      isValid = false;

      showToast('Şifre en az 6 karakter olmalıdır..', 'error');
      logger.warn('Şifre en az 6 karakter olmalıdır..');
      //alert('Şifre en az 6 karakter olmalıdır.');

      passwordInput.classList.add('is-invalid');
      passwordInput.classList.remove('is-invalid');
    } else {
      passwordInput.classList.remove('is-invalid');
      passwordInput.classList.add('is-valid');
    }

    // Eğer form gerçli değilse, submit sen dur hiç bir şey yapma  kullancıya hata gösteriyorum
    // if(isValid === false) {
    //   return;
    // }
    if (!isValid) {
      return;
    }

    // Eğer tüm validasyonlar geçtiyse, formu submit et
    loginForm.submit();
  }); // end LoginForm submit event listener
} // end of initLoginFormValidation

// ======================================================================
// DOMContentLoaded
// ======================================================================
// Sayfa yüklendiğinde form validasyonlarını başlat
document.addEventListener('DOMContentLoaded', function () {
  // TOAST
  const toastData = window.toastMessage;
  if (toastData && toastData.message) {
    showToast(toastData.message, toastData.type || 'info');
  }

  // LocalStorage'dan kullanıcı bilgisi varsa navbar'da göstersin
  const userData = localStorage.getItem('user');
  const navRight = document.getElementById('navRightArea');

  // Eğer Login olunmuşsa
  if (userData && navRight) {
    const user = JSON.parse(userData);

    //nav-link
    navRight.innerHTML = `

      <li class="nav-item  me-1">
            <span class="navbar-text text-warning fw-bold">
              Hoşgeldiniz, ${user.name}
            </span>
      </li>

       <li class="nav-item  me-1">
           <a href="/admin_page" class=" btn btn-outline-primary">Admin Paneli</a>
      </li>

       <li class="nav-item  me-1">
           <a href="/logout" class="btn btn-outline-danger">Çıkış Yap</a>
      </li>
    `;
  } //end login

  // Logout linkine tıklanıldığında localStorage'ı temizle
  document.addEventListener('click', function (event) {
    const logoutLink = event.target.closest('a[href="/logout"]');
    if (logoutLink) {
      localStorage.removeItem('user');
    }
  });

  // Form Validasyonlarını başlat (Initialize form validations)
  initRegisterFormValidation();
  initLoginFormValidation();
});
