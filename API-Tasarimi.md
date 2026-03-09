openapi: 3.0.3
info:
  title: Repertoar & Akor Yönetim API
  description: Müzisyenlerin şarkı ekleyebildiği, AI ile akor basitleştirebildiği ve kişisel repertuarlarını yönetebildiği entegre platform.
  version: 1.0.0
  contact:
    name: Proje Ekibi (Hilal & Ezgi)

servers:
  - url: http://localhost:5000/api/v1
    description: Yerel Geliştirme Sunucusu
  - url: https://api.repertoireapp.com/v1
    description: Üretim Sunucusu

tags:
  - name: Kullanıcı Yönetimi
    description: Kayıt, giriş ve profil güncellemeleri (Hilal Ayyıldız)
  - name: Şarkı & İçerik Yönetimi
    description: Şarkı ekleme, arama ve düzenleme işlemleri (Hilal Ayyıldız)
  - name: Liste & Repertoar Yönetimi
    description: Kullanıcı çalma listeleri ve şarkı sıralama (Ezgi Orhan)
  - name: Akor & AI Araçları
    description: Transpoze, Görselleştirme ve AI Akor Basitleştirme (Ezgi Orhan)

security:
  - BearerAuth: []

paths:
  # ==========================================
  # HİLAL AYYILDIZ'IN GÖREVLERİ
  # ==========================================
  /auth/register:
    post:
      tags: [Kullanıcı Yönetimi]
      summary: Yeni Kullanıcı Kaydı
      description: Sisteme e-posta ve şifre ile yeni üye kaydı yapar.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserInput'
      responses:
        '201':
          description: Kayıt başarılı.
        '400':
          description: Hatalı veri girişi.

  /songs:
    get:
      tags: [Şarkı & İçerik Yönetimi]
      summary: Şarkı Arama ve Listeleme
      parameters:
        - name: query
          in: query
          description: Şarkı adı veya sanatçı ile arama
          schema:
            type: string
      responses:
        '200':
          description: Şarkılar başarıyla getirildi.
    post:
      tags: [Şarkı & İçerik Yönetimi]
      summary: Yeni Şarkı Ekleme
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/SongInput'
      responses:
        '201':
          description: Şarkı sisteme eklendi.

  # ==========================================
  # EZGİ ORHAN'IN GÖREVLERİ
  # ==========================================
  /songs/{songId}/simplify:
    post:
      tags: [Akor & AI Araçları]
      summary: Akor Basitleştirme [YAPAY ZEKA]
      description: Karmaşık akor dizilerini AI analizi ile çalması kolay versiyonlara dönüştürür.
      parameters:
        - name: songId
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: Basitleştirilmiş akorlar başarıyla üretildi.
          content:
            application/json:
              schema:
                type: object
                properties:
                  originalChords: { type: string }
                  simplifiedChords: { type: string }
                  difficultyLevel: { type: string, example: "Kolay" }

  /playlists:
    post:
      tags: [Liste & Repertoar Yönetimi]
      summary: Yeni Repertoar Listesi Oluşturma
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                name: { type: string, example: "Haftalık Sahne Listesi" }
      responses:
        '201':
          description: Liste oluşturuldu.

  /songs/{songId}/transpose:
    post:
      tags: [Akor & AI Araçları]
      summary: Akor Transpoze Etme
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                semitones: { type: integer, example: 2 }
      responses:
        '200':
          description: Yeni tondaki akorlar döndürüldü.

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    UserInput:
      type: object
      required: [username, email, password]
      properties:
        username: { type: string, example: "ozan_muzik" }
        email: { type: string, format: email, example: "ozan@muzik.com" }
        password: { type: string, format: password, example: "GucluSifre123" }

    SongInput:
      type: object
      required: [title, artist, content]
      properties:
        title: { type: string, example: "Tamirci Çırağı" }
        artist: { type: string, example: "Cem Karaca" }
        content: { type: string, description: "Sözler ve akorlar bir arada" }
        category: { type: string, example: "Anadolu Rock" }

    Error:
      type: object
      properties:
        code: { type: integer }
        message: { type: string }
