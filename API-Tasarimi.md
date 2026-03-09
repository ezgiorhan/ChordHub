# API Tasarımı - OpenAPI Specification Örneği

**OpenAPI Spesifikasyon Dosyası:** [lamine.yaml](lamine.yaml)

Bu doküman, OpenAPI Specification (OAS) 3.0 standardına göre hazırlanmış örnek bir API tasarımını içermektedir.

## OpenAPI Specification

```yaml
openapi: 3.0.3
info:
  title: Repertuvar & Akor Yönetim Sistemi (Repertuvarım) API
  version: 1.0.0
  description: >
    Bu API, müzisyenlerin dijital repertuvar süreçlerini, şarkı kütüphanesi yönetimini ve 
    AI destekli akor optimizasyonlarını yönetmek için tasarlanmış kapsamlı bir RESTful servistir. 
    Kullanıcı yönetimi, biletleme mantığına benzer şarkı lisanslama/ekleme süreçleri ve 
    gelişmiş akor transpoze modülleri sunar. API, JWT tabanlı güvenlik protokolü ile korunmaktadır.
  contact:
    name: Yazılım Mühendisliği Proje Ekibi (Hilal Ayyıldız & Ezgi Orhan)

servers:
  - url: https://api.chordhub.com/v1
    description: Üretim sunucusu (Production)
  - url: http://localhost:5000/v1
    description: Yerel geliştirme sunucusu (Development)

tags:
  - name: Kimlik Doğrulama
    description: Kullanıcı kayıt, giriş, profil güvenliği ve JWT işlemleri (Hilal Ayyıldız)
  - name: Şarkı Kütüphanesi
    description: Global şarkı veritabanı, içerik ekleme, arama ve metadata yönetimi (Hilal Ayyıldız)
  - name: Repertuvar Yönetimi
    description: Kullanıcıya özel listeler, şarkı sıralama ve repertuvar optimizasyonu (Ezgi Orhan)
  - name: Akor & AI Servisleri
    description: Transpoze, akor görselleştirme ve AI tabanlı basitleştirme motoru (Ezgi Orhan)

security:
  - BearerAuth: []

paths:
  # ==========================================
  # KİMLİK DOĞRULAMA (Hilal Ayyıldız)
  # ==========================================
  /api/auth/register:
    post:
      tags: [Kimlik Doğrulama]
      summary: Kullanıcı Kaydı (Hilal Ayyıldız)
      description: Sisteme yeni bir müzisyen profilinin kaydedilmesini sağlar. E-posta doğrulaması ve şifre politikalarına uygun kayıt oluşturur.
      operationId: registerUser
      security: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/RegisterInput'
      responses:
        "201":
          description: Kullanıcı başarıyla oluşturuldu ve veritabanına kaydedildi.
        "400":
          $ref: '#/components/responses/BadRequest'
        "409":
          description: Çakışma. Bu e-posta adresiyle zaten aktif bir kullanıcı mevcut.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        "500":
          $ref: '#/components/responses/InternalServerError'

  /api/auth/login:
    post:
      tags: [Kimlik Doğrulama]
      summary: Kullanıcı Girişi (Hilal Ayyıldız)
      description: Kayıtlı kullanıcıların e-posta ve şifreleriyle sisteme erişim sağlaması için JWT üretir.
      operationId: loginUser
      security: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LoginInput'
      responses:
        "200":
          description: Başarılı giriş. Yetkilendirme token'ı ve kullanıcı özeti döndürüldü.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthResponse'
        "401":
          description: Yetkisiz. Geçersiz e-posta adresi veya hatalı şifre.
        "500":
          $ref: '#/components/responses/InternalServerError'

  /api/auth/profile:
    get:
      tags: [Kimlik Doğrulama]
      summary: Profil Bilgilerini Getirme
      security:
        - BearerAuth: []
      responses:
        "200":
          description: Kullanıcı profil detayları.
        "401":
          $ref: '#/components/responses/Unauthorized'
    put:
      tags: [Kimlik Doğrulama]
      summary: Profil Güncelleme
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ProfileUpdate'
      responses:
        "200":
          description: Profil başarıyla güncellendi.

  # ==========================================
  # ŞARKI KÜTÜPHANESİ (Hilal Ayyıldız)
  # ==========================================
  /api/songs:
    get:
      tags: [Şarkı Kütüphanesi]
      summary: Global Şarkı Arama ve Listeleme (Hilal Ayyıldız)
      description: Sistemdeki tüm aktif şarkıları, sanatçı, tür veya popülerlik kriterlerine göre arar.
      parameters:
        - name: query
          in: query
          description: Arama yapılacak anahtar kelime (Şarkı adı, Sanatçı)
          schema: { type: string }
        - $ref: '#/components/parameters/PageParam'
        - $ref: '#/components/parameters/LimitParam'
      responses:
        "200":
          description: Şarkılar başarıyla getirildi.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SongList'
    post:
      tags: [Şarkı Kütüphanesi]
      summary: Yeni Şarkı/Akor Ekleme (Hilal Ayyıldız)
      description: Kullanıcının kendi repertoarına veya global havuza yeni bir şarkı ve akor içeriği eklemesini sağlar.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/SongInput'
      responses:
        "201":
          description: Şarkı başarıyla oluşturuldu.
        "400":
          $ref: '#/components/responses/BadRequest'
        "401":
          $ref: '#/components/responses/Unauthorized'

  /api/songs/{id}:
    parameters:
      - $ref: '#/components/parameters/pathId'
    get:
      tags: [Şarkı Kütüphanesi]
      summary: Şarkı Detayı ve Akor Görünümü
      responses:
        "200":
          description: Şarkı verileri getirildi.
        "404":
          $ref: '#/components/responses/NotFound'
    put:
      tags: [Şarkı Kütüphanesi]
      summary: Şarkı İçeriğini Düzenleme
      responses:
        "200":
          description: Şarkı güncellendi.
    delete:
      tags: [Şarkı Kütüphanesi]
      summary: Şarkı Silme
      responses:
        "204":
          description: Şarkı sistemden kaldırıldı.

  # ==========================================
  # REPERTUVAR YÖNETİMİ (Ezgi Orhan)
  # ==========================================
  /api/playlists:
    post:
      tags: [Repertoar Yönetimi]
      summary: Yeni Repertoar Listesi Oluşturma (Ezgi Orhan)
      description: Kullanıcının sahne veya çalışma için özel şarkı listeleri oluşturmasını sağlar.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PlaylistInput'
      responses:
        "201":
          description: Liste başarıyla oluşturuldu.
        "401":
          $ref: '#/components/responses/Unauthorized'

  /api/playlists/{id}/items:
    parameters:
      - $ref: '#/components/parameters/pathId'
    post:
      tags: [Repertoar Yönetimi]
      summary: Listeye Şarkı Ekleme (Ezgi Orhan)
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                songId: { type: string }
                order: { type: integer }
      responses:
        "200":
          description: Şarkı başarıyla listeye dahil edildi.
    delete:
      tags: [Repertoar Yönetimi]
      summary: Listeden Şarkı Çıkarma
      responses:
        "204":
          description: Şarkı listeden çıkarıldı.

  # ==========================================
  # AKOR & AI SERVİSLERİ (Ezgi Orhan)
  # ==========================================
  /api/tools/transpose:
    post:
      tags: [Akor & AI Servisleri]
      summary: Akor Transpoze Servisi (Ezgi Orhan)
      description: Bir şarkının akorlarını saniyeler içinde istenilen tona matematiksel olarak kaydırır.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/TransposeInput'
      responses:
        "200":
          description: Transpoze işlemi başarılı.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TransposeResult'

  /api/tools/simplify/{id}:
    parameters:
      - $ref: '#/components/parameters/pathId'
    post:
      tags: [Akor & AI Servisleri]
      summary: Akor Basitleştirme [YAPAY ZEKA] (Ezgi Orhan)
      description: Karmaşık jazz veya bareli akorları, AI algoritmaları ile başlangıç seviyesine uygun hale getirir.
      responses:
        "200":
          description: AI analizi tamamlandı ve basitleştirilmiş içerik üretildi.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AIResult'
        "404":
          $ref: '#/components/responses/NotFound'
        "500":
          $ref: '#/components/responses/InternalServerError'

# ==========================================
# COMPONENTS (SCHEMAS, PARAMETERS, RESPONSES)
# ==========================================
components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  parameters:
    pathId:
      name: id
      in: path
      required: true
      schema: { type: string, example: "64a7c9f8e4b0" }
      description: Kaynağın sistemdeki benzersiz ID'si.
    PageParam:
      name: page
      in: query
      schema: { type: integer, default: 1 }
      description: Sayfalama için sayfa numarası.
    LimitParam:
      name: limit
      in: query
      schema: { type: integer, default: 10, maximum: 50 }
      description: Sayfa başına döndürülecek kayıt sayısı.

  responses:
    BadRequest:
      description: Geçersiz İstek. Gönderilen veriler şema ile uyuşmuyor.
      content:
        application/json:
          schema: { $ref: '#/components/schemas/Error' }
    Unauthorized:
      description: Yetkisiz. Erişim token'ı geçersiz veya eksik.
      content:
        application/json:
          schema: { $ref: '#/components/schemas/Error' }
    NotFound:
      description: Bulunamadı. İstenen kaynak sistemde mevcut değil.
      content:
        application/json:
          schema: { $ref: '#/components/schemas/Error' }
    InternalServerError:
      description: Sunucu Hatası. İşlem sırasında beklenmeyen bir sorun oluştu.
      content:
        application/json:
          schema: { $ref: '#/components/schemas/Error' }

  schemas:
    # --- GENEL ŞEMALAR ---
    Error:
      type: object
      required: [message]
      properties:
        message: { type: string, example: "Girdiğiniz verileri kontrol edip tekrar deneyiniz." }
        code: { type: string, example: "VAL_001" }

    # --- KULLANICI ŞEMALARI ---
    RegisterInput:
      type: object
      required: [username, email, password]
      properties:
        username: { type: string, example: "muzik_sever_hilal" }
        email: { type: string, format: email, example: "hilal@example.com" }
        password: { type: string, format: password, minLength: 8, example: "GucluSifre123!" }
        fullName: { type: string, example: "Hilal Ayyıldız" }

    LoginInput:
      type: object
      required: [email, password]
      properties:
        email: { type: string, example: "hilal@example.com" }
        password: { type: string, example: "GucluSifre123!" }

    AuthResponse:
      type: object
      properties:
        token: { type: string, example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
        userId: { type: string, example: "usr_9988" }
        expiresIn: { type: integer, example: 3600 }

    ProfileUpdate:
      type: object
      properties:
        fullName: { type: string }
        bio: { type: string }
        avatarUrl: { type: string, format: uri }

    # --- ŞARKI ŞEMALARI ---
    SongInput:
      type: object
      required: [title, artist, content]
      properties:
        title: { type: string, example: "Tamirci Çırağı" }
        artist: { type: string, example: "Cem Karaca" }
        content: { type: string, description: "Akorlar ve sözlerin yer aldığı metin bloğu." }
        genre: { type: string, example: "Anadolu Rock" }
        originalKey: { type: string, example: "Am" }

    SongList:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/SongBrief'
        meta:
          $ref: '#/components/schemas/PaginationMeta'

    SongBrief:
      type: object
      properties:
        id: { type: string }
        title: { type: string }
        artist: { type: string }
        popularity: { type: number }

    # --- ARAÇLAR & AI ---
    TransposeInput:
      type: object
      required: [songId, semitones]
      properties:
        songId: { type: string }
        semitones: { type: integer, example: 2, description: "Kaydırılacak yarım ses miktarı." }

    TransposeResult:
      type: object
      properties:
        originalKey: { type: string, example: "Am" }
        newKey: { type: string, example: "Bm" }
        transposedContent: { type: string }

    AIResult:
      type: object
      properties:
        simplifiedContent: { type: string }
        difficultyScore: { type: string, example: "Beginner" }
        aiConfidence: { type: number, example: 0.98 }
        transformations:
          type: array
          items: { type: string, example: "Bmaj7 -> B" }

    # --- LİSTE ŞEMALARI ---
    PlaylistInput:
      type: object
      required: [name]
      properties:
        name: { type: string, example: "Sahne Repertoarı - Mart 2026" }
        isPublic: { type: boolean, default: false }

    PaginationMeta:
      type: object
      properties:
        total: { type: integer }
        count: { type: integer }
        per_page: { type: integer }
        current_page: { type: integer }
