**Web Frontend Videosu**: https://youtube.com/@hilalayyildiz369?si=Q5_zstmCRYStFZxz
## SAYFALAR VE GÖREVLER

### 1. Kayıt ve Giriş Sayfası (auth/page.tsx)
**Amaç**
Yeni kullanıcıların sisteme kaydolması ve mevcut kullanıcıların giriş yapması

**Kullanılan Componentler**
- RegisterForm
- LoginForm

**Yapılacaklar**
- `POST /auth/register` → E-posta, kullanıcı adı ve şifre ile yeni hesap oluşturulur
- Kullanıcı bilgileri Firestore `users` koleksiyonuna kaydedilir
- `POST /auth/login` → Kayıtlı kullanıcı giriş yapar
- Firebase Auth ile kimlik doğrulama yapılır
- Başarılı kayıt/girişte ana sayfaya yönlendirme yapılır
- Hata durumunda kullanıcıya açıklayıcı mesaj gösterilir
- "Hesabın yok mu? Kayıt ol" / "Zaten hesabın var mı? Giriş yap" linkleri çalışır

---

### 2. Şarkı Ekleme Formu
**Amaç**
Platforma yeni şarkı içeriği eklemek

**Kullanılan Componentler**
- SongForm (şarkı ekleme formu)
- ChordInput (akor girişi)

**Yapılacaklar**
- `POST /songs` → Yeni şarkı Firestore'a kaydedilir
- Form alanları: Başlık, Sanatçı, Ton, Akorlar, Şarkı Sözleri, YouTube Linki
- Zorunlu alan kontrolü yapılır (başlık ve sanatçı boş bırakılamaz)
- Kayıt başarılıysa form sıfırlanır ve şarkı listesi güncellenir
- Eklenen şarkıya ekleyen kullanıcının adı otomatik atanır (`createdByUsername`)
- Yalnızca giriş yapmış kullanıcılar şarkı ekleyebilir

---

### 3. Şarkı Silme
**Amaç**
Platforma eklenmiş şarkıların kaldırılması

**Kullanılan Componentler**
- DeleteButton (silme butonu)

**Yapılacaklar**
- `DELETE /songs/:songId` → Şarkı Firestore'dan silinir
- Silme butonu yalnızca admin kullanıcıya görünür
- Silme işlemi sonrası şarkı listesi otomatik güncellenir
- Silinen şarkı seçili durumdaysa detay paneli kapanır

---

### 4. Arama Özelliği
**Amaç**
Şarkı adı veya sanatçı ismine göre hızlı filtreleme yapmak

**Kullanılan Componentler**
- SearchBar (arama çubuğu)

**Yapılacaklar**
- `GET /songs/search?q=` → Anahtar kelimeye göre şarkılar filtrelenir
- Arama şarkı başlığı ve sanatçı adında eş zamanlı çalışır
- Arama anlık olarak çalışır (her tuş basışında filtreler)
- Sonuç bulunamazsa "Şarkı bulunamadı" mesajı gösterilir
- Arama kutusu temizlendiğinde tüm şarkılar tekrar listelenir

---

## GENEL COMPONENTLER

| Component | Açıklama |
|-----------|----------|
| `Header` | Logo, kullanıcı e-postası, çıkış butonu |
| `SearchBar` | Şarkı adı veya sanatçıya göre arama |
| `SongCard` | Şarkı listesi kartı (başlık, sanatçı, ton, ekleyen) |
| `SongForm` | Şarkı ekleme formu |
| `DeleteButton` | Admin için silme butonu (✕) |
| `LoginForm` | Giriş formu |
| `RegisterForm` | Kayıt formu |

---

## API İŞLEVLERİ

| İşlev | Method | Endpoint |
|-------|--------|----------|
| Kayıt olma | POST | `/auth/register` |
| Giriş yapma | POST | `/auth/login` |
| Şarkı ekleme | POST | `/songs` |
| Şarkı silme | DELETE | `/songs/:songId` |
| Şarkı arama | GET | `/songs/search?q=` |
| Şarkı listeleme | GET | `/songs` |

---

## SONUÇ

Frontend tamamlandığında kullanıcı:
- Yeni hesap oluşturabilir
- Sisteme giriş yapabilir
- Yeni şarkı ekleyebilir (başlık, sanatçı, akor, söz, YouTube linki)
- Şarkıları arayabilir (anlık filtreleme)
- Admin yetkisiyle şarkı silebilir

---

## KULLANILAN TEKNOLOJİLER

| Teknoloji | Kullanım Alanı |
|-----------|---------------|
| Next.js 14 | UI framework (App Router) |
| TypeScript | Tip güvenliği |
| Tailwind CSS | Stil ve tasarım |
| Firebase Auth | Kimlik doğrulama |
| Firestore | Veritabanı işlemleri |
| react-firebase-hooks | Auth state yönetimi |
