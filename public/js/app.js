alert("app.js alanındasınız");

// Toastify
const showToast =(message, type="info")=>{

}

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
    if(!nameInput.value || nameInput.value.trim().length < 3) {
      isValid = false;
      alert('İsim en az 3 karakter olmalıdır.');
      nameInput.classList.add('is-invalid');
      nameInput.classList.remove('is-invalid');
    } else{
      nameInput.classList.remove('is-invalid');
      nameInput.classList.add('is-valid');
    }

    // email alanınını en az 8 karkter olup olmadığını kontrol etsin
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailInput.value || emailRegex.test ||emailInput.value.trim().length < 8 ) {
      isValid = false;
      alert('Email en az 8 karakter olmalıdır.');
      emailInput.classList.add('is-invalid');
      emailInput.classList.remove('is-invalid');
    } else{
      emailInput.classList.remove('is-invalid');
      emailInput.classList.add('is-valid');
    }

    // password alanınını en az 6 karakter olup olmadığını kontrol etsin
    if(!passwordInput.value || passwordInput.value.trim().length < 6) {
      isValid = false;
      alert('Şifre en az 6 karakter olmalıdır.');
      passwordInput.classList.add('is-invalid');
      passwordInput.classList.remove('is-invalid');
    } else{
      passwordInput.classList.remove('is-invalid');
      passwordInput.classList.add('is-valid');
    }

    // Şifre ve onay şifresi eşleşme kontrolü
    if(!passwordInput.value || passwordInput.value !== confirmPasswordInput.value) {
      isValid = false;
      alert('Şifre ve onay şifresi eşleşmiyor.');
      confirmPasswordInput.classList.add('is-invalid');
      confirmPasswordInput.classList.remove('is-invalid');
    }

    // Eğer form gerçli değilse, submit sen dur hiç bir şey yapma  kullancıya hata gösteriyorum
    // if(isValid === false) {
    //   return;
    // }
    if(!isValid)  {
      return;
    }
    
    // Eğer tüm validasyonlar geçtiyse, formu submit et
    registerForm.submit();

  }); // end registerForm submit event listener
} // end of initRegisterFormValidation

// Login form validation
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
    if (!emailInput.value || emailRegex.test || emailInput.value.trim().length < 8) {
      isValid = false;
      alert('Email en az 8 karakter olmalıdır.');
      emailInput.classList.add('is-invalid');
      emailInput.classList.remove('is-invalid');
    } else {
      emailInput.classList.remove('is-invalid');
      emailInput.classList.add('is-valid');
    }

    // password alanınını en az 6 karakter olup olmadığını kontrol etsin
    if (!passwordInput.value || passwordInput.value.trim().length < 6) {
      isValid = false;
      alert('Şifre en az 6 karakter olmalıdır.');
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


// Sayfa yüklendiğinde form validasyonlarını başlat
document.addEventListener('DOMContentLoaded', function () {
  initRegisterFormValidation();
  initLoginFormValidation();
});



