openapi: 3.0.0
info:
  title: Müzik ve Akor Yönetim Sistemi API
  description: Bu belge Hilal Ayyıldız ve Ezgi Orhan'ın gereksinimlerini içeren API tasarımıdır.
  version: 1.0.0

paths:
  # --- KULLANICI İŞLEMLERİ (Hilal Ayyıldız) ---
  /auth/register:
    post:
      summary: Kayıt Olma
      tags: [Kimlik Doğrulama]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [username, email, password]
              properties:
                username:
                  type: string
                  example: "muzik_sever"
                email:
                  type: string
                  format: email
                  example: "kullanici@example.com"
                password:
                  type: string
                  format: password
                  example: "GucluSifre123!"
      responses:
        '201':
          description: Kullanıcı başarıyla oluşturuldu.

  /auth/login:
    post:
      summary: Giriş Yapma
      tags: [Kimlik Doğrulama]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [username, password]
              properties:
                username:
                  type: string
                password:
                  type: string
      responses:
        '200':
          description: Giriş başarılı.

  /auth/reset-password:
    post:
      summary: Şifre Yenileme
      tags: [Kimlik Doğrulama]
      responses:
        '200':
          description: Yenileme bağlantısı gönderildi.

  /user/profile:
    put:
      summary: Profil Güncelleme (Hilal Ayyıldız)
      tags: [Kullanıcı]
      responses:
        '200':
          description: Profil güncellendi.

  # --- ŞARKI YÖNETİMİ (Hilal Ayyıldız) ---
  /songs:
    get:
      summary: Arama Yapma ve Popüler Şarkıları Görüntüleme
      tags: [Şarkılar]
    post:
      summary: Şarkı Ekleme
      tags: [Şarkılar]

  /songs/{songId}:
    put:
      summary: Şarkı Düzenleme
      tags: [Şarkılar]
    delete:
      summary: Şarkı Silme
      tags: [Şarkılar]

  # --- LİSTE VE PUANLAMA (Ezgi Orhan) ---
  /songs/{songId}/rate:
    post:
      summary: Şarkı Puanlama
      tags: [Etkileşim]

  /playlists:
    post:
      summary: Liste Oluşturma
      tags: [Listeler]
    get:
      summary: Listeleri Görüntüleme
      tags: [Listeler]

  /playlists/{playlistId}/items:
    post:
      summary: Listeye Şarkı Ekleme
      tags: [Listeler]
    patch:
      summary: Liste Sırası Değiştirme
      tags: [Listeler]

  # --- AKOR VE NOTLAR (Ezgi Orhan) ---
  /songs/{songId}/transpose:
    post:
      summary: Ton Değiştirme (Transpoze)
      tags: [Araçlar]

  /songs/{songId}/visualize:
    get:
      summary: Akor Görselleştirici
      tags: [Araçlar]

  /songs/{songId}/simplify:
    post:
      summary: Akor Basitleştirme (AI)
      tags: [Araçlar]

  /songs/{songId}/notes:
    post:
      summary: Not Ekleme
      tags: [Notlar]
  
  /notes/{noteId}:
    delete:
      summary: Not Silme
      tags: [Notlar]
