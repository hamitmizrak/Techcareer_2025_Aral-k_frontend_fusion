// node_modules dizininden toastify dosyalarını kopyala
// Bu script ==> Hem Windows hem Linux hem Unix
const fs = require('fs');
const path = require('path');

// Kaynak (node_modules içindeki toastify dosyalarında ==>  CSS ve JS)
const toastifySrcCss = path.join(
  __dirname,
  '..',
  'node_modules',
  'toastify-js',
  'src',
  'toastify.css'
);

const toastifySrcJs = path.join(
  __dirname,
  '..',
  'node_modules',
  'toastify-js',
  'src',
  'toastify.js'
);

// Hedef Klasör (public/vendor/toastify)
const targetFolder = path.join(__dirname, '..', 'public', 'vendor', 'toastify');

// Hedef klasör yoksa oluştur
if (!fs.existsSync(targetFolder)) {
  fs.mkdirSync(targetFolder, { recursive: true });
  console.log('H.M. Created target folder:', targetFolder);
}

// Dosyaları kopyala
let copyFile = (src, destFolder) => {
  const fileName = path.basename(src);
  const dest = path.join(destFolder, fileName);

  fs.copyFile(src, dest, (err) => {
    if (err) {
      console.error(`😡 Kopyalama Hatası ${fileName}:`, err);
    } else {
      console.log(`👍  Dosya kopyalandı ${fileName} to ${dest}`);
    }
  });
}; //end copyFile

// KOPYALAMA BAŞLAT
copyFile(toastifySrcCss, targetFolder);
copyFile(toastifySrcJs, targetFolder);
