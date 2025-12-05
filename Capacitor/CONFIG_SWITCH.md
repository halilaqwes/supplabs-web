# 🔄 Capacitor Config Değiştirme Rehberi

Bu rehber development (localhost) ve production (supplabs.xyz) modları arasında nasıl geçiş yapacağınızı gösterir.

## 📁 Mevcut Dosyalar

```
Capacitor/
├── capacitor.config.ts              # ← Aktif config (şu anda: localhost)
├── capacitor.config.dev.ts          # Development (localhost:3000)
└── capacitor.config.production.ts   # Production (supplabs.xyz)
```

## 🧪 Development Modu (Localhost)

**Ne zaman kullanılır:** Yerel geliştirme yaparken

### Aktif Hale Getirme

```powershell
# Capacitor klasöründe
cd Capacitor
Copy-Item capacitor.config.dev.ts capacitor.config.ts -Force
npx cap sync
```

**Ayarlar:**
- URL: `http://localhost:3000`
- Debugging: Açık
- Mixed Content: İzinli

### Kullanım:
1. Terminal 1: `npm run dev:host`
2. Terminal 2: `npm run cap:open`
3. Android Studio'da çalıştır

## 🚀 Production Modu (SuppLabs.xyz)

**Ne zaman kullanılır:** APK dağıtımı için, gerçek kullanıcılar için

### Aktif Hale Getirme

```powershell
# Capacitor klasöründe
cd Capacitor
Copy-Item capacitor.config.production.ts capacitor.config.ts -Force
npx cap sync
```

**Ayarlar:**
- URL: `https://www.supplabs.xyz`
- Debugging: Kapalı
- HTTPS: Güvenli bağlantı

### Kullanım:
1. `npm run cap:open`
2. Android Studio'da APK oluştur
3. APK'yı dağıt

## ⚡ Quick Commands

### Development'e geç
```bash
cd c:\Users\halilaqwes\Desktop\webb\Capacitor
Copy-Item capacitor.config.dev.ts capacitor.config.ts -Force
npx cap sync
```

### Production'a geç
```bash
cd c:\Users\halilaqwes\Desktop\webb\Capacitor
Copy-Item capacitor.config.production.ts capacitor.config.ts -Force
npx cap sync
```

## ✅ Hangi Moddasınız?

`capacitor.config.ts` dosyasını açın ve `server.url` satırına bakın:

- `http://localhost:3000` → Development modu
- `https://www.supplabs.xyz` → Production modu

## 📱 Önerilen Workflow

### 1. **Geliştirme Aşaması**
```
Development mode → Test → Debug → Fix
```

### 2. **Test Aşaması**
```
Production mode → APK oluştur → Test → Geri bildirim
```

### 3. **Yayın Aşaması**
```
Production mode → Release APK → Dağıt
```

## 🎯 APK Türleri

| Tür | Config | Kullanım | Debugging |
|-----|--------|----------|-----------|
| **Debug APK** | Dev veya Prod | Dahili test | Açık |
| **Release APK** | Production | Google Play | Kapalı |

## 💡 İpuçları

> [!TIP]
> **Development Avantajları**
> - Hot reload çalışır
> - Chrome DevTools kullanabilirsiniz
> - Hızlı test döngüsü

> [!WARNING]
> **Production'da Dikkat**
> - supplabs.xyz çalışıyor olmalı
> - Tüm API'ler production'da hazır olmalı
> - HTTPS sertifikası geçerli olmalı

> [!IMPORTANT]
> **APK Dağıtımı İçin**
> 
> Son kullanıcılara dağıtacağınız APK'yı MUTLAKA production mode ile oluşturun!

## 🔧 Troubleshooting

### "ERR_CONNECTION_REFUSED" hatası

**Development modunda:**
- `npm run dev:host` çalıştığından emin olun
- IP adresinizi config'e ekleyin (192.168.x.x:3000)

**Production modunda:**
- supplabs.xyz sitesi çalışıyor mu kontrol edin
- İnternet bağlantınızı kontrol edin

### Değişiklikler yansımıyor

```bash
# Clean ve rebuild
cd Capacitor
npx cap sync
npx cap copy
```

## 📞 Yardım

Mod değiştirirken sorun yaşarsanız:
1. `capacitor.config.ts` içeriğini kontrol edin
2. `npx cap sync` çalıştırın
3. Android Studio'da Clean Project yapın
