
1. **Liste Oluşturma** - **API Metodu:** `POST /setlists`
* **Açıklama:** Belirli bir performans veya prova için özel çalma listeleri (setlist) tanımlanmasını sağlar. Kullanıcılar sahne planlarına göre şarkıları gruplandırabilir.


2. **Listeye Ekleme** - **API Metodu:** `POST /setlists/:listId/songs`
* **Açıklama:** Genel kütüphanedeki şarkıların, daha önce oluşturulan özel setlistlere atanmasını sağlar. Bir şarkı birden fazla listede yer alabilir.


3. **Sıra Değiştirme** - **API Metodu:** `PUT /setlists/:listId/order`
* **Açıklama:** Çalma listesindeki şarkıların icra sırasının kullanıcı tarafından sürükle-bırak veya manuel olarak belirlenmesini sağlar.


4. **Ton Değiştirme** - **API Metodu:** `GET /songs/:songId/transpose`
* **Açıklama:** Şarkı akorlarının tek tıkla farklı tonlara (transpoze) otomatik olarak dönüştürülmesini sağlar. Müzisyenin ses aralığına en uygun tonu bulmasına yardımcı olur.


5. **Akor Görselleştirici** - **API Metodu:** `GET /chords/:chordName/diagram`
* **Açıklama:** Seçilen akorun parmak pozisyonlarını ve basılış şeklini görsel bir diyagram olarak sunar. Özellikle yeni başlayanlar için eğitici bir araçtır.


6. **Not Ekleme** - **API Metodu:** `POST/PUT /songs/:songId/notes`
* **Açıklama:** Şarkıların belirli satırlarına veya bölümlerine sadece kullanıcının göreceği hatırlatıcı notlar (performans detayları, teknik ipuçları vb.) eklenmesini sağlar.


7. **Not Silme** - **API Metodu:** `DELETE /songs/:songId/notes/:noteId`
* **Açıklama:** Şarkı üzerine eklenen hatırlatıcı notların silinmesini ve içeriğin temizlenmesini sağlar.


8. **Akor Basitleştirme** - **API Metodu:** `GET/POST /ai/simplify-chords`
* **Açıklama:** Yapay zeka algoritması ile karmaşık (7’li, 9’lu vb.) akorları, tınıyı bozmadan temel akorlara dönüştürerek çalımı kolaylaştırır.


9. **Şarkı Puanlama** - **API Metodu:** `POST /songs/:songId/rate`
* **Açıklama:** Kullanıcının şarkılara 1-5 arası puan vermesini sağlar. Bu veriler popüler şarkılar listesinin algoritmasını beslemek için kullanılır.
