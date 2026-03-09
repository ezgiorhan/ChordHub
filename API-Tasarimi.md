openapi: 3.0.0
info:
  title: Music Chord Platform API
  description: REST API for managing users, songs, chords, playlists and notes.
  version: 1.0.0

servers:
  - url: https://api.musicplatform.com

paths:

  /auth/register:
    post:
      summary: Kayıt Olma
      tags: [Auth]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Register'
      responses:
        '201':
          description: Kullanıcı oluşturuldu

  /auth/login:
    post:
      summary: Giriş Yapma
      tags: [Auth]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Login'
      responses:
        '200':
          description: Giriş başarılı

  /auth/reset-password:
    post:
      summary: Şifre Yenileme
      tags: [Auth]
      responses:
        '200':
          description: Şifre sıfırlama linki gönderildi

  /profile:
    put:
      summary: Profil Güncelleme
      tags: [User]
      responses:
        '200':
          description: Profil güncellendi

  /songs:
    get:
      summary: Şarkı Arama
      tags: [Songs]
      parameters:
        - name: query
          in: query
          schema:
            type: string
      responses:
        '200':
          description: Şarkı listesi

    post:
      summary: Şarkı Ekleme
      tags: [Songs]
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Song'
      responses:
        '201':
          description: Şarkı eklendi

  /songs/popular:
    get:
      summary: Popüler Şarkıları Görüntüleme
      tags: [Songs]
      responses:
        '200':
          description: Popüler şarkı listesi

  /songs/{songId}:
    put:
      summary: Şarkı Düzenleme
      tags: [Songs]
      parameters:
        - name: songId
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: Şarkı güncellendi

    delete:
      summary: Şarkı Silme
      tags: [Songs]
      parameters:
        - name: songId
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: Şarkı silindi

  /songs/{songId}/rate:
    post:
      summary: Şarkı Puanlama
      tags: [Songs]
      parameters:
        - name: songId
          in: path
          required: true
          schema:
            type: integer
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                rating:
                  type: integer
      responses:
        '200':
          description: Puan verildi

  /songs/{songId}/transpose:
    post:
      summary: Ton Değiştirme (Transpoze)
      tags: [Chords]
      responses:
        '200':
          description: Ton değiştirildi

  /songs/{songId}/chords:
    get:
      summary: Akor Görselleştirici
      tags: [Chords]
      responses:
        '200':
          description: Akorlar görüntülendi

  /songs/{songId}/simplify:
    post:
      summary: Akor Basitleştirme (AI)
      tags: [Chords]
      responses:
        '200':
          description: Basitleştirilmiş akorlar

  /songs/{songId}/notes:
    post:
      summary: Not Ekleme
      tags: [Notes]
      responses:
        '201':
          description: Not eklendi

  /songs/{songId}/notes/{noteId}:
    delete:
      summary: Not Silme
      tags: [Notes]
      parameters:
        - name: noteId
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: Not silindi

  /playlists:
    post:
      summary: Liste Oluşturma
      tags: [Playlists]
      responses:
        '201':
          description: Liste oluşturuldu

  /playlists/{playlistId}/songs:
    post:
      summary: Listeye Şarkı Ekleme
      tags: [Playlists]
      parameters:
        - name: playlistId
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: Şarkı listeye eklendi

  /playlists/{playlistId}/reorder:
    put:
      summary: Liste Sırası Değiştirme
      tags: [Playlists]
      responses:
        '200':
          description: Liste sırası güncellendi

components:
  schemas:

    Register:
      type: object
      properties:
        username:
          type: string
        email:
          type: string
        password:
          type: string

    Login:
      type: object
      properties:
        email:
          type: string
        password:
          type: string

    Song:
      type: object
      properties:
        title:
          type: string
        artist:
          type: string
        chords:
          type: string
