// server.js - Express +EJS Sunucu ayağa kaldırma

// Node.js tarafıdnan Express framework dahil eder
const express = require('express');

// HTTP Post isterklerinden form verilerini (urlencoded) ayrıştırmak(okumak) için body-parser dahil et
const bodyParser = require('body-parser');

// Oturum(session) yönetimi için express-session dahil et
const session = require('express-session');

// Yeni bir Express uygulaması oluştur
const app = express();

// Sunucunun dinleyeceği port numarası
const PORT = 3000;

// Bu dizi, kullanıcı verilerini geçici olarak depolamak için (RAM hafıza) kullanılacak
// Dikkat: Gerçek projelerde veritabanı kullanılmaktadır
const users = [];

////////////////////////////////////////////////////////////////////
////  EJS //////////////////////////////////////////////////////////
// EJS'yi görünüm motoru(şablon motoru) olarak ayarla (view engine)
app.set('view engine', 'ejs');

// EJS view dosyalarının bulunduğu klasörü ayarla
const path = require('path');
app.set('views', path.join(__dirname, 'views'));

// Statik dosyalar için 'public' klasörünü kullan
// app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

// Body-parser'ı kullanarak URL kodlu verileri ayrıştır(parse)
// Form verileri (application/x-www-form-urlencoded) için
app.use(bodyParser.urlencoded({ extended: true }));

////////////////////////////////////////////////////////////////////
//// SESSION ////////////////////////////////////////////////////////
// Express-session'ı kullanarak oturum yönetimini(login olmuş kullanıcılar) etkinleştir
app.use(
  session({
    secret: 'gizliAnahtar', // Oturum gizliliği için bir gizli anahtar
    resave: false, // her istektre session tekrar kaydetme
    saveUninitialized: true, // Boş(kullanılmayan) yeni oturumları kaydet
  })
);

////////////////////////////////////////////////////////////////////
///// GLOBAL MIDDLEWARE  ///////////////////////////////////////////
// Her istekte çalışacak middleware
app.use((req, res, next) => {
  // Eğer kullanıcı oturumu açıksa, kullanıcı e-posta adresini yerel değişkene ata
  res.locals.currentUserEmail = req.session.userEmail || null;

  // Sonsuz döngüsü engellemekj
  next();
});

///////////////////////////////////////////////////////////////////
/////// LINK //////////////////////////////////////////////////////
// http://localhost:3000
// http://localhost:3000/home
// http://localhost:3000/register
// http://localhost:3000/login
// http://localhost:3000/admin_page
// http://localhost:3000/logout

///////////////////////////////////////////////////////////////////
//// ROUTER (HOME PAGE )///////////////////////////////////////////
// Ana sayfa (home) için GET isteğini handle etmek
app.get('/', (req, res) => {
  res.render('home', {
    title: 'Ana Sayfa',
  });
});

/////////////////////////////////////////////////////////////////////
//// ROUTER AND PAGES (REGİSTER GET/POST )///////////////////////////
// http://localhost:3000/register
// Register Formu için GET isteğini handle etmek
app.get('/register', (req, res) => {
  res.render('register', {
    title: 'Kayıt Ol',
    errors: [],
    formData: { name: '', email: '', password: '', confirmPassword: '' },
  });
});

// http://localhost:3000/register
// Register Formu için GET isteğini handle etmek
app.post('/register', (req, res) => {
  // Formdan gelen verileri body üzerinden al
  const { name, email, password, confirmPassword } = req.body;

  ///// ERROR   /////////////////////////////////////////////////////
  // Hata mesajlarını depolamak için bir dizi oluştur
  const errors = [];

  ////  VALIDATION ///////////////////////////////////////////////
  // Validation kontrolleri
  if (!name || !email || !password || !confirmPassword) {
    errors.push('Lütfen tüm alanları doldurun.');
  }

  // Validation kontrolleri (name)
  if (name.trim().length < 3) {
    errors.push('isim en az 3 karakter olmalıdır.');
  }

  // Validation kontrolleri (email and regex)
  if (email.trim().length < 8) {
    errors.push('mail için en az 8 karakter olmalıdır.');
  } else {
    // Basit email format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('Geçerli bir e-posta adresi girin.');
    }
  }

  // Aynı mail ile kayıtlı kullanıcı kontrolü
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    errors.push('Bu e-posta adresi zaten kayıtlı.');
  }

  // Validation kontrolleri (password)
  if (password.trim().length < 6) {
    errors.push('şifre için en az 6 karakter olmalıdır.');
  }

  // Şifre ve onay şifresi eşleşme kontrolü
  if (password !== confirmPassword) {
    errors.push('Şifre ve onay şifresi eşleşmiyor.');
  }

  // Eğer hatalar varsa, formu tekrar render et ve hataları göster
  if (errors.length > 0) {
    return res.render('register', {
      title: 'Kayıt Ol',
      errors,
      formData: { name, email, password, confirmPassword },
    });
  }

  // Hata yoksa, yeni kullanıcıyı users dizisine ekle
  users.push({ name, email, password });

  // Başarılı kayıt olduktan sonra login sayafsına yönlendirmesi gerekiyor
  res.redirect('/login');
}); //end register

/////////////////////////////////////////////////////////////////////
//// PAGES (LOGIN GET/POST )/////////////////////////////////////////
// http://localhost:3000/login
// Login Formu için GET isteğini handle etmek
app.get('/login', (req, res) => {
  res.render('login', {
    title: 'Giriş Yap',
    errors: [],
    formData: { email: '', password: '' },
  });
});

// http://localhost:3000/login
// login Formu için GET isteğini handle etmek
app.post('/login', (req, res) => {
  // Formdan gelen verileri body üzerinden al
  const { email, password } = req.body;

  ///// ERROR   ////////////
  // Hata mesajlarını depolamak için bir dizi oluştur
  const errors = [];

  ///// email, password eşleştirilmesi
  // Hata mesajlarını depolamak için bir dizi oluştur
  const user = users.find((user) => user.email === email && user.password === password);

  // Eğer kullanıcı bulunamazsa hata mesajı ekle
  if (!user) {
    errors.push('Geçersiz e-posta veya şifre.');
  }

  // Eğer hatalar varsa, formu tekrar render et ve hataları göster
  if (errors.length > 0) {
    return res.render('login', {
      title: 'Giriş Yap',
      errors,
      formData: { email, password: '' },
    });
  }

  req.session.userEmail = user.email;

  // Başarılı girişten sonra admin ana sayfaya yönlendirme
  res.redirect('/admin_page');
}); //end login

/////////////////////////////////////////////////////////////////////
///// ADMIN PAGE (DASHBOARD) ////////////////////////////////////////
app.get('/admin_page', (req, res) => {
  // Eğer kullanıcı oturumu açık değilse, login sayfasına yönlendir
  if (!req.session.userEmail) {
    return res.redirect('/login');
  }

  // users dizisinden oturum açan kullanıcıyı bul ve bilgisi al
  const user = users.find((user) => user.email === req.session.userEmail);
  console.log(user);
  //window.alert(user);

  // EJS dashboard sayfasını render et ve kullanıcı bilgilerini gönder
  res.render('admin_page', {
    title: 'admin_page',
    user,
  });
}); //end admin_page

/////////////////////////////////////////////////////////////////////
///// ADMIN (LOGOUT) ////////////////////////////////////////////////
//http://localhost:3000/logout
app.get('/logout', (req, res) => {
  // Oturumu yok et (logout)
  req.session.destroy((err) => {
    res.redirect('/'); // Ana sayfaya yönlendir
  });
}); //end logout

/////////////////////////////////////////////////////////////////////
///// LISTENER /////////////////////////////////////////////////////
// Sunucuyu belirli bir portta dinlemeye başla
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
}); //end listener
