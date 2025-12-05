# SuppLabs Android App - Capacitor Kullanım Kılavuzu

Bu klasör, web projenizi Android uygulamasına dönüştürmek için Capacitor yapılandırmasını içerir.

## 📱 Nasıl Çalışır?

Bu Android uygulaması **server mode** ile çalışır. Yani:
- Uygulama, localhost:3000'de çalışan Next.js dev sunucusuna bağlanır
- Tüm API route'ları ve backend özellikleri çalışır
- Gerçek zamanlı geliştirme yapabilirsiniz

## 🚀 Kullanım Adımları

### 1. Dev Sunucusunu Başlatın

İlk terminal penceresinde:
```bash
npm run dev:host
```

Bu komut web uygulamanızı `0.0.0.0:3000` adresinde çalıştırır (Android emulator'dan erişilebilir).

### 2. Android Studio'da Açın

İkinci terminal penceresinde:
```bash
npm run cap:open
```

Bu komut Android Studio'yu açar. İlk açılışta:
1. Gradle sync başlayacak (birkaç dakika sürebilir)
2. Gerekli Android SDK'ları indirilecek
3. Proje hazır olduğunda çalıştırabilirsiniz

### 3. Emulator veya Cihazda Çalıştırın

Android Studio'da:
1. Üst kısımda hedef cihazı seçin (emulator veya fiziksel cihaz)
2. Yeşil "Run" butonuna tıklayın
3. Uygulama açılacak ve localhost:3000'e bağlanacak

## 🔧 Önemli Komutlar

### Capacitor Sync
Değişiklikleri Android projesine aktarın:
```bash
npm run cap:sync
```

### Değişiklikleri Kopyala
Sadece web dosyalarını kopyalayın:
```bash
npm run cap:copy
```

### Capacitor Güncelle
Capacitor paketlerini güncelleyin:
```bash
npm run cap:update
```

## 📦 APK Oluşturma

### Debug APK (Test için)

Android Studio'da:
1. **Build → Build Bundle(s) / APK(s) → Build APK(s)**
2. APK hazır olduğunda bildirim gelecek
3. APK konumu: `Capacitor/android/app/build/outputs/apk/debug/app-debug.apk`

### Release APK (Yayın için)

1. **Keystore oluşturun** (ilk kez):
```bash
keytool -genkey -v -keystore supplabs.keystore -alias supplabs -keyalg RSA -keysize 2048 -validity 10000
```

2. Android Studio'da:
   - **Build → Generate Signed Bundle / APK**
   - **APK** seçin
   - Keystore dosyanızı seçin
   - Şifrenizi girin
   - **release** build variant seçin
   - APK oluşturulacak

## 🌐 Production için Yapılandırma

Şu anda uygulama localhost'a bağlanıyor. Production için:

### Option 1: Vercel URL kullan

`capacitor.config.ts` dosyasını düzenleyin:
```typescript
server: {
  url: 'https://your-app.vercel.app',
  cleartext: false,
  androidScheme: 'https'
}
```

### Option 2: Hybrid mode (bundled + server)

Production build ile birlikte gelen statik dosyaları kullan, API'ler için server'a bağlan.

## 🎨 App Icon ve Splash Screen

### Icon Oluşturma

1. 1024x1024 boyutunda bir icon oluşturun
2. [capacitor-assets](https://github.com/ionic-team/capacitor-assets) kullanın:

```bash
npm install -g @capacitor/assets
cd Capacitor
npx capacitor-assets generate --android
```

### Manuel Icon Değiştirme

Icon'lar şurada: `android/app/src/main/res/`
- `mipmap-mdpi/` → 48x48
- `mipmap-hdpi/` → 72x72
- `mipmap-xhdpi/` → 96x96
- `mipmap-xxhdpi/` → 144x144
- `mipmap-xxxhdpi/` → 192x192

## 🔍 Troubleshooting

### "Cleartext HTTP not permitted" hatası

`android/app/src/main/AndroidManifest.xml` dosyasında:
```xml
<application
    android:usesCleartextTraffic="true"
    ...>
```

### Gradle sync hatası

1. Android Studio'da: **File → Invalidate Caches / Restart**
2. Terminal'de:
```bash
cd Capacitor/android
./gradlew clean
```

### Port erişim sorunu

Bilgisayarınızın IP adresini kullanın:
```bash
ipconfig  # Windows'ta IP adresinizi bulun
```

`capacitor.config.ts` içinde:
```typescript
url: 'http://192.168.1.XXX:3000'
```

## 📝 Notlar

- **Dev Mode**: Değişiklikleri test etmek için ideal, hot reload çalışır
- **Production**: APK dağıtımı için server URL'ini production URL'ye değiştirin
- **Debugging**: Chrome DevTools kullanarak `chrome://inspect` adresinden debug edebilirsiniz

## 🎯 Sonraki Adımlar

1. ✅ Android Studio yükleyin (eğer yoksa)
2. ✅ `npm run cap:open` ile projeyi açın
3. ✅ Emulator veya fiziksel cihazda test edin
4. 📱 APK oluşturun ve dağıtın

## 🔗 Faydalı Linkler

- [Capacitor Dokümantasyon](https://capacitorjs.com/docs)
- [Android Studio İndirme](https://developer.android.com/studio)
- [Capacitor Android Kılavuzu](https://capacitorjs.com/docs/android)
