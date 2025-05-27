# SynApps Frontend

SynApps, modern ve kullanıcı dostu bir proje yönetim uygulamasının frontend kısmıdır. Next.js 15, React 19, TypeScript ve Tailwind CSS kullanılarak geliştirilmiştir. Radix UI bileşenleri ile zenginleştirilmiş, sürükle-bırak özellikli, responsive bir arayüz sunar.

## Proje Yapısı

```
synapps-frontend/
├── app/ # Next.js 13+ app router yapısı
│ ├── (auth)/ # Kimlik doğrulama sayfaları
│ ├── (dashboard)/ # Dashboard sayfaları
│ └── api/ # API route'ları
├── components/ # Yeniden kullanılabilir UI bileşenleri
│ ├── ui/ # Temel UI bileşenleri
│ ├── forms/ # Form bileşenleri
│ └── shared/ # Paylaşılan bileşenler
├── hooks/ # Custom React hooks
├── lib/ # Yardımcı fonksiyonlar ve utilities
├── public/ # Statik dosyalar
├── styles/ # Global stiller
├── types/ # TypeScript type tanımlamaları
└── config/ # Yapılandırma dosyaları
```


## Teknolojiler

- **Framework:** Next.js 15
- **UI Kütüphanesi:** React 19
- **Dil:** TypeScript
- **Stil:** Tailwind CSS
- **UI Bileşenleri:** Radix UI
- **Form Yönetimi:** React Hook Form + Zod
- **Sürükle-Bırak:** @hello-pangea/dnd
- **Tema:** next-themes
- **Bildirimler:** Sonner
- **Grafikler:** Recharts
- **Tarih İşlemleri:** date-fns

## Gereksinimler

- Node.js 18.0.0 veya üstü
- pnpm veya npm

## Kurulum

1. Projeyi klonlayın:
```bash
git clone https://github.com/furkangenca/synapps-web.git
cd synapps-web/synapps-frontend
```

2. Bağımlılıkları yükleyin:
```bash
pnpm install
# veya
npm install
```

3. Geliştirme sunucusunu başlatın:
```bash
pnpm dev
# veya
npm run dev
```

Uygulama http://localhost:3000 adresinde çalışacaktır.

## Özellikler

### Kimlik Doğrulama
- Kullanıcı kaydı ve girişi
- JWT tabanlı kimlik doğrulama
- Oturum yönetimi

### Dashboard
- Proje panoları görünümü
- Sürükle-bırak ile görev yönetimi
- Gerçek zamanlı güncellemeler

### Görev Yönetimi
- Görev oluşturma ve düzenleme
- Görev atama ve takip
- Görev durumu güncelleme
- Görev filtreleme ve arama

### Proje Panoları
- Board oluşturma ve düzenleme
- Sütun yönetimi
- Üye yönetimi ve yetkilendirme

### Bildirimler
- Gerçek zamanlı bildirimler
- Görev atama bildirimleri
- Sistem bildirimleri

## Geliştirme

### Komutlar

```bash
# Geliştirme sunucusunu başlat
pnpm dev

# Production build
pnpm build

# Production sunucusunu başlat
pnpm start

# Lint kontrolü
pnpm lint
```

### Kod Yapısı

- **Bileşenler:** `components/` dizininde bulunur
  - `ui/`: Temel UI bileşenleri (button, input, card vb.)
  - `forms/`: Form bileşenleri
  - `shared/`: Paylaşılan bileşenler

- **Sayfalar:** `app/` dizininde bulunur
  - `(auth)/`: Kimlik doğrulama sayfaları
  - `(dashboard)/`: Dashboard sayfaları

- **Hooks:** `hooks/` dizininde bulunur
  - Custom React hooks
  - API entegrasyonu için hooks

- **Tipler:** `types/` dizininde bulunur
  - TypeScript interface ve type tanımlamaları

## Stil Rehberi

- Tailwind CSS kullanılmaktadır
- Radix UI bileşenleri temel alınmıştır
- Responsive tasarım prensipleri uygulanmıştır
- Dark/Light tema desteği vardır

## Performans Optimizasyonları

- Next.js Image optimizasyonu
- Code splitting
- Lazy loading
- Memoization
- Server-side rendering (SSR)

## Güvenlik

- CSRF koruması
- XSS koruması
- Input sanitization
- Güvenli HTTP başlıkları

## Deployment

1. Production build oluşturun:
```bash
pnpm build
```

2. Production sunucusunu başlatın:
```bash
pnpm start
```

## Katkıda Bulunma

1. Fork'layın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## İletişim

Furkan Genca - [@furkangenca](https://github.com/furkangenca)

Proje Linki: [https://github.com/furkangenca/synapps-web](https://github.com/furkangenca/synapps-web)
