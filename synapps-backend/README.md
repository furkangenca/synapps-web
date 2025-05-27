# Synapps Backend

Bu proje, **FastAPI** ile geliştirilmiş modern, asenkron bir backend uygulamasıdır. PostgreSQL veritabanı ile entegre çalışır ve kullanıcı kimlik doğrulaması (auth), görev yönetimi ve etkinlik/atama işlemleri gibi temel işlevsellikleri içerir. Modüler bir yapı kullanılarak tasarlanmıştır, bu da bakım ve genişletmeyi kolaylaştırır.

---

## Proje Yapısı

```
synapps-backend/
├── main.py              # Uygulama giriş noktası
├── config.py            # Yapılandırma ayarları (veritabanı vb.)
├── database.py          # Veritabanı bağlantısı ve oturum yönetimi
├── models/              # SQLAlchemy modelleri
│   ├── __init__.py
│   ├── user.py
│   ├── session.py
│   ├── project_board.py
│   ├── column.py
│   ├── task.py
│   ├── notification.py
│   └── board_member.py
├── schemas/             # Pydantic veri doğrulama şemaları
│   ├── __init__.py
│   ├── user.py
│   ├── task.py
│   └── ...
├── routers/             # API endpoint'leri (route'lar)
│   ├── __init__.py
│   ├── user.py
│   ├── task.py
│   ├── board.py
│   ├── column.py
│   └── ...
└── requirements.txt     # Proje bağımlılıkları
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

## Endpoint'ler

Aşağıdaki endpoint'ler, görevler, proje panoları ve sütunlar için CRUD işlemlerini destekler. Detaylar için Swagger UI (`/docs`) kullanılabilir.

### Tasks (Görevler)
- **`POST /tasks/`**: Yeni görev oluşturur.  
  **Örnek**: `curl -X POST "http://localhost:8000/tasks/" -d '{"title": "API yaz", "column_id": 1}'`
- **`GET /tasks/`**: Tüm görevleri listeler (filtreleme: `column_id`, `assigned_user_id`).  
  **Örnek**: `curl "http://localhost:8000/tasks/?column_id=1"`
- **`GET /tasks/{task_id}`**: Görev detaylarını alır.  
  **Örnek**: `curl "http://localhost:8000/tasks/1"`
- **`PUT /tasks/{task_id}`**: Görevi günceller.  
  **Örnek**: `curl -X PUT "http://localhost:8000/tasks/1" -d '{"status": "in_progress"}'`
- **`DELETE /tasks/{task_id}`**: Görevi siler.  
  **Örnek**: `curl -X DELETE "http://localhost:8000/tasks/1"`
- **`GET /tasks/by-status/`**: Duruma göre görevleri filtreler.  
  **Örnek**: `curl "http://localhost:8000/tasks/by-status/?status=in_progress"`

### Boards (Proje Panoları)
- **`POST /boards/`**: Yeni bir board oluşturur.  
  **Örnek**: `curl -X POST "http://localhost:8000/boards/" -d '{"name": "Yeni Board", "user_id": 1}'`
- **`GET /boards/`**: Tüm board'ları listeler.  
  **Örnek**: `curl "http://localhost:8000/boards/"`
- **`GET /boards/{board_id}`**: Board detaylarını alır.  
  **Örnek**: `curl "http://localhost:8000/boards/1"`
- **`PUT /boards/{board_id}`**: Board'u günceller.  
  **Örnek**: `curl -X PUT "http://localhost:8000/boards/1" -d '{"name": "Güncellenmiş Board"}'`
- **`DELETE /boards/{board_id}`**: Board'u siler.  
  **Örnek**: `curl -X DELETE "http://localhost:8000/boards/1"`

### Columns (Sütunlar)
- **`POST /columns/`**: Yeni bir sütun oluşturur.  
  **Örnek**: `curl -X POST "http://localhost:8000/columns/" -d '{"title": "Yapılacaklar", "board_id": 1}'`
- **`GET /columns/`**: Tüm sütunları listeler (filtreleme: `board_id`).  
  **Örnek**: `curl "http://localhost:8000/columns/?board_id=1"`
- **`GET /columns/{column_id}`**: Sütun detaylarını alır.  
  **Örnek**: `curl "http://localhost:8000/columns/1"`
- **`PUT /columns/{column_id}`**: Sütunu günceller.  
  **Örnek**: `curl -X PUT "http://localhost:8000/columns/1" -d '{"title": "Güncellenmiş Sütun"}'`
- **`DELETE /columns/{column_id}`**: Sütunu siler.  
  **Örnek**: `curl -X DELETE "http://localhost:8000/columns/1"`

### Board Members (Pano Üyeleri)
- **`POST /board-members/`**: Yeni bir board üyesi ekler.  
  **Örnek**: `curl -X POST "http://localhost:8000/board-members/" -d '{"board_id": 1, "user_id": 2, "role": "member"}'`
- **`GET /board-members/`**: Tüm board üyelerini listeler (filtreleme: `board_id`, `user_id`).  
  **Örnek**: `curl "http://localhost:8000/board-members/?board_id=1"`
- **`GET /board-members/{member_id}`**: Üye detaylarını alır.  
  **Örnek**: `curl "http://localhost:8000/board-members/1"`
- **`PUT /board-members/{member_id}`**: Üyenin rolünü günceller.  
  **Örnek**: `curl -X PUT "http://localhost:8000/board-members/1" -d '{"role": "owner"}'`
- **`DELETE /board-members/{member_id}`**: Üyeyi siler.  
  **Örnek**: `curl -X DELETE "http://localhost:8000/board-members/1"`

### Notifications (Bildirimler)
- **`POST /notifications/`**: Yeni bir bildirim oluşturur.  
  **Örnek**: `curl -X POST "http://localhost:8000/notifications/" -d '{"user_id": 1, "notification_type": "task_assigned", "message": "Yeni görev"}'`
- **`GET /notifications/`**: Tüm bildirimleri listeler (filtreleme: `user_id`, `is_read`).  
  **Örnek**: `curl "http://localhost:8000/notifications/?user_id=1"`
- **`GET /notifications/{notification_id}`**: Bildirim detaylarını alır.  
  **Örnek**: `curl "http://localhost:8000/notifications/1"`
- **`PUT /notifications/{notification_id}`**: Bildirimi günceller (ör. okundu işaretleme).  
  **Örnek**: `curl -X PUT "http://localhost:8000/notifications/1" -d '{"is_read": true}'`
- **`DELETE /notifications/{notification_id}`**: Bildirimi siler.  
  **Örnek**: `curl -X DELETE "http://localhost:8000/notifications/1"`

### Users (Kullanıcılar)
- **`POST /users/`**: Yeni bir kullanıcı oluşturur.  
  **Örnek**: `curl -X POST "http://localhost:8000/users/" -d '{"name": "Ahmet", "email": "ahmet@example.com", "password": "sifre123"}'`
- **`GET /users/`**: Tüm kullanıcıları listeler.  
  **Örnek**: `curl "http://localhost:8000/users/"`
- **`GET /users/{user_id}`**: Kullanıcı detaylarını alır.  
  **Örnek**: `curl "http://localhost:8000/users/1"`
- **`PUT /users/{user_id}`**: Kullanıcıyı günceller.  
  **Örnek**: `curl -X PUT "http://localhost:8000/users/1" -d '{"name": "Ahmet Yeni"}'`
- **`DELETE /users/{user_id}`**: Kullanıcıyı siler.  
  **Örnek**: `curl -X DELETE "http://localhost:8000/users/1"`
---

## Yapılacaklar (TODO)

### 1. Kimlik Doğrulama (Auth)
- Kullanıcı kayıt, giriş ve oturum yönetimi için endpoint'ler (`/auth/register`, `/auth/login`, vb.).
- JWT ile kimlik doğrulama entegrasyonu.

### 2. Modeller ve Şemalar
- Tüm modeller için CRUD işlemleri tamamlanacak (`Notification`, `BoardMember`, vb.).
- Veritabanı bağlantısı ve asenkron işlemler optimize edilecek.

---

## Ek Notlar

- **Kimlik Doğrulama**: Auth tamamlandıktan sonra endpoint'ler JWT ile korunabilir.
- **Dokümantasyon**: Tüm detaylar `/docs` adresinde mevcut.
- **Test**: `pytest` ve `pytest-asyncio` ile testler yazılabilir.

---

## Katkıda Bulunma

1. Depoyu klonlayın:
   ```bash
   git clone https://github.com/kullanici/synapps-backend.git
   ```
2. Değişikliklerinizi yapın ve pull request açın.

---

## Lisans

Bu proje [MIT Lisansı](LICENSE) ile lisanslanmıştır.

---
```