# Synapps Backend

Bu proje, **FastAPI** ile geliştirilmiş modern, asenkron bir backend uygulamasıdır. PostgreSQL veritabanı ile entegre çalışır ve kullanıcı kimlik doğrulaması (auth), görev yönetimi ve etkinlik/atama işlemleri gibi temel işlevsellikleri içerir. Modüler bir yapı kullanılarak tasarlanmıştır, bu da bakım ve genişletmeyi kolaylaştırır.

---

## Proje Yapısı

```
synapps-backend/
├── main.py # Uygulama giriş noktası
├── config.py # Yapılandırma ayarları (veritabanı vb.)
├── database.py # Veritabanı bağlantısı ve oturum yönetimi
├── models/ # SQLAlchemy modelleri
│ ├── init.py
│ ├── user.py
│ ├── board.py
│ ├── column.py
│ ├── task.py
│ ├── notification.py
│ └── board_member.py
├── schemas/ # Pydantic veri doğrulama şemaları
│ ├── init.py
│ ├── user.py
│ ├── task.py
│ └── ...
├── routers/ # API endpoint'leri (route'lar)
│ ├── init.py
│ ├── auth.py
│ ├── user.py
│ ├── task.py
│ ├── board.py
│ ├── column.py
│ ├── board_member.py
│ └── notification.py
└── requirements.txt # Proje bağımlılıkları
```

---

## Gereksinimler

- **Python**: 3.7 veya üstü
- **Bağımlılıklar**:
  ```bash
  pip install -r requirements.txt
  ```
  Gerekli kütüphaneler: `fastapi`, `uvicorn`, `sqlalchemy`, `asyncpg`, `pydantic`

- **Veritabanı**: PostgreSQL (asenkron destek için `asyncpg` kullanılır)

---

## Kurulum

1. **Bağımlılıkları Yükleyin**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Veritabanı Ayarlarını Yapılandırın**:
   - `config.py` dosyasındaki `DATABASE_URL`'yi güncelleyin:
     ```python
     DATABASE_URL = "postgresql+asyncpg://kullanici:parola@localhost/veritabani"
     ```

3. **Uygulamayı Çalıştırın**:
   ```bash
   python main.py
   ```
   - Uygulama `http://localhost:8000` adresinde çalışır.
   - API dokümantasyonu: `http://localhost:8000/docs`

---


## Gereksinimler

- Python: 3.7 veya üstü
- PostgreSQL: 12 veya üstü

Bağımlılıklar:
```bash
pip install -r requirements.txt
```

Gerekli kütüphaneler: fastapi, uvicorn, sqlalchemy, asyncpg, pydantic, python-jose, passlib, bcrypt

## Kurulum

1. Bağımlılıkları Yükleyin:
```bash
pip install -r requirements.txt
```

2. Veritabanı Ayarlarını Yapılandırın:
`config.py` dosyasındaki DATABASE_URL'yi güncelleyin:
```python
DATABASE_URL = "postgresql+asyncpg://kullanici:parola@localhost/veritabani"
```

3. Uygulamayı Çalıştırın:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

- Uygulama http://localhost:8000 adresinde çalışır
- API dokümantasyonu: http://localhost:8000/docs

## Endpoint'ler

### Kimlik Doğrulama (Auth)
- `POST /auth/login`: Kullanıcı girişi
- `POST /auth/register`: Yeni kullanıcı kaydı
- `POST /auth/refresh`: Token yenileme

### Kullanıcılar (Users)
- `POST /users/`: Yeni kullanıcı oluştur
- `GET /users/`: Tüm kullanıcıları listele
- `GET /users/{user_id}`: Kullanıcı detaylarını getir
- `PUT /users/{user_id}`: Kullanıcı bilgilerini güncelle
- `DELETE /users/{user_id}`: Kullanıcıyı sil

### Görevler (Tasks)
- `POST /tasks/`: Yeni görev oluştur
- `GET /tasks/`: Tüm görevleri listele (filtreleme: column_id, assigned_user_id)
- `GET /tasks/{task_id}`: Görev detaylarını getir
- `PUT /tasks/{task_id}`: Görevi güncelle
- `DELETE /tasks/{task_id}`: Görevi sil

### Proje Panoları (Boards)
- `POST /boards/`: Yeni board oluştur
- `GET /boards/`: Tüm board'ları listele
- `GET /boards/{board_id}`: Board detaylarını getir
- `PUT /boards/{board_id}`: Board'u güncelle
- `DELETE /boards/{board_id}`: Board'u sil

### Sütunlar (Columns)
- `POST /columns/`: Yeni sütun oluştur
- `GET /columns/`: Tüm sütunları listele (filtreleme: board_id)
- `GET /columns/{column_id}`: Sütun detaylarını getir
- `PUT /columns/{column_id}`: Sütunu güncelle
- `DELETE /columns/{column_id}`: Sütunu sil

### Board Üyeleri (Board Members)
- `POST /board-members/`: Yeni board üyesi ekle
- `GET /board-members/`: Tüm board üyelerini listele (filtreleme: board_id, user_id)
- `GET /board-members/{member_id}`: Üye detaylarını getir
- `PUT /board-members/{member_id}`: Üyenin rolünü güncelle
- `DELETE /board-members/{member_id}`: Üyeyi sil

### Bildirimler (Notifications)
- `POST /notifications/`: Yeni bildirim oluştur
- `GET /notifications/`: Tüm bildirimleri listele (filtreleme: user_id, is_read)
- `GET /notifications/{notification_id}`: Bildirim detaylarını getir
- `PUT /notifications/{notification_id}`: Bildirimi güncelle (örn. okundu işaretleme)
- `DELETE /notifications/{notification_id}`: Bildirimi sil

## Örnek Kullanımlar

### Görev Oluşturma
```bash
curl -X POST "http://localhost:8000/tasks/" \
     -H "Content-Type: application/json" \
     -d '{"title": "API yaz", "column_id": 1}'
```

### Board Oluşturma
```bash
curl -X POST "http://localhost:8000/boards/" \
     -H "Content-Type: application/json" \
     -d '{"name": "Yeni Board", "description": "Proje yönetimi"}'
```

### Sütun Oluşturma
```bash
curl -X POST "http://localhost:8000/columns/" \
     -H "Content-Type: application/json" \
     -d '{"title": "Yapılacaklar", "board_id": 1}'
```

### Board Üyesi Ekleme
```bash
curl -X POST "http://localhost:8000/board-members/" \
     -H "Content-Type: application/json" \
     -d '{"board_id": 1, "user_id": 2, "role": "member"}'
```

### Bildirim Oluşturma
```bash
curl -X POST "http://localhost:8000/notifications/" \
     -H "Content-Type: application/json" \
     -d '{"user_id": 1, "title": "Yeni Görev", "message": "Size yeni bir görev atandı"}'
```

## Güvenlik

- JWT tabanlı kimlik doğrulama
- Password hashing (bcrypt)
- CORS yapılandırması
- Input validation (Pydantic)
- Asenkron veritabanı işlemleri (asyncpg)

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## İletişim

Furkan Genca - [@furkangenca](https://github.com/furkangenca)

Proje Linki: [https://github.com/furkangenca/synapps-web](https://github.com/furkangenca/synapps-web)
