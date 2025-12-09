export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    metaDescription: string;
    content: string;
    coverImage: string;
    date: string;
    author: {
        name: string;
        avatar: string;
    };
    category: string;
    readTime: string;
    tags: string[];
}

export const BLOG_POSTS: BlogPost[] = [
    {
        id: "23",
        slug: "glutatyon-cilt-beyazlatma-ve-bagisiklik",
        title: "Glutatyon: Cilt Beyazlatma ve Bağışıklık",
        excerpt: "Glutatyon takviyesi gerçekten cildi beyazlatır mı? Vücudun ana antioksidanı hakkında bilinenler ve bilinmeyenler.",
        metaDescription: "Glutatyon cildi beyazlatır mı? Vücudun ana antioksidanı glutatyonun bağışıklık sistemi ve cilt rengi üzerindeki etkileri hakkında bilimsel gerçekler.",
        coverImage: "/blog/glutatyon.png",
        date: "2024-12-26",
        author: {
            name: "Halil Aqwes",
            avatar: "/logo-new.png"
        },
        category: "Sağlık",
        readTime: "4 dk okuma",
        tags: ["Glutatyon", "Cilt", "Bağışıklık", "Antioksidan"],
        content: `
## Kısa Cevap: Antioksidan Etkili

Güçlü bir antioksidandır, yan etki olarak cilt rengini açabilir.

## Detaylı Açıklama

Glutatyon vücudun "çöpçüsüdür", toksinleri temizler. Tıbbi kullanımda, melanin üretimini baskıladığı için ciltte beyazlama yan etkisi görülmüştür.

Ancak oral (ağızdan) alınan hapların emilimi düşüktür; **lipozomal formlar** veya damar yolu uygulamaları biyoyararlanım açısından daha etkilidir.

&nbsp;
&nbsp;

### Bilimsel Referans

> ***Sonthalia et al. "Glutathione as a skin whitening agent: Facts, myths, evidence and controversies." Indian J Dermatol Venereol Leprol (2016).***
        `
    },
    {
        id: "22",
        slug: "aralikli-oructa-supplement-kullanimi",
        title: "Aralıklı Oruçta Supplement Kullanımı",
        excerpt: "Oruç (Fasting) yaparken hangi supplementler kullanılır? Orucu bozan ve bozmayan takviyelerin tam listesi.",
        metaDescription: "Aralıklı oruçta (IF) supplement kullanılır mı? Orucu bozan ve bozmayan takviyeler. BCAA, kreatin ve protein tozunun insüline etkisi.",
        coverImage: "/blog/aralikli-oruc.png",
        date: "2024-12-25",
        author: {
            name: "Halil Aqwes",
            avatar: "/logo-new.png"
        },
        category: "Beslenme",
        readTime: "3 dk okuma",
        tags: ["Fasting", "Oruç", "Diyet", "Beslenme"],
        content: `
## Kısa Cevap: İnsüline Dikkat

Kalorisiz olanlar serbest, diğerleri yasak.

## Detaylı Açıklama

Oruç penceresinde (yeme kapalı saatler) insülin seviyesini yükselten her şey orucu bozar.

*   **Bozar:** Whey Protein, BCAA (Lösin insülini tetikler), Gainer.
*   **Bozmaz:** Sade Kreatin, Elektrolitler, Sade Kahve/Çay.

BCAA'nın kalorisiz olduğu sanılsa da, insülin tepkisi yarattığı için oruç sürecini (otofajiyi) kesintiye uğratabilir.

&nbsp;
&nbsp;

### Bilimsel Referans

> ***Collier et al. "The effect of BCAA on insulin secretion."***
        `
    },
    {
        id: "21",
        slug: "supplementlerin-son-kullanma-tarihi-gecerse",
        title: "Supplementlerin Son Kullanma Tarihi (SKT) Geçerse?",
        excerpt: "Tarihi geçmiş protein tozu içilir mi? Supplementlerin raf ömrü ve bozulma belirtileri.",
        metaDescription: "Son kullanma tarihi geçmiş supplement kullanılır mı? Protein tozu ve kreatin bozulur mu? Raf ömrü ve gıda güvenliği rehberi.",
        coverImage: "/blog/skt.png",
        date: "2024-12-24",
        author: {
            name: "Halil Aqwes",
            avatar: "/logo-new.png"
        },
        category: "Rehber",
        readTime: "2 dk okuma",
        tags: ["SKT", "Güvenlik", "Kullanım", "Rehber"],
        content: `
## Kısa Cevap: Genellikle Güvenli

Nem almadıysa genellikle güvenlidir ancak etkisi azalır.

## Detaylı Açıklama

Toz formdaki ürünler (protein, kreatin) su aktivitesi çok düşük olduğu için bakteri üremesine dirençlidir.

SKT geçtikten sonra ürün "zehirli" olmaz ancak amino asit profili bozulabilir (potansiyel kaybı). **Renk değişimi, kötü koku veya topaklanma (taşlaşma)** varsa kesinlikle atılmalıdır.

&nbsp;
&nbsp;

### Bilimsel Referans

> ***US DoD Shelf Life Extension Program (Genel Gıda Stabilitesi Prensibi).***
        `
    },
    {
        id: "20",
        slug: "1-olcek-protein-tozu-vs-tavuk-gogsu",
        title: "1 Ölçek Protein Tozu vs Tavuk Göğsü",
        excerpt: "Protein tozu, tavuk göğsünün yerini tutar mı? Emilim hızı, biyolojik değer ve besin karşılaştırması.",
        metaDescription: "1 ölçek protein tozu mu yoksa tavuk göğsü mü? Biyolojik değer, emilim hızı ve besin değerleri açısından detaylı karşılaştırma analizi.",
        coverImage: "/blog/protein-vs-tavuk.png",
        date: "2024-12-23",
        author: {
            name: "Halil Aqwes",
            avatar: "/logo-new.png"
        },
        category: "Beslenme",
        readTime: "3 dk okuma",
        tags: ["Protein", "Tavuk", "Beslenme", "Karşılaştırma"],
        content: `
## Kısa Cevap: Eşdeğer Değil, Tamamlayıcı

1 Ölçek Whey ≈ 85-100gr Pişmiş Tavuk Göğsü.

## Detaylı Açıklama

Standart bir ölçek whey protein ortalama 24g saf protein içerir.

*   **Biyolojik Değer (BV):** Whey (104) > Tavuk (79). Whey kana çok daha hızlı karışır.
*   **Tokluk:** Tavuk göğsü katı gıda olduğu için daha uzun süre tok tutar.
*   **Mikro Besin:** Tavuk B vitaminleri ve mineraller açısından daha zengindir.

İkisi birbirinin rakibi değil, tamamlayıcısıdır. Antrenman sonrası Whey, ana öğünlerde Tavuk idealdir.

&nbsp;
&nbsp;

### Bilimsel Referans

> ***Hoffman & Falvo. "Protein - Which is Best?" J Sports Sci Med (2004).***
        `
    },
    {
        id: "19",
        slug: "anabolik-pencere-gercek-mi",
        title: "\"Anabolik Pencere\" (Spordan Hemen Sonra İçmek) Gerçek mi?",
        excerpt: "Spordan çıkar çıkmaz protein içmezseniz kaslarınız erir mi? Anabolik pencere efsanesi ve gerçekler.",
        metaDescription: "Anabolik pencere gerçek mi? Spordan hemen sonra protein içmek şart mı? Protein sentezi, kas gelişimi ve antrenman sonrası beslenme zamanlaması.",
        coverImage: "/blog/anabolik-pencere.png",
        date: "2024-12-22",
        author: {
            name: "Halil Aqwes",
            avatar: "/logo-new.png"
        },
        category: "Performans",
        readTime: "4 dk okuma",
        tags: ["Anabolik Pencere", "Beslenme", "Kas", "Zamanlama"],
        content: `
## Kısa Cevap: Acele Etmeyin

Düşünüldüğü kadar kısa (30 dk) bir süre değildir.

## Detaylı Açıklama

Eskiden spordan sonraki 30 dakika içinde protein alınmazsa antrenmanın boşa gideceği sanılırdı.

Güncel araştırmalar, bu pencerenin (antrenman öncesi beslenmeye bağlı olarak) **4-6 saate kadar** uzayabildiğini gösteriyor. Ancak toparlanmayı (recovery) hızlandırmak için antrenman sonrası **1-2 saat içinde** besin almak en ideal ve garanti yöntemdir. Soyunma odasında shake içmek zorunda değilsiniz.

&nbsp;
&nbsp;

### Bilimsel Referans

> ***Aragon & Schoenfeld. "Nutrient timing revisited: is there a post-exercise anabolic window?" JISSN (2013).***
        `
    },
    {
        id: "18",
        slug: "ashwagandha-stres-yonetimi",
        title: "Ashwagandha ve Stres Yönetimi",
        excerpt: "Doğal stres savaşçısı Ashwagandha gerçekten işe yarıyor mu? Kortizol seviyeleri ve kas gelişimi üzerindeki etkisi.",
        metaDescription: "Ashwagandha stres ve kortizolü düşürür mü? Hint ginsenginin testosteron, kas onarımı ve uyku kalitesi üzerindeki adaptojenik etkileri.",
        coverImage: "/blog/ashwagandha.png",
        date: "2024-12-21",
        author: {
            name: "Halil Aqwes",
            avatar: "/logo-new.png"
        },
        category: "Bitkisel",
        readTime: "3 dk okuma",
        tags: ["Ashwagandha", "Stres", "Kortizol", "Uyku"],
        content: `
## Kısa Cevap: Kortizolü Düşürür

Kortizolü düşürür, testosteronu dolaylı destekler.

## Detaylı Açıklama

Ashwagandha (Hint Ginsengi), bir adaptojendir. Plasebo kontrollü çalışmalarda, düzenli kullanımın serum **kortizol (stres hormonu)** seviyelerini %27'ye kadar düşürdüğü gözlemlenmiştir.

Yüksek kortizol kas yıkımına (katabolizma) neden olabilir. Stresi yönetmek, daha iyi kas onarımı, kaliteli uyku ve hormonal denge demektir.

&nbsp;
&nbsp;

### Bilimsel Referans

> ***Chandrasekhar et al. "A prospective, randomized double-blind, placebo-controlled study of safety and efficacy of... Ashwagandha root." Indian J Psychol Med (2012).***
        `
    },
    {
        id: "17",
        slug: "kolajen-takviyesi-ve-eklem-sagligi",
        title: "Kolajen Takviyesi ve Eklem Sağlığı",
        excerpt: "Ağırlık antrenmanlarının eklemlere verdiği yükü hafifletmek mümkün mü? Kolajen tip 2 ve eklem ağrıları.",
        metaDescription: "Kolajen takviyesi eklem ağrılarına iyi gelir mi? Tip 2 kolajen, kıkırdak sağlığı ve sporcularda sakatlık önleme üzerine bilimsel çalışmalar.",
        coverImage: "/blog/kolajen.png",
        date: "2024-12-20",
        author: {
            name: "Halil Aqwes",
            avatar: "/logo-new.png"
        },
        category: "Sağlık",
        readTime: "4 dk okuma",
        tags: ["Kolajen", "Eklem", "Sakatlık", "Sağlık"],
        content: `
## Kısa Cevap: Eklemleri Destekler

Eklem ağrılarını azaltmada etkilidir.

## Detaylı Açıklama

Özellikle **Tip 2 kolajen**, kıkırdak dokusunu destekler.

24 haftalık bir çalışmada, kolajen hidrolizatı kullanan sporcuların eklem ağrılarında belirgin azalma görülmüştür. Kolajenin vücutta emilimi ve sentezi için **C vitamini** ile birlikte alınması kritik önem taşır.

&nbsp;
&nbsp;

### Bilimsel Referans

> ***Clark et al. "24-Week study on the use of collagen hydrolysate as a dietary supplement in athletes with activity-related joint pain." Current Medical Research and Opinion (2008).***
        `
    },
    {
        id: "16",
        slug: "omega-3-balik-yagi-kilo-aldiri-mi",
        title: "Omega-3 (Balık Yağı) Kilo Aldırır mı?",
        excerpt: "Yağ tüketmek kilo aldırır mı? Omega-3 yağ asitlerinin metabolizma ve yağ yakımı üzerindeki şaşırtıcı etkileri.",
        metaDescription: "Omega-3 balık yağı kilo aldırır mı? EPA ve DHA yağ asitlerinin metabolizma hızı, yağ yakımı ve insülin duyarlılığı üzerindeki olumlu etkileri.",
        coverImage: "/blog/omega3.png",
        date: "2024-12-19",
        author: {
            name: "Halil Aqwes",
            avatar: "/logo-new.png"
        },
        category: "Vitaminler",
        readTime: "3 dk okuma",
        tags: ["Omega-3", "Balık Yağı", "Metabolizma", "Sağlık"],
        content: `
## Kısa Cevap: Hayır

Hayır, aksine metabolizmayı düzenler.

## Detaylı Açıklama

Omega-3 yağ asitleri (EPA ve DHA), vücuttaki enflamasyonu (ödemi) azaltır ve **insülin duyarlılığını** artırır.

Bu durum, yediğiniz yemeklerin yağ olarak depolanmak yerine enerji olarak kullanılmasını teşvik eder. Kalori değeri olsa da, metabolik etkileri sayesinde kilo aldırma riski yoktur, aksine yağ yakım sürecini destekler.

&nbsp;
&nbsp;

### Bilimsel Referans

> ***Noreen et al. "Effects of supplemental fish oil on resting metabolic rate, body composition, and salivary cortisol in healthy adults." JISSN (2010).***
        `
    },
    {
        id: "15",
        slug: "magnezyum-sitrat-mi-glisinat-mi",
        title: "Magnezyum Sitrat mı, Glisinat mı?",
        excerpt: "Hangi magnezyum formunu kullanmalısın? Uyku sorunları, kas krampları ve anksiyete için doğru tercih.",
        metaDescription: "Magnezyum Sitrat mı Glisinat mı kullanmalısınız? Uyku, anksiyete veya kas krampları için hangi magnezyum formu tercih edilmeli?",
        coverImage: "/blog/magnezyum.png",
        date: "2024-12-18",
        author: {
            name: "Halil Aqwes",
            avatar: "/logo-new.png"
        },
        category: "Vitaminler",
        readTime: "4 dk okuma",
        tags: ["Magnezyum", "Uyku", "Kramp", "Mineral"],
        content: `
## Kısa Cevap: Amaca Göre Değişir

Amaca göre değişir; uyku için Glisinat, kas ağrısı için Sitrat/Malat.

## Detaylı Açıklama

Magnezyumun biyoyararlanımı formuna göre değişir:

*   **Bisglisinat (Glisinat):** Beyin bariyerini geçer, anksiyete ve uykusuzluğa iyi gelir. Sakinleştirir.
*   **Sitrat:** Kasa hızlı karışır, krampları önler. Enerji metabolizmasını destekler.
*   **Oksit:** Emilimi çok düşüktür (%4), genellikle tavsiye edilmez.

&nbsp;
&nbsp;

### Bilimsel Referans

> ***Walker et al. "Bioavailability of Mg diglycinate vs Mg oxide in patients with ileal resection." JPEN (1994).***
        `
    },
    {
        id: "14",
        slug: "d-vitamini-eksikligi-ve-kas-gelisimi",
        title: "D Vitamini Eksikliği ve Kas Gelişimi",
        excerpt: "Güneş eksikliği kas gelişimini durdurabilir mi? D vitamininin testosteron ve performans üzerindeki gizli etkisi.",
        metaDescription: "D vitamini eksikliği kas gelişimini durdurur mu? Testosteron seviyeleri, patlayıcı güç ve D vitamini arasındaki bilimsel bağlantı.",
        coverImage: "/blog/d-vitamini.png",
        date: "2024-12-17",
        author: {
            name: "Halil Aqwes",
            avatar: "/logo-new.png"
        },
        category: "Vitaminler",
        readTime: "3 dk okuma",
        tags: ["D Vitamini", "Testosteron", "Kas", "Sağlık"],
        content: `
## Kısa Cevap: Düşük Vitamin D = Düşük Performans

D vitamini eksikliği, testosteron düşüklüğüne neden olabilir.

## Detaylı Açıklama

D vitamini aslında bir **steroid hormondur**. Reseptörleri kas dokusunda bulunur.

Araştırmalar, D vitamini seviyesi normal olan sporcuların, eksikliği olanlara göre daha fazla **patlayıcı güce** sahip olduğunu göstermektedir. Türkiye'de nüfusun büyük bölümünde eksiklik görülür, bu nedenle kan testi yaptırıp eksikse takviye almak çok kritiktir.

&nbsp;
&nbsp;

### Bilimsel Referans

> ***Dahlquist et al. "Plausible ergogenic effects of vitamin D on athletic performance and recovery." JISSN (2015).***
        `
    },
    {
        id: "13",
        slug: "cla-takviyesi-ise-yariyor-mu",
        title: "CLA Takviyesi İşe Yarıyor mu?",
        excerpt: "Mucize zayıflama hapı olarak pazarlanan CLA gerçekten etkili mi? Bilimsel araştırmalar bu konuda ne söylüyor?",
        metaDescription: "CLA takviyesi işe yarıyor mu? Konjuge Linoleik Asit (CLA) ile ilgili insan ve hayvan deneyleri. Yağ yakımında CLA efsanesi ve bilimsel gerçekler.",
        coverImage: "/blog/cla.png",
        date: "2024-12-16",
        author: {
            name: "Halil Aqwes",
            avatar: "/logo-new.png"
        },
        category: "Beslenme",
        readTime: "3 dk okuma",
        tags: ["CLA", "Yağ Yakımı", "Diyet", "Bilim"],
        content: `
## Kısa Cevap: Etkisi Çok Sınırlı

Etkisi çok sınırlıdır ve tartışmalıdır.

## Detaylı Açıklama

Konjuge Linoleik Asit (CLA) üzerine yapılan çalışmalar çelişkilidir. Hayvan deneylerinde ciddi yağ yakımı görülse de, **insan deneylerinde bu etki minimal düzeydedir.**

"Mucize zayıflama hapı" olarak pazarlansa da bilimsel konsensüs, diyetin ve egzersizin yerini tutamayacağı yönündedir. Yüksek maliyetine kıyasla sağladığı fayda düşüktür.

&nbsp;
&nbsp;

### Bilimsel Referans

> ***Whigham et al. "Efficacy of conjugated linoleic acid for reducing fat mass: a meta-analysis in humans." AJCN (2007).***
        `
    },
    {
        id: "12",
        slug: "zma-boy-uzatir-mi",
        title: "ZMA (Çinko-Magnezyum) Boy Uzatır mı?",
        excerpt: "Ergenlik döneminde ZMA kullanımı boy uzamasını etkiler mi? Büyüme hormonu ve uyku kalitesi üzerindeki etkileri.",
        metaDescription: "ZMA boy uzatır mı? Çinko ve magnezyum takviyesinin ergenlik döneminde büyüme hormonu ve uyku kalitesi üzerindeki etkileri.",
        coverImage: "/blog/zma.png",
        date: "2024-12-15",
        author: {
            name: "Halil Aqwes",
            avatar: "/logo-new.png"
        },
        category: "Vitaminler",
        readTime: "3 dk okuma",
        tags: ["ZMA", "Boy Uzama", "Vitamin", "Uyku"],
        content: `
## Kısa Cevap: Doğrudan Değil

Doğrudan boy uzatmaz ancak büyüme hormonunu destekler.

## Detaylı Açıklama

ZMA, uyku kalitesini artırarak vücudun gece daha verimli **"REM Uykusu"na** geçmesini sağlar. Büyüme hormonu (GH) en çok bu evrede salgılanır.

Ergenlik çağındaki bireylerde eksik mineralleri (Çinko ve Magnezyum) tamamlayarak genetik potansiyelin en üst seviyesine çıkılmasına yardımcı olabilir. Ancak genetik sınırın ötesinde bir uzama sağlamaz.

&nbsp;
&nbsp;

### Bilimsel Referans

> ***Brilla & Conte. "Effects of a Novel Zinc-Magnesium Formulation on Hormones and Strength." Journal of Exercise Physiology (2000).***
        `
    },
    {
        id: "11",
        slug: "gainer-sadece-gobek-mi-yapar",
        title: "Gainer (Kilo Aldırıcı) Sadece Göbek mi Yapar?",
        excerpt: "Kilo alma tozları yağlanma yapar mı? Gainer kullanırken dikkat edilmesi gerekenler ve doğru kullanım stratejileri.",
        metaDescription: "Gainer (kilo aldırıcı) sadece göbek mi yapar? Kilo alma tozlarının doğru kullanımı, insülin hassasiyeti ve temiz büyüme (bulk) için ipuçları.",
        coverImage: "/blog/gainer.png",
        date: "2024-12-14",
        author: {
            name: "Halil Aqwes",
            avatar: "/logo-new.png"
        },
        category: "Beslenme",
        readTime: "4 dk okuma",
        tags: ["Gainer", "Kilo Alma", "Bulk", "Beslenme"],
        content: `
## Kısa Cevap: Yanlış Kullanımda Evet

Yanlış kullanımda evet, yağlanmaya sebep olabilir.

## Detaylı Açıklama

Gainerlar yoğun kalori kaynaklarıdır (karbonhidrat ağırlıklıdır). Eğer antrenman şiddetiniz aldığınız ekstra kaloriyi kasa çevirecek kadar yüksek değilse, vücut bu enerjiyi yağ (genellikle viseral yağ/göbek) olarak depolar.

*   Hareketsiz günlerde porsiyonu azaltın.
*   Şeker oranı düşük, kompleks karbonhidrat içeren ürünleri tercih edin.
*   İnsülin hassasiyetini korumak önemlidir.

&nbsp;
&nbsp;

### Bilimsel Referans

> ***Kreider et al. "ISSN exercise & sports nutrition review update: research & recommendations." (2010).***
        `
    },
    {
        id: "10",
        slug: "pre-workout-kalbe-zararli-mi",
        title: "Pre-Workout (Antrenman Öncesi) Kalbe Zararlı mı?",
        excerpt: "Antrenman öncesi kullanılan takviyeler çarpıntı yapar mı? Güvenli kafein limitleri ve risk grupleri.",
        metaDescription: "Pre-workout kalbe zarar verir mi? Yüksek kafein ve uyarıcı içeren antrenman öncesi takviyelerin kalp sağlığı ve ritim bozukluğu üzerindeki riskleri.",
        coverImage: "/blog/preworkout-kalp.png",
        date: "2024-12-13",
        author: {
            name: "Halil Aqwes",
            avatar: "/logo-new.png"
        },
        category: "Pre-Workout",
        readTime: "3 dk okuma",
        tags: ["Pre-Workout", "Kalp Sağlığı", "Kafein", "Güvenlik"],
        content: `
## Kısa Cevap: Doza Bağlı Risk

Yüksek doz kafein hassasiyeti olanlarda çarpıntı yapabilir.

## Detaylı Açıklama

Pre-workout ürünleri yüksek kafein ve uyarıcı içerir. FDA ve sağlık otoriteleri günlük **400mg kafein** alımını güvenli sınır olarak belirler.

Bu sınır aşıldığında veya ürün bilinçsiz kullanıldığında taşikardi (çarpıntı) riski oluşur. Özellikle kalp rahatsızlığı, ritim bozukluğu veya tansiyon problemi olanlar mutlaka doktora danışmalıdır.

&nbsp;
&nbsp;

### Bilimsel Referans

> ***Eudy et al. "Efficacy and safety of ingredients found in pre-workout supplements." American Journal of Health-System Pharmacy (2013).***
        `
    },
    {
        id: "9",
        slug: "l-carnitine-yag-yakar-mi",
        title: "L-Carnitine (Karnitin) Gerçekten Yağ Yakar mı?",
        excerpt: "L-Carnitine takviyesi zayıflatır mı? Yağ yakımı sürecindeki rolü ve en etkili kullanım şekli.",
        metaDescription: "L-Carnitine gerçekten yağ yakar mı? Karnitin takviyesinin zayıflama ve performans üzerindeki etkileri. Obezite ve sporculardaki meta-analiz sonuçları.",
        coverImage: "/blog/l-carnitine.png",
        date: "2024-12-12",
        author: {
            name: "Halil Aqwes",
            avatar: "/logo-new.png"
        },
        category: "Performans",
        readTime: "4 dk okuma",
        tags: ["Karnitin", "Yağ Yakımı", "Kardiyo", "Performans"],
        content: `
## Kısa Cevap: Tek Başına Zayıflatmaz

Tek başına zayıflatmaz, egzersizle desteklenmelidir.

## Detaylı Açıklama

L-Carnitine, yağ asitlerini enerjiye dönüşmek üzere mitokondriye taşır. Ancak bir **kalori açığı ve düzenli kardiyo** yoksa bu taşıma işlemi zayıflama sağlamaz (taşınan yağlar yakılmazsa geri depolanır).

Yapılan meta-analizler, L-Carnitine'in obez veya yaşlı bireylerde yağ kaybında daha etkili olduğunu, genç sporcularda ise daha çok **performans artışı** sağladığını göstermektedir.

&nbsp;
&nbsp;

### Bilimsel Referans

> ***Pooyandjoo et al. "The effect of (L-)carnitine on weight loss in adults: a systematic review and meta-analysis of randomized controlled trials." Obesity Reviews (2016).***
        `
    },
    {
        id: "8",
        slug: "kadinlar-protein-tozu-kullanirsa-kaslanir-mi",
        title: "Kadınlar Protein Tozu Kullanırsa Kaslanır mı?",
        excerpt: "Protein tozu kullanan kadınlar erkek gibi kaslanır mı? Hormonal gerçekler ve protein tozunun kadın fizyolojisindeki yeri.",
        metaDescription: "Kadınlar protein tozu kullanırsa erkek gibi kaslanır mı? Kadın fizyolojisi, testosteron seviyeleri ve protein tozu kullanımı hakkında bilimsel gerçekler.",
        coverImage: "/blog/kadinlar-protein.png",
        date: "2024-12-11",
        author: {
            name: "Halil Aqwes",
            avatar: "/logo-new.png"
        },
        category: "Beslenme",
        readTime: "3 dk okuma",
        tags: ["Kadın", "Protein", "Kas", "Beslenme"],
        content: `
## Kısa Cevap: Hayır

Hayır, erkek tipi kaslanma olmaz.

## Detaylı Açıklama

Kadınların testosteron seviyesi erkeklere göre çok düşüktür (yaklaşık 1/15'i kadar). Bu nedenle doğal yollarla devasa kas kütlesine ulaşmak kadınlar için fizyolojik olarak çok zordur.

Protein tozu hormon içermez, sadece kasların onarımı için gerekli amino asitleri sağlar. Kadınların protein tozu kullanması;
*   **Sıkılaşmaya**,
*   **Yağ yakımının hızlanmasına**,
*   Ve daha **estetik, fit bir görünüm** elde etmelerine yardımcı olur.

Korkulan "erkek gibi olma" durumu, ancak dışarıdan hormon takviyesi (steroid) alınırsa mümkündür. Protein tozu sadece besindir.

&nbsp;
&nbsp;

### Bilimsel Referans

> ***Campbell et al. "International Society of Sports Nutrition position stand: women and nutrition." (2023).***
        `
    },
    {
        id: "7",
        slug: "bcaa-mi-eaa-mi-hangisi-daha-etkili",
        title: "BCAA mı Yoksa EAA mı? Hangisi Daha Etkili?",
        excerpt: "Kas gelişimi için hangi amino asit takviyesi daha üstün? Bilimsel veriler ışığında BCAA ve EAA karşılaştırması.",
        metaDescription: "BCAA mı EAA mı daha etkili? Kas protein sentezi (MPS) için gerekli 9 esansiyel amino asit ve bilimsel karşılaştırma raporu.",
        coverImage: "/blog/bcaa-vs-eaa.png",
        date: "2024-12-10",
        author: {
            name: "Halil Aqwes",
            avatar: "/logo-new.png"
        },
        category: "Performans",
        readTime: "4 dk okuma",
        tags: ["BCAA", "EAA", "Amino Asit", "Kas Gelişimi"],
        content: `
## Kısa Cevap: EAA Daha Üstündür

EAA (Esansiyel Amino Asitler) kas sentezi için BCAA'dan daha etkilidir.

## Detaylı Karşılaştırma

**BCAA**, sadece 3 amino asidi (Lösin, İzolösin, Valin) içerirken; **EAA**, vücudun üretemediği ve dışarıdan alması gereken 9 temel amino asidin tamamını barındırır.

Bilimsel veriler, kas protein sentezinin (MPS) tam kapasiteyle çalışması için 9 amino asidin tamamının ortamda bulunması gerektiğini gösterir. BCAA tek başına alındığında, diğer 6 esansiyel amino asit eksik kalacağı için protein sentezi sınırlı kalabilir. Bu nedenle EAA, kas onarımı ve gelişimi için daha kapsamlı bir seçenektir.

&nbsp;
&nbsp;

### Bilimsel Referans

> ***Wolfe RR. "Branched-chain amino acids and muscle protein synthesis in humans: myth or reality?" Journal of the International Society of Sports Nutrition (2017).***
        `
    },
    {
        id: "6",
        slug: "kreatin-yuklemesi-yapmak-sart-mi",
        title: "Kreatin Yüklemesi Yapmak Şart mı?",
        excerpt: "Kreatin kullanırken yükleme evresi gerekli mi yoksa günlük standart kullanım yeterli mi? En doğru kullanım stratejisi.",
        metaDescription: "Kreatin yüklemesi gerekli mi? Günlük 5gr kullanım vs yükleme dönemi. Kas depolarını doldurmak için en etkili ve bilimsel kullanım stratejisi.",
        coverImage: "/blog/kreatin-yukleme.png",
        date: "2024-12-09",
        author: {
            name: "Halil Aqwes",
            avatar: "/logo-new.png"
        },
        category: "Kreatin",
        readTime: "3 dk okuma",
        tags: ["Kreatin", "Kullanım", "Yükleme", "Bilim"],
        content: `
## Kısa Cevap: Hayır

Günlük düzenli kullanım yeterlidir.

## Detaylı Açıklama

Yükleme aşaması (ilk hafta günde 20gr) kaslardaki kreatin depolarını daha hızlı doldurur ancak şişkinlik ve sindirim sorunlarına yol açabilir.

Bunun yerine günde **3-5 gram düzenli alım**, 3-4 hafta içinde depoları aynı seviyeye getirir. Sabırlı olmak, yan etkilerden kaçınmak için daha iyi bir stratejidir.

&nbsp;
&nbsp;

### Bilimsel Referans

> ***Hultman E, et al. "Muscle creatine loading in men." Journal of Applied Physiology (1996).***
        `
    },
    {
        id: "5",
        slug: "kreatin-sac-dokulmesi-yapar-mi",
        title: "Kreatin Saç Dökülmesi Yapar mı? (DHT İlişkisi)",
        excerpt: "Kreatin takviyesi ve saç dökülmesi arasındaki ilişki hakkında bilimsel gerçekler ve 2009 araştırmasının analizi.",
        metaDescription: "Kreatin saç döker mi? DHT seviyeleri ve kellik arasındaki ilişkiyi inceleyen 2021 bilimsel araştırmalarıyla kreatin ve saç dökülmesi gerçeği.",
        coverImage: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&q=80&w=1000",
        date: "2024-12-08",
        author: {
            name: "Halil Aqwes",
            avatar: "/logo-new.png"
        },
        category: "Kreatin",
        readTime: "4 dk okuma",
        tags: ["Kreatin", "Saç Dökülmesi", "DHT", "Bilim"],
        content: `
## Kısa Cevap: Kanıt Yok

Doğrudan saç döktüğüne dair kesin bir bilimsel kanıt yoktur.

## Detaylı Analiz: DHT ve Saç İlişkisi

Bu yaygın endişe, **2009 yılında ragbi oyuncuları üzerinde yapılan tek bir çalışmaya** dayanır. Bu çalışmada, kreatin kullanan sporcuların DHT (dihidrotestosteron) seviyelerinde artış görülmüş ancak **saç kaybı ölçülmemiştir.**

O tarihten bu yana yapılan onlarca güncel çalışmada, kreatinin doğrudan kellik yarattığı doğrulanmamıştır. Genetik yatkınlığınız (erkek tipi kellik geçmişi) yoksa kreatin saçlarınızı dökmez. Mevcut genetik dökülme sürecinizi hızlandırıp hızlandırmadığı ise bilimsel olarak hala tartışmalıdır, ancak doğrudan bir sebep değildir.

&nbsp;
&nbsp;

### Bilimsel Referans

> ***Antonio et al. "Common questions and misconceptions about creatine supplementation: what does the scientific evidence really show?" Journal of the International Society of Sports Nutrition (2021).***
        `
    },
    {
        id: "4",
        slug: "protein-tozu-bobreklere-zarar-verir-mi",
        title: "Protein Tozu (Whey) Böbreklere Zarar Verir mi?",
        excerpt: "Protein tozu kullanımının böbrek sağlığı üzerindeki etkileri hakkında bilimsel gerçekler ve yaygın efsaneler.",
        metaDescription: "Protein tozu böbreklere zarar verir mi? ISSN araştırmaları ve bilimsel gerçeklerle protein tozunun sağlıklı bireylerdeki böbrek etkilerini inceledik.",
        coverImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1000",
        date: "2024-12-07",
        author: {
            name: "Halil Aqwes",
            avatar: "/logo-new.png"
        },
        category: "Sağlık",
        readTime: "3 dk okuma",
        tags: ["Protein", "Böbrek", "Sağlık", "Bilim"],
        content: `
## Kısa Cevap: Hayır

Sağlıklı bireylerde protein tozu kullanımı böbrek hasarına yol açmaz.

## Detaylı Açıklama

Protein tozu, peynir altı suyundan izole edilen doğal bir gıda takviyesidir. Yaygın efsanenin aksine, **International Society of Sports Nutrition (ISSN)** tarafından yapılan kapsamlı incelemelerde, yüksek protein alımının sağlıklı böbrek fonksiyonuna sahip bireylerde herhangi bir negatif etkisi olmadığı kanıtlanmıştır.

Ancak, halihazırda böbrek rahatsızlığı (kronik böbrek yetmezliği vb.) olan bireylerin, protein alımlarını sınırlandırmaları gerekebileceği için doktor kontrolünde kullanması önerilir.

&nbsp;
&nbsp;

### Bilimsel Referans

> ***Jäger et al. "International Society of Sports Nutrition Position Stand: Protein and exercise." Journal of the International Society of Sports Nutrition (2017).***
        `
    },
    {
        id: "1",
        slug: "en-iyi-whey-protein-hangisi",
        title: "2025 Rehberi: En İyi Whey Protein Nasıl Seçilir?",
        excerpt: "Piyasada yüzlerce seçenek arasından sizin için en doğru whey proteini seçmenize yardımcı olacak kapsamlı rehber.",
        metaDescription: "2025'in en iyi whey protein tozu hangisi? İzole vs konsantre farkı, hammadde kalitesi ve fiyat performans analiziyle seçim rehberi.",
        coverImage: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&q=80&w=1000",
        date: "2024-12-07",
        author: {
            name: "Halil Aqwes",
            avatar: "/logo-new.png" // Using logo as admin avatar for now
        },
        category: "Protein Tozu",
        readTime: "6 dk okuma",
        tags: ["Protein", "Supplement", "Rehber"],
        content: `
## Whey Protein Nedir?

Whey protein, peynir altı suyundan elde edilen, yüksek biyoyararlanıma sahip bir protein kaynağıdır. Kas gelişimi ve onarımı için en etkili takviyelerden biri olarak kabul edilir.

### İzole vs Konsantre: Hangisini Seçmeli?

**Konsantre Whey (WPC):** Genellikle %70-80 oranında protein içerir. Laktoz ve yağ oranı biraz daha yüksektir ancak fiyat/performans açısından çok tercih edilir.

**İzole Whey (WPI):** %90 ve üzeri protein oranına sahiptir. Yağ ve laktoz neredeyse sıfırdır. Özellikle diyet dönemindekiler ve laktoz hassasiyeti olanlar için idealdir.

### Seçim Yaparken Dikkat Edilmesi Gerekenler

1. **Protein Oranı:** Servis başına düşen protein miktarı.
2. **Amino Asit Profili:** BCAA ve EAA oranları.
3. **Tat ve Karışabilirlik:** İçim kolaylığı.
4. **Fiyat/Performans:** Gram protein başına maliyet.

## Sonuç

Hedefinize ve bütçenize uygun proteini seçmek uzun vadede alacağınız verimi artıracaktır.
        `
    },
    {
        id: "2",
        slug: "kreatin-ne-ise-yarar",
        title: "Kreatin Monohidrat: Bilimsel Olarak Kanıtlanmış Faydaları",
        excerpt: "Güç artışı ve kas kütlesi kazanımı için en çok araştırılan supplement olan kreatin hakkında her şey.",
        metaDescription: "Kreatin monohidrat ne işe yarar? Patlayıcı güç, kas kütlesi artışı ve beyin fonksiyonları üzerindeki bilimsel olarak kanıtlanmış 3 ana faydası.",
        coverImage: "https://images.unsplash.com/photo-1594882645126-14020914d58d?auto=format&fit=crop&q=80&w=1000",
        date: "2025-11-28",
        author: {
            name: "SuppLabs Editör",
            avatar: "/logo-new.png"
        },
        category: "Performans",
        readTime: "4 dk okuma",
        tags: ["Kreatin", "Güç", "Bilim"],
        content: `
## Kreatin Nedir?

Kreatin, vücutta doğal olarak bulunan ve enerji üretiminde (ATP) kritik rol oynayan bir bileşiktir.

### Faydaları Nelerdir?

*   **Güç Artışı:** Patlayıcı güç gerektiren antrenmanlarda performansı artırır.
*   **Kas Kütlesi:** Su tutumu ve protein sentezini destekleyerek kas hacmini artırır.
*   **Beyin Fonksiyonları:** Bilişsel performansa olumlu etkileri olduğuna dair araştırmalar mevcuttur.

## Nasıl Kullanılır?

Günlük 3-5 gram kreatin monohidrat kullanımı çoğu sporcu için yeterlidir. "Yükleme" dönemi yapmak zorunlu değildir.
        `
    },
    {
        id: "3",
        slug: "pre-workout-gerekli-mi",
        title: "Antrenman Öncesi Takviyeler (Pre-Workout) Gerekli mi?",
        excerpt: "Kafein, Arjinin ve Beta-Alanin... Pre-workout ürünlerinin içindeki maddeler ne işe yarar?",
        metaDescription: "Pre-workout gerekli mi? İçeriğindeki kafein, beta-alanin ve arjinin ne işe yarar? Antrenman performansına etkileri ve kullanım tavsiyeleri.",
        coverImage: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=1000",
        date: "2024-11-15",
        author: {
            name: "Dr. Fit",
            avatar: "/logo-new.png"
        },
        category: "Pre-Workout",
        readTime: "5 dk okuma",
        tags: ["Enerji", "Odak", "Pre-Workout"],
        content: `
## Pre-Workout İçeriği

Çoğu pre-workout ürünü şu ana maddeleri içerir:

1.  **Kafein:** Enerji ve odaklanma sağlar.
2.  **Beta-Alanin:** Kas yorgunluğunu geciktirir (karıncalanma hissi veren maddedir).
3.  **L-Citrulline / Arjinin:** Kan akışını artırarak "pump" etkisini destekler.

### Kimler Kullanmalı?

Yorgun hissediyorsanız veya antrenman yoğunluğunuzu artırmak istiyorsanız pre-workout ürünleri faydalı olabilir. Ancak her antrenman öncesi kullanmak yerine, zorlu günlerde tercih etmek tolerans gelişimini önler.
        `
    }
];

export const CATEGORIES = [
    "Tümü",
    "Protein Tozu",
    "Kreatin",
    "Performans",
    "Pre-Workout",
    "Vitaminler",
    "Beslenme",
    "Sağlık",
    "Bitkisel",
    "Rehber"
];
