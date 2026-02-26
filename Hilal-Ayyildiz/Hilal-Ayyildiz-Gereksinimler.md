

1. Kayıt Olma
API Metodu: POST /auth/register

Açıklama: Kullanıcının sisteme e-posta ve şifre ile yeni bir hesap tanımlamasını sağlar. Bu işlemle birlikte kullanıcıya ait benzersiz bir profil oluşturulur.

2. Giriş Yapma
API Metodu: POST /auth/login

Açıklama: Kayıtlı kullanıcıların kişisel repertuvarlarına, setlistlerine ve ayarlarına erişimi için kimlik doğrulaması yapılır. Kullanıcı sisteme güvenli bir oturumla dahil edilir.

3. Şarkı Ekleme
API Metodu: POST /songs

Açıklama: Sisteme yeni şarkı ismi, sanatçı adı, şarkı sözleri ve akor verilerinin girişinin yapılmasını sağlar. Veritabanına yeni bir içerik kaydı oluşturulur.

4. Şarkı Silme
API Metodu: DELETE /songs/:songId

Açıklama: Kullanıcının kendi listesinde veya kütüphanesinde artık görmek istemediği şarkıları veritabanından kalıcı olarak kaldırmasını sağlar.

5. Arama Yapma
API Metodu: GET /songs/search

Açıklama: Şarkı adına veya sanatçı ismine göre anahtar kelime ile hızlı filtreleme yapılmasını sağlar. Kullanıcıların binlerce içerik arasından istediği esere ulaşmasını kolaylaştırır.

6. Profil Güncelleme
API Metodu: PUT /user/profile

Açıklama: Kullanıcının hesap bilgilerini, müzikal tercihlerini ve arayüz ayarlarını düzenlemesine yardımcı olur. Kullanıcı yalnızca kendi yetki alanındaki bilgileri değiştirebilir.

7. Şifre Yenileme
API Metodu: PUT /user/password-reset

Açıklama: Unutulan veya güvenlik ihlali şüphesi duyulan şifrelerin güvenli bir şekilde sıfırlanması için imkan tanır.

8. Şarkı Düzenleme
API Metodu: PUT /songs/:songId

Açıklama: Mevcut şarkı metinleri veya akorların yanlış konumlandırılması durumunda içerik üzerinde düzeltme ve iyileştirme yapılmasını sağlar.

9. Popüler Şarkıları Görüntüleme
API Metodu: GET /songs/popular

Açıklama: Topluluk tarafından en yüksek puanı alan veya en çok kullanılan şarkıları öncelikli olarak listeler. Trend olan içeriklerin keşfedilmesini sağlar.
