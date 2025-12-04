import React from 'react';

export default function LegalPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
            <h1 className="text-3xl font-bold mb-8 text-center">Yasal Bilgilendirme</h1>

            <div className="space-y-12">
                {/* Section 1: Legal Warning */}
                <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h2 className="text-xl font-bold mb-4 text-red-600">1. YASAL UYARI VE SAĞLIK BEYANI</h2>

                    <div className="space-y-4 text-gray-700">
                        <div>
                            <h3 className="font-semibold text-black mb-1">1. Tıbbi Tavsiye Değildir</h3>
                            <p>
                                Supplabs.com (bundan böyle "Site" olarak anılacaktır) üzerinde yer alan blog yazıları, ürün incelemeleri,
                                kullanıcı yorumları ve tüm içerikler yalnızca genel bilgilendirme ve paylaşım amacı taşımaktadır.
                                Sitedeki hiçbir içerik, doktor veya eczacı tavsiyesi yerine geçmez. Sitede adı geçen hiçbir ürün,
                                hastalıkların önlenmesi veya tedavi edilmesi amacıyla kullanılamaz.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-black mb-1">2. Takviye Edici Gıda Uyarısı</h3>
                            <p>
                                Sitede bahsi geçen ürünler "Takviye Edici Gıda" statüsündedir ve ilaç değildir. Herhangi bir sağlık sorununuz,
                                düzenli ilaç kullanımınız, hamilelik veya emzirme durumunuz varsa, bu ürünleri kullanmadan veya beslenme
                                düzeninizi değiştirmeden önce mutlaka uzman bir hekime danışınız.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-black mb-1">3. İçerik Sorumluluğu</h3>
                            <p>
                                Supplabs, sitede yer alan bilgilerin güncelliği ve doğruluğu konusunda azami özeni gösterse de,
                                üretici firmaların ürün içeriklerinde yaptığı değişikliklerden veya kullanıcıların kişisel deneyimlerine
                                dayalı beyanlarından sorumlu tutulamaz.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Section 2: User Agreement */}
                <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h2 className="text-xl font-bold mb-4">2. KULLANICI SÖZLEŞMESİ</h2>
                    <p className="text-sm text-gray-500 mb-4">
                        Kullanıcıların siteye üye olurken "Okudum, kabul ediyorum" kutucuğunu işaretleyeceği metindir.
                    </p>

                    <div className="space-y-4 text-gray-700">
                        <p><strong>SUPPLABS KULLANICI SÖZLEŞMESİ</strong></p>

                        <div>
                            <h3 className="font-semibold text-black mb-1">1. TARAFLAR</h3>
                            <p>İşbu sözleşme, Supplabs (Site) ile siteye üye olan kullanıcı (Üye) arasında akdedilmiştir.</p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-black mb-1">2. KONU</h3>
                            <p>
                                İşbu sözleşmenin konusu, Üye'nin Site'yi kullanımı, içerik paylaşımı ve tarafların hak ve yükümlülüklerinin
                                belirlenmesidir. Site üzerinden herhangi bir ürün satışı yapılmamaktadır.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-black mb-1">3. ÜYENİN YÜKÜMLÜLÜKLERİ</h3>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>3.1. Üye, Site üzerinde paylaştığı her türlü yorum, görsel ve içerikten bizzat sorumludur.</li>
                                <li>3.2. Üye, Türkiye Cumhuriyeti yasalarına, genel ahlak kurallarına aykırı, üçüncü şahısların telif haklarını ihlal eden veya yanıltıcı sağlık beyanı içeren (örn: "Bu ürün kansere kesin çözüm" gibi) paylaşımlar yapamaz.</li>
                                <li>3.3. Supplabs, 5651 sayılı kanun gereği "Yer Sağlayıcı" konumundadır. Üyelerin oluşturduğu içerikleri önceden denetleme yükümlülüğü yoktur; ancak şikayet üzerine hukuka aykırı içerikleri yayından kaldırma hakkını saklı tutar.</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-black mb-1">4. GİZLİLİK</h3>
                            <p>Üye'nin siteye kaydolurken verdiği bilgiler, Kişisel Verilerin Korunması Politikamız çerçevesinde saklı tutulacaktır.</p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-black mb-1">5. SÖZLEŞMENİN FESHİ</h3>
                            <p>Supplabs, işbu sözleşmeye aykırı hareket eden, spam yapan veya hakaret içeren paylaşımlarda bulunan üyelerin hesaplarını tek taraflı olarak askıya alma veya silme hakkına sahiptir.</p>
                        </div>
                    </div>
                </section>

                {/* Section 3: KVKK */}
                <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h2 className="text-xl font-bold mb-4">3. KVKK AYDINLATMA METNİ</h2>

                    <div className="space-y-4 text-gray-700">
                        <p><strong>KİŞİSEL VERİLERİN KORUNMASI HAKKINDA AYDINLATMA METNİ</strong></p>
                        <p>
                            Supplabs olarak kişisel verilerinizin güvenliğine önem veriyoruz. 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) kapsamında;
                        </p>

                        <div>
                            <h3 className="font-semibold text-black mb-1">1. Hangi Verileri İşliyoruz?</h3>
                            <p>Sitemize üye olmanız durumunda; Ad-Soyad, E-posta adresi, Kullanıcı Adı ve işlem güvenliği için IP adresi bilgileriniz işlenmektedir.</p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-black mb-1">2. İşleme Amacımız Nedir?</h3>
                            <p>Verileriniz; üyelik işlemlerinin gerçekleştirilmesi, sizlerle iletişim kurulması, site güvenliğinin sağlanması ve yasal yükümlülüklerin (5651 sayılı kanun gereği log tutma) yerine getirilmesi amacıyla işlenmektedir.</p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-black mb-1">3. Veri Aktarımı</h3>
                            <p>Kişisel verileriniz, yasal zorunluluklar (savcılık vb. talepleri) dışında üçüncü kişilerle veya pazarlama şirketleriyle paylaşılmamaktadır.</p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-black mb-1">4. Haklarınız</h3>
                            <p>KVKK’nın 11. maddesi gereği [supplementdoktorum@gmail.com] adresine başvurarak verilerinizin silinmesini veya düzeltilmesini talep etme hakkına sahipsiniz.</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
