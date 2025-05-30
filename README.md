# SynApps

SynApps, modern ve kullanıcı dostu bir proje yönetim uygulamasıdır. Frontend ve backend olmak üzere iki ana bileşenden oluşur. Proje, görev yönetimi, proje panoları, kullanıcı yönetimi ve gerçek zamanlı bildirimler gibi özellikler sunar.

## Proje Yapısı

```
synapps/
├── synapps-frontend/ # Next.js tabanlı frontend uygulaması
│ ├── app/ # Next.js app router
│ ├── components/ # React bileşenleri
│ ├── hooks/ # Custom React hooks
│ └── ...
│
└── synapps-backend/ # FastAPI tabanlı backend uygulaması
├── routers/ # API endpoint'leri
├── models/ # Veritabanı modelleri
├── schemas/ # Pydantic şemaları
└── ...
```

## Teknolojiler

### Frontend
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Radix UI
- React Hook Form + Zod
- @hello-pangea/dnd (Sürükle-Bırak)

### Backend
- FastAPI
- PostgreSQL
- SQLAlchemy
- Pydantic
- JWT Authentication
- Asyncpg

## Kurulum

### Gereksinimler
- Node.js 18.0.0+
- Python 3.8+
- PostgreSQL 12+
- pnpm veya npm

### Backend Kurulumu

1. Backend dizinine gidin:
```bash
cd synapps-backend
```

2. Sanal ortam oluşturun ve aktifleştirin:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# veya
.\venv\Scripts\activate  # Windows
```

3. Bağımlılıkları yükleyin:
```bash
pip install -r requirements.txt
```

4. Veritabanı ayarlarını yapılandırın:
- PostgreSQL veritabanı oluşturun
- `config.py` dosyasında veritabanı bağlantı bilgilerini güncelleyin

5. Backend'i başlatın:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Kurulumu

1. Frontend dizinine gidin:
```bash
cd synapps-frontend
```

2. Bağımlılıkları yükleyin:
```bash
pnpm install
# veya
npm install
```

3. Frontend'i başlatın:
```bash
pnpm dev
# veya
npm run dev
```

## Özellikler

### Kullanıcı Yönetimi
- Kayıt ve giriş
- Profil yönetimi
- Rol tabanlı yetkilendirme

### Proje Panoları
- Board oluşturma ve düzenleme
- Sütun yönetimi
- Sürükle-bırak ile görev organizasyonu

### Görev Yönetimi
- Görev oluşturma ve düzenleme
- Görev atama
- Durum takibi
- Öncelik belirleme

### Bildirimler
- Gerçek zamanlı bildirimler
- Görev atama bildirimleri
- Sistem bildirimleri

### Ekip Yönetimi
- Üye ekleme/çıkarma
- Rol atama
- İzin yönetimi

## API Dokümantasyonu

Backend API dokümantasyonuna şu adreslerden erişebilirsiniz:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Geliştirme

### Backend Geliştirme
```bash
cd synapps-backend
uvicorn main:app --reload
```

### Frontend Geliştirme
```bash
cd synapps-frontend
pnpm dev
# veya
npm run dev
```

## Deployment

### Backend Deployment
1. Production build:
```bash
cd synapps-backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Frontend Deployment
1. Production build:
```bash
cd synapps-frontend
pnpm build
# veya
npm run build
```

2. Production sunucusunu başlatın:
```bash
pnpm start
# veya
npm start
```
## Database Diagram

![image](https://github.com/user-attachments/assets/e33c0138-55ac-45b0-af60-808beb4ea325)


## Katkıda Bulunma

1. Fork'layın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## Güvenlik

- JWT tabanlı kimlik doğrulama
- Password hashing (bcrypt)
- CORS yapılandırması
- Input validation
- XSS ve CSRF koruması

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## İletişim

Furkan Genca - [@furkangenca](https://github.com/furkangenca)

Proje Linki: [https://github.com/furkangenca/synapps-web](https://github.com/furkangenca/synapps-web)
