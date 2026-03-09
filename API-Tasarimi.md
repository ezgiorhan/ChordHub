# API Tasarımı - OpenAPI Specification Örneği

**OpenAPI Spesifikasyon Dosyası:** [lamine.yaml](lamine.yaml)

Bu doküman, OpenAPI Specification (OAS) 3.0 standardına göre hazırlanmış örnek bir API tasarımını içermektedir.

## OpenAPI Specification

```yaml
openapi: 3.0.3
info:
  title: Müzik ve Akor Yönetim Sistemi API
  description: >
    Yazılım Mühendisliği Projesi 3. Aşama - API Tasarımı. 
    Bu doküman Hilal Ayyıldız ve Ezgi Orhan tarafından belirlenen gereksinimlerin 
    RESTful API standartlarına göre tasarımını içerir.
  version: 1.0.0

servers:
  - url: https://api.muzikveakorprojesi.com/v1
    description: Üretim Sunucusu

paths:
  # --- HİLAL AYYILDIZ GEREKSİNİMLERİ ---
  /auth/register:
    post:
      tags: [Kimlik Doğrulama]
      summary: Kayıt Olma
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [username, email, password]
              properties:
                username: { type: string, example: "hilal_ay" }
                email: { type: string, format: email, example: "hilal@example.com" }
                password: { type: string, format: password, example: "Sifre123!" }
      responses:
        201:
          description: Kullanıcı başarıyla oluşturuldu.
        400:
          description: Geçersiz giriş verisi.

  /auth/login:
    post:
      tags: [Kimlik Doğrulama]
      summary: Giriş Yapma
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                email: { type: string }
                password: { type: string }
      responses:
        200:
          description: Giriş başarılı, token döndürüldü.
          content:
            application/json:
              schema:
                type: object
                properties:
                  token: { type: string }

  /songs:
    get:
      tags: [Şarkı İşlemleri]
      summary: Arama Yapma
      parameters:
        - name: q
          in: query
          description: Şarkı adı veya sanatçı ismi
          schema: { type: string }
      responses:
        200:
          description: Arama sonuçları listelendi.
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Song'
    post:
      tags: [Şarkı İşlemleri]
      summary: Şarkı Ekleme
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/SongInput'
      responses:
        201:
          description: Şarkı başarıyla eklendi.

  /songs/popular:
    get:
      tags: [Şarkı İşlemleri]
      summary: Popüler Şarkıları Görüntüleme
      responses:
        200:
          description: En popüler şarkı listesi.

  /songs/{songId}:
    put:
      tags: [Şarkı İşlemleri]
      summary: Şarkı Düzenleme
      parameters:
        - name: songId
          in: path
          required: true
          schema: { type: string }
    delete:
      tags: [Şarkı İşlemleri]
      summary: Şarkı Silme
      responses:
        204:
          description: Şarkı başarıyla silindi.

  # --- EZGİ ORHAN GEREKSİNİMLERİ ---
  /songs/{songId}/rate:
    post:
      tags: [Etkileşimler]
      summary: Şarkı Puanlama
      parameters:
        - name: songId
          in: path
          required: true
          schema: { type: string }
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                rating: { type: integer, minimum: 1, maximum: 5 }
      responses:
        200:
          description: Puan kaydedildi.

  /playlists:
    post:
      tags: [Listeler]
      summary: Liste Oluşturma
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                name: { type: string, example: "Favori Akorlarım" }
    get:
      tags: [Listeler]
      summary: Kullanıcı Listelerini Görüntüleme

  /playlists/{playlistId}/songs:
    post:
      tags: [Listeler]
      summary: Listeye Şarkı Ekleme
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                songId: { type: string }
    patch:
      tags: [Listeler]
      summary: Liste Sırası Değiştirme
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                songId: { type: string }
                newOrder: { type: integer }

  /tools/transpose:
    post:
      tags: [Müzik Araçları]
      summary: Ton Değiştirme (Transpoze)
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                songId: { type: string }
                semitones: { type: integer, example: 2 }
      responses:
        200:
          description: Yeni tondaki akorlar döndürüldü.

  /tools/simplify-ai:
    post:
      tags: [Müzik Araçları]
      summary: Akor Basitleştirme (AI)
      description: Karmaşık akorları yapay zeka ile başlangıç seviyesine indirger.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                chordSequence: { type: string }
      responses:
        200:
          description: Basitleştirilmiş akorlar döndürüldü.

  /notes:
    post:
      tags: [Notlar]
      summary: Not Ekleme
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                songId: { type: string }
                content: { type: string }
  /notes/{noteId}:
    delete:
      tags: [Notlar]
      summary: Not Silme

components:
  schemas:
    Song:
      type: object
      properties:
        id: { type: string }
        title: { type: string }
        artist: { type: string }
        chords: { type: string }
        averageRating: { type: number }

    SongInput:
      type: object
      required: [title, artist, chords]
      properties:
        title: { type: string }
        artist: { type: string }
        chords: { type: string }

    User:
      type: object
      properties:
        id: { type: string }
        username: { type: string }
        email: { type: string }
