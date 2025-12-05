# 🎨 SuppLabs Android İkon Güncelleme Rehberi

## ✅ İkonlar Başarıyla Kuruldu!

Logonuz (`logo-new.png`) kullanılarak Android uygulama ikonları oluşturuldu ve Capacitor Android projesine yüklendi.

## 📱 Kurulu İkonlar

Aşağıdaki boyutlarda ikonlar oluşturuldu:

| Yoğunluk | Boyut | Dosya | Konum |
|----------|-------|-------|-------|
| **mdpi** | 48x48 | ic_launcher.png | `android/app/src/main/res/mipmap-mdpi/` |
| **hdpi** | 72x72 | ic_launcher.png | `android/app/src/main/res/mipmap-hdpi/` |
| **xhdpi** | 96x96 | ic_launcher.png | `android/app/src/main/res/mipmap-xhdpi/` |
| **xxhdpi** | 144x144 | ic_launcher.png | `android/app/src/main/res/mipmap-xxhdpi/` |
| **xxxhdpi** | 192x192 | ic_launcher.png | `android/app/src/main/res/mipmap-xxxhdpi/` |

Aynı ikonlar `ic_launcher_round.png` olarak da kopyalandı (bazı Android launcher'lar için).

## 🔄 İkonları Görme

### Android Studio'da Test Edin

1. **Capacitor projesini açın:**
   ```bash
   npm run cap:open
   ```

2. **Gradle sync tamamlansın**

3. **Uygulamayı çalıştırın:**
   - Emulator veya fiziksel cihazda uygulamayı başlatın
   - Ana ekrana dönün
   - Uygulama ikonunuzu görmelisiniz!

### İkonlar Görünmüyorsa

Eğer eski Android varsayılan ikonu görünüyorsa:

1. **Clean ve Rebuild:**
   ```
   Android Studio → Build → Clean Project
   Android Studio → Build → Rebuild Project
   ```

2. **Uygulamayı kaldırıp yeniden yükleyin:**
   - Cihazdan/emulator'den uygulamayı silin
   - Tekrar çalıştırın

## 🎨 İkonları Değiştirmek İsterseniz

### Yöntem 1: Yeni Logo İle Otomatik

Eğer başka bir logo kullanmak isterseniz:

1. Yeni logonuzu `public/` klasörüne koyun
2. Bana söyleyin, tüm boyutlarda yeniden oluştururum

### Yöntem 2: Manuel Değiştirme

Kendi icon'larınızı hazırlayıp manuel olarak aşağıdaki klasörlere koyabilirsiniz:

```
Capacitor/android/app/src/main/res/
├── mipmap-mdpi/
│   ├── ic_launcher.png (48x48)
│   └── ic_launcher_round.png (48x48)
├── mipmap-hdpi/
│   ├── ic_launcher.png (72x72)
│   └── ic_launcher_round.png (72x72)
├── mipmap-xhdpi/
│   ├── ic_launcher.png (96x96)
│   └── ic_launcher_round.png (96x96)
├── mipmap-xxhdpi/
│   ├── ic_launcher.png (144x144)
│   └── ic_launcher_round.png (144x144)
└── mipmap-xxxhdpi/
    ├── ic_launcher.png (192x192)
    └── ic_launcher_round.png (192x192)
```

### Yöntem 3: Adaptive Icons (Modern Android)

Android 8.0+ için adaptive icon oluşturmak isterseniz:

1. `res/mipmap-anydpi-v26/` klasörü oluşturun
2. `ic_launcher.xml` dosyası ekleyin
3. Foreground ve background layer'ları tanımlayın

## 🔧 İkon Optimizasyonu

### İyi Bir Uygulama İkonu İçin:

- ✅ **Basit ve tanınabilir** tasarım
- ✅ **Kare format** - logonuz merkezde, padding ile
- ✅ **Yüksek kontrast** renkleri
- ✅ **Şeffaf arka plan** veya düz renk
- ❌ **Küçük yazılar** kullanmayın
- ❌ **Çok detaylı** tasarımlardan kaçının

### PNG Ayarları:

- Format: PNG-24 (alpha channel ile)
- Renk Alanı: sRGB
- Compression: En iyi kalite

## 📊 İkon Boyutları Hızlı Referans

Eğer Photoshop/Figma'da kendiniz oluşturacaksanız:

```
mdpi:    48 x 48 px  (1x baseline)
hdpi:    72 x 72 px  (1.5x)
xhdpi:   96 x 96 px  (2x)
xxhdpi:  144 x 144 px (3x)
xxxhdpi: 192 x 192 px (4x)
```

## 🎯 Sonraki Adımlar

1. ✅ İkonlar kuruldu
2. 🔄 Android Studio'da test edin
3. 📱 APK oluşturun
4. 🚀 Dağıtın!

## 💡 İpuçları

> [!TIP]
> **Splash Screen de Değiştirmek İsterseniz**
> 
> Splash screen (açılış ekranı) için de benzer şekilde yardımcı olabilirim. Logonuzla güzel bir splash screen tasarlayabiliriz.

> [!NOTE]
> **Round Icon Nedir?**
> 
> Bazı Android launcher'lar (özellikle Pixel telefonlar) yuvarlak ikonlar kullanır. `ic_launcher_round.png` bu launcher'lar için kullanılır.

## 📞 Sorun mu Var?

İkonlar görünmüyorsa veya farklı bir stil isterseniz, bana söyleyin. İkonları yeniden oluşturur veya özelleştirebilirim!
