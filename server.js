// server.js - Express +EJS Sunucu ayağa kaldırma

////////////////////////////////////////////////////////////////////
// LINK
////////////////////////////////////////////////////////////////////

// http://localhost:3000
// http://localhost:3000/home
// http://localhost:3000/register
// http://localhost:3000/login
// http://localhost:3000/admin_page
// http://localhost:3000/logout

////////////////////////////////////////////////////////////////////
// ENV
////////////////////////////////////////////////////////////////////
// ENV Dosyasını Yükle
require('dotenv').config();

////////////////////////////////////////////////////////////////////
// IMPORT
////////////////////////////////////////////////////////////////////

// Node.js tarafıdnan Express framework dahil eder
const express = require('express');

// HTTP Post isterklerinden form verilerini (urlencoded) ayrıştırmak(okumak) için body-parser dahil et
const bodyParser = require('body-parser');

// Oturum(session) yönetimi için express-session dahil et
const session = require('express-session');

// Parola güvenliği için bcrypt dahil et
const bcrypt = require('bcrypt');

// Layot sistemi için
const expressLayouts = require('express-ejs-layouts');

// Path modülünü dahil et (dosya ve dizin yolları için)
const path = require('path');

// morgan (istek loglama) - opsiyonel
const morgan = require('morgan');

// Winston logger - opsiyonel
const { createLogger, format, transports } = require('winston');

////////////////////////////////////////////////////////////////////
// Winston Logger
////////////////////////////////////////////////////////////////////

// Log formatı: timestamp + level + message
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf((info) => `${info.timestamp} [${info.level.toUpperCase()}] - ${info.message}`)
  ),
  transports: [
    // Konsola loglama
    new transports.Console(),

    // logs/app.log dosyasına yaz
    new transports.File({ filename: 'logs/app.log' }),
  ],
});

////////////////////////////////////////////////////////////////////
// Express APP
////////////////////////////////////////////////////////////////////
// Yeni bir Express uygulaması oluştur
const app = express();

// Sunucunun dinleyeceği port numarası (.env varsa onu ekle yoksa 3000 kullan)
const PORT = process.env.PORT || 3333;

// Bu dizi, kullanıcı verilerini geçici olarak depolamak için (RAM hafıza) kullanılacak
// Dikkat: Gerçek projelerde veritabanı kullanılmaktadır
const users = [];

////////////////////////////////////////////////////////////////////
// Morgan (HTTP İstek Logger)
// Morgan -> Winston'a yazdırsın
////////////////////////////////////////////////////////////////////
app.use(
  morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
); // Konsola kısa formatta loglama

////////////////////////////////////////////////////////////////////
// EJS & LAYOUT
////////////////////////////////////////////////////////////////////
// EJS'yi görünüm motoru(şablon motoru) olarak ayarla (view engine)
app.set('view engine', 'ejs');

// EJS view dosyalarının bulunduğu klasörü ayarla
app.set('views', path.join(__dirname, 'views'));

// Layout
app.use(expressLayouts);
app.set('layout', 'layout'); // varsayılan layout dosyası

////////////////////////////////////////////////////////////////////
// STATIC
////////////////////////////////////////////////////////////////////
// Statik dosyalar için 'public' klasörünü kullan
// app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

////////////////////////////////////////////////////////////////////
// BODY PARSER
////////////////////////////////////////////////////////////////////
// Body-parser'ı kullanarak URL kodlu verileri ayrıştır(parse)
// Form verileri (application/x-www-form-urlencoded) için
app.use(bodyParser.urlencoded({ extended: true }));

////////////////////////////////////////////////////////////////////
// SESSION
////////////////////////////////////////////////////////////////////
// Express-session'ı kullanarak oturum yönetimini(login olmuş kullanıcılar) etkinleştir
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'gizliAnahtar', // Oturum gizliliği için bir gizli anahtar
    resave: false, // her istektre session tekrar kaydetme
    saveUninitialized: true, // Boş(kullanılmayan) yeni oturumları kaydet
  })
);

////////////////////////////////////////////////////////////////////
// GLOBAL MIDDLEWARE
// Her istekte çalışacak kodlar buraya
////////////////////////////////////////////////////////////////////

// Her istekte çalışacak middleware
app.use((req, res, next) => {
  // Eğer kullanıcı oturumu açıksa, kullanıcı e-posta adresini yerel değişkene ata
  res.locals.currentUserEmail = req.session.userEmail || null;

  // Toast Mesajı (Örnek: Başarıyla giriş yapıldı)
  res.locals.toast = req.session.toast || null;
  // delete req.session.toastMessage;

  // LocalStorage için
  res.locals.afterRegister = req.session.afterRegister || null;
  res.locals.afterLogin = req.session.afterLogin || null;

  // Temizle
  req.session.toast = null;
  req.session.afterRegister = null;
  req.session.afterLogin = null;

  // Sonsuz döngüsü engellemekj
  next();
});

////////////////////////////////////////////////////////////////////
// ROUTER (HOME)
////////////////////////////////////////////////////////////////////
// Ana sayfa (home) için GET isteğini handle etmek
app.get('/', (req, res) => {
  // Logger
  logger.info('Ana sayfa ziyaret edildi.');

  // Home
  res.render('home', {
    title: 'Ana Sayfa',
  });
});

////////////////////////////////////////////////////////////////////
// ROUTER (REGİSTER GET )
////////////////////////////////////////////////////////////////////
// http://localhost:3000/register
// Register Formu için GET isteğini handle etmek
app.get('/register', (req, res) => {
  req.session.toast = {
    type: 'success',
    message: 'Anasayfaya hoşgeldiniz',
  };

  logger.info(`Anaysayfa hoşgeldiniz}`);

  res.render('register', {
    title: 'Kayıt Ol',
    errors: [],
    formData: { name: '', email: '', password: '', confirmPassword: '' },
  });
});

////////////////////////////////////////////////////////////////////
// ROUTER (REGİSTER POST )
////////////////////////////////////////////////////////////////////
// http://localhost:3000/register
// Register Formu için GET isteğini handle etmek
app.post('/register', async (req, res) => {
  // Formdan gelen verileri body üzerinden al
  const { name, email, password, confirmPassword } = req.body;

  // ERROR
  // Hata mesajlarını depolamak için bir dizi oluştur
  const errors = [];

  //  VALIDATION
  // Validation kontrolleri
  if (!name || !email || !password || !confirmPassword) {
    errors.push('Lütfen tüm alanları doldurun.');
  }

  // Validation kontrolleri (name)
  if (!name || name.trim().length < 3) {
    errors.push('İsim en az 3 karakter olmalıdır.');
  }

  // Validation kontrolleri (email and regex)
  if (!email || email.trim().length < 8) {
    errors.push('Mail için en az 8 karakter olmalıdır.');
  }

  // Basit email format kontrolü
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    errors.push('Geçerli bir e-posta adresi girin.');
  }

  // Aynı mail ile kayıtlı kullanıcı kontrolü
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    errors.push('Bu e-posta adresi zaten kayıtlı.');
  }

  // Validation kontrolleri (password)
  if (!password || password.trim().length < 6) {
    errors.push('şifre için en az 6 karakter olmalıdır.');
  }

  // Şifre ve onay şifresi eşleşme kontrolü
  if (password !== confirmPassword) {
    errors.push('Şifre ve onay şifresi eşleşmiyor.');
  }

  // Eğer hatalar varsa, formu tekrar render et ve hataları göster
  if (errors.length > 0) {
    // Logger
    logger.warn(`Başarısız kayıt denemesi: ${email} - Hatalar: ${errors.join(', ')}`);

    // return
    return res.render('register', {
      title: 'Kayıt Ol',
      errors,
      formData: { name, email, password, confirmPassword },
    });
  }

  // Şifreyi hashle
  const hashedPassword = await bcrypt.hash(password, 10);

  // Hata yoksa, yeni kullanıcıyı users dizisine ekle
  users.push({ name, email, password: hashedPassword });

  // LOGGER
  logger.info(`Yeni kullanıcı kaydı: ${email}`);

  // Frontend (localstorage) için kullancıı bilgilerie gönder
  req.session.afterRegister = { name, email };

  // Toast Mesajı
  // req.session.toast = 'Kayıt işlemi başarılı! Giriş yapabilirsiniz.';
  req.session.toast = {
    type: 'success',
    message: 'Kayıt işlemi başarılı! Giriş yapabilirsiniz.',
  };

  // Redirect (Yönlendirme)
  // Başarılı kayıt olduktan sonra login sayafsına yönlendirmesi gerekiyor
  res.redirect('/login');
}); //end register

////////////////////////////////////////////////////////////////////
// ROUTER (LOGIN GET )
////////////////////////////////////////////////////////////////////
// http://localhost:3000/login
// Login Formu için GET isteğini handle etmek
app.get('/login', (req, res) => {
  res.render('login', {
    title: 'Giriş Yap',
    errors: [],
    formData: { email: '', password: '' },
  });
});

////////////////////////////////////////////////////////////////////
// ROUTER (LOGIN POST )
////////////////////////////////////////////////////////////////////
// http://localhost:3000/login
// login Formu için GET isteğini handle etmek
app.post('/login', async (req, res) => {
  // Formdan gelen verileri body üzerinden al
  const { email, password } = req.body;

  // ERROR
  // Hata mesajlarını depolamak için bir dizi oluştur
  const errors = [];

  // email, password eşleştirilmesi
  // Hata mesajlarını depolamak için bir dizi oluştur
  // const user = users.find((user) => user.email === email && user.password === password);
  const user = users.find((user) => user.email === email);

  // Eğer kullanıcı bulunamazsa hata mesajı ekle
  if (!user) {
    errors.push('Geçersiz e-posta veya şifre.');
  } else {
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      errors.push('Geçersiz e-posta veya şifre.');
    }
  }

  // Eğer hatalar varsa, formu tekrar render et ve hataları göster
  if (errors.length > 0) {
    // Logger
    logger.warn(`Başarısız giriş denemesi: ${email}`);

    // return
    return res.render('login', {
      title: 'Giriş Yap',
      errors,
      formData: { email, password: '' },
    });
  }

  // logger
  logger.info(`Kullanıcı giriş yaptı: ${email}`);

  // Session'a kullanıcı mailini yaz
  req.session.userEmail = user.email;

  // Frontend (localstorage) için kullancıı bilgilerie gönder
  req.session.afterLogin = { name: user.name, email: user.email };

  // Toast Mesajı
  req.session.toast = {
    type: 'success',
    message: 'Giriş işlemi başarılı! Admin Paneline Yönlendiriliyorsunuz.',
  };

  // Başarılı girişten sonra admin ana sayfaya yönlendirme
  res.redirect('/admin_page');
}); //end login

////////////////////////////////////////////////////////////////////
// ROUTER (ADMIN PAGE)
////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
///// ADMIN PAGE (DASHBOARD) ////////////////////////////////////////
app.get('/admin_page', (req, res) => {
  // Eğer kullanıcı oturumu açık değilse, login sayfasına yönlendir
  if (!req.session.userEmail) {
    // Login olmadan admin_page sayfasına erişmeye çalışırsa
    req.session.toast = {
      type: 'warning',
      message: 'Lütfen önce giriş yapın.',
    };
    return res.redirect('/login');
  }

  // users dizisinden oturum açan kullanıcıyı bul ve bilgisi al
  const user = users.find((user) => user.email === req.session.userEmail);
  // console.log(user);
  //window.alert(user);

  // Toast Mesajı
  req.session.toast = {
    type: 'info',
    message: 'Admin sayfasına Giriş yapıldı.',
  };

  // EJS dashboard sayfasını render et ve kullanıcı bilgilerini gönder
  res.render('admin_page', {
    title: 'admin_page',
    user,
  });
}); //end admin_page

////////////////////////////////////////////////////////////////////
// ROUTER (LOGOUT )
////////////////////////////////////////////////////////////////////
//http://localhost:3000/logout
app.get('/logout', (req, res) => {
  // Oturumu yok et (logout)
  req.session.destroy((err) => {
    res.redirect('/'); // Ana sayfaya yönlendir
  });
}); //end logout

////////////////////////////////////////////////////////////////////
// LISTENER
////////////////////////////////////////////////////////////////////

// Sunucuyu belirli bir portta dinlemeye başla
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
}); //end listener
