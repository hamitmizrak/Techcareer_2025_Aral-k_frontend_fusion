# Frontend Fusion (Techcareer 2015)

```sh
Html5, Css3, Js, EJS, Node, Express v.b kütüphane ve/veya framework ve/veya dil kullanarak proje geliştiriyoruz. 
```

---

## Permalink Url

```sh
Emmet: https://docs.emmet.io/cheat-sheet/

VsCode : https://code.visualstudio.com/download
Git    : https://git-scm.com/install/windows
Nodejs : https://nodejs.org/en/download

```

---

## Git

```sh
git init
git add .
git commit -m "message"
git remote add origin GİTHUB_URL
git branch
git push -u origin master

```

---

## Git Clone

```sh
git clone https://github.com/hamitmizrak/Techcareer_2025_Aral-k_frontend_fusion
```

---

## Kurulum Linkleri

```sh
Vs Code  :  https://code.visualstudio.com/download
Git      :  https://git-scm.com/install/windows
Node js  :  https://nodejs.org/en/download

```

---

## Version

```sh
git -v
npm -v
node -v

```

---

## Kullanılacak Teknolojiler

- **HTML5**
- **CSS3**
- **BOOTSTRAP5 (CDN)**
- **JavaScript (External app.js)**
- **Node.js**
- **Express.js**
- **EJS (Embedded Javascript)**
- **express-session**
- **body-parser**

---

## NPM INSTALL

```sh
npm init
npm init -y
npm install  ejs body-parser
npm install  ejs express express-session express-ejs-layouts express-session
npm i toastify-js
npm i bcrypt dotenv
npm i winston morgan --save
npm i browser-sync nodemon npm-run-all --save-dev

```

---

## DEPENDENCIES - DEVDEPENDENCIES

```sh
"dependencies": {
    "bcrypt": "^6.0.0",
    "body-parser": "^2.2.1",
    "dotenv": "^17.2.3",
    "ejs": "^3.1.10",
    "express": "^5.2.1",
    "express-ejs-layouts": "^2.5.1",
    "express-session": "^1.18.2",
    "morgan": "^1.10.1",
    "toastify-js": "^1.12.0",
    "winston": "^3.19.0"
  },
  "devDependencies": {
    "browser-sync": "^3.0.4",
    "nodemon": "^3.1.11",
    "npm-run-all": "^4.1.5"
  }
}
```

---

## SCRIPT

```sh
package.json ==> Default  ==> "main": "template.js",

package.json ==> DEĞİŞTİR ==> "main": "server.js",

package.json ==>
  "scripts": {
    "start": "node server.js",
    "build": "node scripts/copy-toastify.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },


Terminalde ==>
npm install
npm run build
npm run start


```

---

## NODE RUNNING

```sh
npm run build
npm run dev

npm start
veya
node server.js

```

---

## TOASTIFY

```sh
npm install toastify-js

node_modules/toastify-js/

public/ventor/toastify

```

---

## LOGGER

```sh

Express tabanlı - middlewar tarafında kolay bir şekilde entegre edilmesi için;
- custpm log,
- request
- response bunları anlamlı bir şekilde saklamamız lazım.

Morgan(Basit uygulamalar idealdir):
Nodejs ==> Express
- Express tarafından sıkca kullanılan logger
- Kullanımı çok basit
- Dosyamıza veya  (console.log, console.error, console.warn, console.info)
- Http GET,POST,PUT,DELETE,PATCH (request/response) için çok ideal

Winston(Büyük projelerde idealdir):
- Node ekosisteminde en güçlü logging kütüphanesidir.
- Log seviyesi (info<warn<error<debug)
- Logları hem console yazdırabiliriz hemde dosyayayazdırabiliriz ve Database yazdırabiliriz
- JSON formatlı log desteği sağlıyor.
- Custom Log(örneğin kullancı kayıt, kullanıcı giriş yaptı, hata fırlattıldı))

```

---

## .ENV 

```sh

```
---


Projede **.env dosyası kullanmamızın sebebi**, uygulamanın *güvenliği*, *esnekliği* ve *taşınabilirliği* için **konfigürasyonu koddan ayırmak** içindir.

---

# 🎯 **.env NEDEN KULLANILIR? (SADE ve NET)**

## 1️⃣ **Güvenlik – Şifreler kodun içinde durmasın diye**

Uygulamada:

* Veritabanı şifresi
* API key
* Session secret
* JWT secret
* SMTP (mail) kullanıcı adı/şifre

gibi kritik bilgiler vardır.

**Bu bilgileri server.js içine yazmak tehlikelidir**, çünkü kod GitHub’a giderse herkes görür.

Bunun yerine:

```
SESSION_SECRET="super-gizli-key"
DB_PASSWORD="12345"
```

→ .env içine koyarsın,
→ GitHub’a atmazsın (çünkü `.gitignore` dosyası engeller),
→ Kod güvenli olur.

---

# 2️⃣ **Her ortamın ayarları farklıdır (development, test, production)**

Örneğin:

## Development (senin bilgisayarın)

```
PORT=3000
DB_URL=mongodb://localhost:27017/devdb
```

## Production (sunucu)

```
PORT=80
DB_URL=mongodb+srv://gerçekdb-cloud-connection
```

Kodun içinde yazarsan **tek bir port ile çalışır**, ortam değiştirdiğinde sorun çıkar.

.env dosyası ise **ortama göre konfigürasyonu değiştirmene izin verir**.
Kod **hiç değişmez**, sadece `.env` değişir.

Bu yazılım mimarisinin “**12-Factor App**” standardının temelidir.

---

# 3️⃣ **Kod tekrarını ve karışıklığı azaltır**

Bir ayarı **tek bir yerden** yönetmek istersin:

Örnek:

```js
const PORT = process.env.PORT || 3000;
```

Sonra `.env` içine:

```
PORT=4444
```

Yazarsın, bitti.

Kodun *hiçbir yerine gidip değişiklik yapmazsın*.

---

# 4️⃣ **Farklı kullanıcılar farklı ayarlarla çalışabilir**

Sen kendi bilgisayarında:

```
PROJECT_NAME="Frontend Fusion Hamit"
```

Bir başka geliştirici:

```
PROJECT_NAME="Team Edition"
```

kullanabilir.

Kod aynı, environment farklı → hiç sorun yok.

---

# 5️⃣ **Config değerleri koddan bağımsızdır**

Mesela:

* Port numarası
* Proje adı
* Veritabanı URL
* API URL
* Mail provider bilgileri

gibi *sık değişen* bilgiler, kod dosyalarına gömülmez.

Kod → “iş mantığı”
.env → “ayarlar”

ayrımı **temiz mimarinin altın kuralıdır**.

---

# 🔥 Peki `.env` olmasa ne olurdu?

Her değişiklikte:

* server.js
* app.js
* veri tabanı bağlantı dosyası
* mail service dosyası

gibi yerlere gidip port ve config değiştirirdin.

Bu:

* Risklidir
* Zordur
* Büyüyen projede tamamen yönetilemez hale gelir

---

# ✔ SON CÜMLE: .ENV bir zorunluluk değil, bir PROFESYONELLİK standardıdır.

### Basit projeler .env olmadan çalışır.

### Büyük projeler .env olmadan MAHVOLUR.

Senin Express + EJS projesi de:

* Session secret
* Port
* Project name
* Log seviyeleri
* Database bilgileri (ileride)

hepsi `.env` içinde olmalı.

---


## ENV KURALLARI
.env dosyası **çok basit görünür ama aslında kuralları kesin** olan bir dosyadır.
Sorun şurada:

> “Value kısmına ne yazabiliriz?
> `FrontendFusion` olur mu?
> `Frontend fusioçöşğ` gibi Türkçe boşluklu metin olur mu?”

Aşağıda tüm kuralları *net ve anlaşılır şekilde* özetliyorum.

---

# ✅ **1) .env KEY (sol taraf) kuralları**

Yani `PROJECT_NAME=` kısmı.

**KEY kuralları şunlar:**

| Kural                             | Açıklama              |
| --------------------------------- | --------------------- |
| Sadece büyük harf kullanılır      | `PROJECT_NAME` ✔      |
| HARF + RAKAM + `_` kullanılabilir | `APP_PORT_1` ✔        |
| Küçük harf önerilmez              | `projectName` → ✖     |
| Türkçe karakter OLMAZ             | `PROJE_ADI_ÇÖŞÜĞİ` → ✖ |
| Boşluk OLMAZ                      | `PROJECT NAME` → ✖    |
| Nokta OLMAZ                       | `PROJECT.NAME` → ✖    |

**Doğru örnek KEY'ler:**

```
PROJECT_NAME
APP_ENV
APP_SECRET
DB_PASSWORD
SESSION_SECRET
FRONTEND_TITLE
```

---

# ✅ **2) .env VALUE (sağ taraf) kuralları**

Asıl sorunun cevabı burası 👇

### VALUE çok daha serbesttir.

**Ama bilmen gereken 3 kural var:**

---

## 🟢 **Kural 1 — VALUE İngilizce karakterli olabilir**

Örneğin:

```
PROJECT_NAME=FrontendFusion
CITY=Istanbul
COMPANY=Techcareer
```

Hepsi ✔

---

## 🟡 **Kural 2 — Eğer VALUE içinde boşluk varsa MUTLAKA tırnak kullanılmalıdır**

Yanlış ❌:

```
PROJECT_NAME=Frontend Fusion
```

Doğru ✔:

```
PROJECT_NAME="Frontend Fusion"
```

---

## 🔴 **Kural 3 — Türkçe karakter kullanabilirsin ama tırnak kullanman gerekir**

Türkçe karakter içeren string → her zaman tırnak ister.

### Yanlış ❌

```
PROJECT_NAME=Frontend fusioçöşğ
```

### Doğru ✔

```
PROJECT_NAME="Frontend fusioçöşğ"
```

### Daha garanti yöntem (önerilen) ✔✔✔

```
PROJECT_NAME="Frontend Fusion Çalışması"
DESCRIPTION="Bu proje EJS + Express ile yazılmıştır"
```

---

# 🔍 **Özet**

| VALUE                  | Geçerli mi? | Açıklama                        |
| ---------------------- | ----------- | ------------------------------- |
| `FrontendFusion`       | ✔           | Sorunsuz                        |
| `Frontend Fusion`      | ❌           | Boşluk var                      |
| `"Frontend Fusion"`    | ✔           | Tırnak içinde                   |
| `Frontend fusioçöşğ`   | ❌           | Türkçe + boşluk var, tırnak yok |
| `"Frontend fusioçöşğ"` | ✔           | Doğru kullanım                  |

---

# 🧪 **Sana örnek bir .env dosyası**

```
PORT=3000
SESSION_SECRET="super-gizli-anahtar"
PROJECT_NAME="Frontend Fusion"
APP_DESCRIPTION="EJS, Express, Toastify, Layout ve Auth projeleri"
COMPANY_NAME="Hamit Mızrak"
```

Hepsi **geçerli ve güvenli**.

---

# ⚠ Neden tırnak gerekli?

Çünkü .env formatında boşluk veya Türkçe karakter parser’ı bozar ve Node.js şu hatayı verir:

```
Unexpected token
```

Bu nedenle güvenli yaklaşım:

* Value **boşluk içeriyorsa** → tırnak koy
* Value **Türkçe içeriyorsa** → tırnak koy

---



##

```sh

```

---

##

```sh

```

---

##

```sh

```

---

##

```sh

```

---

##

```sh

```

---

##

```sh

```

---

##

```sh

```

---

##

```sh

```

---

##

```sh

```

---

##

```sh

```

---

##

```sh

```

---

##

```sh

```

---

##

```sh

```

---

##

```sh

```

---

##

```sh

```

---

##

```sh

```

---

##

```sh

```

---

##

```sh

```

---

##

```sh

```

---

##

```sh

```

---

##

```sh

```

---

##

```sh

```

---

##

```sh

```

---

##

```sh

```

---

##

```sh

```

---

##

```sh

```

---

##

```sh

```

---

##

```sh

```

---
