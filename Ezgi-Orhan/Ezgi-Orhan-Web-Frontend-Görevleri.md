**Web Frontend Videosu**: https://www.youtube.com/watch?v=qZ9yefJcTJs
## SAYFALAR VE GÖREVLER

### 1. Ana Sayfa (page.tsx)
**Amaç**
Tüm şarkıları listelemek ve platforma giriş noktası olmak

**Kullanılan Componentler**
- SongCard (şarkı kartı)
- SearchBar (arama çubuğu)
- TabBar (Şarkılar / Listelerim sekmeleri)
- TransposeControl
- LyricsRenderer

**Yapılacaklar**
- Firestore'dan tüm şarkılar çekilir (`GET /songs`)
- Şarkılar kart şeklinde listelenir
- Arama ve filtreleme çalışır
- Seçilen şarkının detayı sağ panelde gösterilir

---

### 2. Şarkı Detay Paneli
**Amaç**
Şarkının tüm detaylarını, akorlarını ve sözlerini göstermek

**Kullanılan Componentler**
- TransposeControl
- LyricsRenderer
- ChordBadge (akor rozeti)
- NoteSection (kişisel notlar)
- PlaylistAddButton (listeye ekle)

**Yapılacaklar**
- `GET /songs/:songId` ile şarkı detayı gösterilir
- Akorlar renkli rozetlerle listelenir
- Şarkı sözleri gösterilir
- YouTube linki varsa "YouTube'da Dinle" butonu çıkar
- Listeye ekle butonu görünür

---

### 3. Transpoze Özelliği
**Amaç**
Şarkı akorlarını farklı tonlara kaydırmak

**Kullanılan Component**
- TransposeControl.tsx

**Yapılacaklar**
- `GET /songs/:songId/transpose` mantığı frontend'de çalışır
- − ve + butonları ile yarı ton ayarlanır
- Akorlar anlık olarak güncellenir (API çağrısı yapılmaz)
- Bemol/diyez tercihi toggle ile seçilir
- ±6 yarı ton sınırı uygulanır
- "Sıfırla" butonu ile orijinal tona dönülür

---

### 4. Çalma Listesi Yönetimi (Listelerim Sekmesi)
**Amaç**
Kullanıcının kendi setlistlerini oluşturması ve yönetmesi

**Kullanılan Componentler**
- PlaylistCard
- PlaylistForm
- PlaylistSongList

**Yapılacaklar**
- `POST /setlists` → Yeni liste oluşturulur
- `POST /setlists/:listId/songs` → Listeye şarkı eklenir
- `DELETE /setlists/:listId` → Liste silinir
- Listeler sol panelde sekme olarak gösterilir
- Listeye tıklayınca içindeki şarkılar listelenir

---

### 5. Kişisel Notlar
**Amaç**
Şarkı bazlı özel notlar eklemek ve silmek

**Kullanılan Component**
- NoteSection.tsx

**Yapılacaklar**
- `POST /songs/:songId/notes` → Not eklenir
- `DELETE /songs/:songId/notes/:noteId` → Not silinir
- Notlar yalnızca giriş yapmış kullanıcıya görünür
- Notlar şarkı detay sayfasının altında listelenir
- Her notun yanında silme butonu (✕) bulunur

---

### 6. Kayıt ve Giriş Sayfası (auth/page.tsx)
**Amaç**
Kullanıcı kimlik doğrulaması

**Yapılacaklar**
- `POST /auth/register` → E-posta, şifre ve kullanıcı adı ile kayıt
- `POST /auth/login` → Giriş yapma
- Başarılı girişte ana sayfaya yönlendirme
- Hata durumunda kullanıcıya mesaj gösterilir
- "Hesabın yok mu? Kayıt ol" linki çalışır

---

## GENEL COMPONENTLER

| Component | Açıklama |
|-----------|----------|
| `Header` | Logo, kullanıcı e-postası, çıkış butonu |
| `TabBar` | Şarkılar / Listelerim sekme geçişi |
| `SearchBar` | Şarkı adı veya sanatçıya göre arama |
| `SongCard` | Şarkı listesi kartı (başlık, sanatçı, ton, ekleyen) |
| `TransposeControl` | Yarı ton ayarlama kontrolü |
| `LyricsRenderer` | Şarkı sözleri görüntüleme |
| `ChordBadge` | Renkli akor rozeti |
| `NoteSection` | Kişisel not ekleme/silme alanı |
| `PlaylistCard` | Çalma listesi kartı |

---

## API İŞLEVLERİ

| İşlev | Method | Endpoint |
|-------|--------|----------|
| Şarkı listeleme | GET | `/songs` |
| Şarkı detay | GET | `/songs/:songId` |
| Ton değiştirme | GET | `/songs/:songId/transpose` |
| Liste oluşturma | POST | `/setlists` |
| Listeye şarkı ekleme | POST | `/setlists/:listId/songs` |
| Liste silme | DELETE | `/setlists/:listId` |
| Not ekleme | POST | `/songs/:songId/notes` |
| Not silme | DELETE | `/songs/:songId/notes/:noteId` |
| Kayıt olma | POST | `/auth/register` |
| Giriş yapma | POST | `/auth/login` |

---

## SONUÇ

Frontend tamamlandığında kullanıcı:
- Şarkıları listeleyebilir ve arama yapabilir
- Şarkı detayını görüntüleyebilir
- Akorları transpoze edebilir (anlık, API çağrısı olmadan)
- Çalma listesi oluşturabilir ve şarkı ekleyebilir
- Şarkılara kişisel not ekleyebilir ve silebilir
- Kayıt olabilir ve giriş yapabilir

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
