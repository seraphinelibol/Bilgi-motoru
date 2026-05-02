"use client";
// Next.js App Router → "use client" | Vite/CRA → bu satırı sil
import { useState, useEffect, useRef, useMemo, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════
   § PALESTİN GRADYANLARI — her tıklamada değişir
   ═══════════════════════════════════════════════════════════════════ */
const PAL_G = [
  "linear-gradient(135deg,#CE1126 0%,#1a0303 30%,#000 55%,#002a0d 75%,#009736 100%)",
  "radial-gradient(ellipse at 20% 80%,#CE1126 0%,#1a0000 30%,#000 55%,#009736 100%)",
  "linear-gradient(to right,#009736 0%,#003d15 25%,#000 50%,#5a0010 75%,#CE1126 100%)",
  "radial-gradient(circle at 75% 25%,#CE1126 0%,#000 40%,#003d15 75%,#009736 100%)",
  "linear-gradient(160deg,#000 0%,#7a0010 35%,#CE1126 55%,#003d15 80%,#009736 100%)",
  "linear-gradient(180deg,#CE1126 0%,#8a0010 20%,#000 45%,#002a0d 70%,#009736 100%)",
  "radial-gradient(ellipse at 55% 45%,#009736 0%,#002a0d 30%,#000 55%,#CE1126 100%)",
  "linear-gradient(225deg,#009736 0%,#000 40%,#CE1126 100%)",
  "radial-gradient(circle at 30% 60%,#CE1126 0%,#5a0010 25%,#000 50%,#009736 100%)",
  "linear-gradient(90deg,#CE1126 0%,#000 33%,#000 66%,#009736 100%)",
  "radial-gradient(ellipse at 90% 10%,#009736 0%,#000 45%,#CE1126 100%)",
  "conic-gradient(from 45deg at 50% 50%,#CE1126 0deg,#000 90deg,#009736 180deg,#000 270deg,#CE1126 360deg)",
];

/* ═══════════════════════════════════════════════════════════════════
   § TEMA — surfaces yarı saydam → gradyan arka planda görünür
   ═══════════════════════════════════════════════════════════════════ */
const THEME = {
  dark: {
    "--surface":   "rgba(10,15,28,0.88)","--surface2":"rgba(14,21,38,0.91)",
    "--surface3":  "rgba(20,30,52,0.88)","--border":"rgba(36,48,80,0.7)",
    "--border-s":  "rgba(28,40,64,0.6)","--text":"#e8f0ff","--muted":"#7a90b8",
    "--gold":"#f5c66a","--gold-bg":"rgba(41,32,12,0.85)",
    "--green":"#4ade80","--green-bg":"rgba(12,32,21,0.85)",
    "--red":"#f87171","--red-bg":"rgba(34,16,16,0.85)",
    "--blue":"#60a5fa","--blue-bg":"rgba(14,31,56,0.85)",
    "--purple":"#c084fc","--purple-bg":"rgba(30,16,48,0.85)",
    "--amber":"#fbbf24","--amber-bg":"rgba(39,31,8,0.85)",
    "--cyan":"#22d3ee","--cyan-bg":"rgba(8,32,40,0.85)",
    "--header":"rgba(5,7,14,0.96)","--input":"rgba(8,12,22,0.97)",
    "--shadow":"0 20px 60px rgba(0,0,0,0.55)","--overlay":"rgba(0,0,0,0.9)",
  },
  light: {
    "--surface":   "rgba(255,255,255,0.88)","--surface2":"rgba(246,249,255,0.91)",
    "--surface3":  "rgba(238,242,255,0.88)","--border":"rgba(205,215,238,0.7)",
    "--border-s":  "rgba(218,226,244,0.6)","--text":"#0d1526","--muted":"#566580",
    "--gold":"#a06500","--gold-bg":"rgba(254,248,231,0.9)",
    "--green":"#16a34a","--green-bg":"rgba(240,253,244,0.9)",
    "--red":"#dc2626","--red-bg":"rgba(255,241,241,0.9)",
    "--blue":"#1d4ed8","--blue-bg":"rgba(239,246,255,0.9)",
    "--purple":"#7c3aed","--purple-bg":"rgba(250,245,255,0.9)",
    "--amber":"#d97706","--amber-bg":"rgba(255,251,235,0.9)",
    "--cyan":"#0891b2","--cyan-bg":"rgba(236,254,255,0.9)",
    "--header":"rgba(240,244,255,0.97)","--input":"rgba(255,255,255,0.98)",
    "--shadow":"0 4px 24px rgba(0,0,0,0.12)","--overlay":"rgba(0,0,0,0.78)",
  },
};

/* ═══════════════════════════════════════════════════════════════════
   § GS1 ÜLKE KODLARI
   ═══════════════════════════════════════════════════════════════════ */
const COUNTRIES=[
  {prefix:"729",flag:"🇮🇱",name:"İsrail",highlight:true},
  {prefix:"000–019",flag:"🇺🇸",name:"ABD"},{prefix:"030–039",flag:"🇺🇸",name:"ABD"},
  {prefix:"060–139",flag:"🇺🇸",name:"ABD"},{prefix:"300–379",flag:"🇫🇷",name:"Fransa"},
  {prefix:"380",flag:"🇧🇬",name:"Bulgaristan"},{prefix:"383",flag:"🇸🇮",name:"Slovenya"},
  {prefix:"385",flag:"🇭🇷",name:"Hırvatistan"},{prefix:"387",flag:"🇧🇦",name:"Bosna-Hersek"},
  {prefix:"400–440",flag:"🇩🇪",name:"Almanya"},{prefix:"450–459",flag:"🇯🇵",name:"Japonya"},
  {prefix:"460–469",flag:"🇷🇺",name:"Rusya"},{prefix:"471",flag:"🇹🇼",name:"Tayvan"},
  {prefix:"474",flag:"🇪🇪",name:"Estonya"},{prefix:"475",flag:"🇱🇻",name:"Letonya"},
  {prefix:"476",flag:"🇦🇿",name:"Azerbaycan"},{prefix:"477",flag:"🇱🇹",name:"Litvanya"},
  {prefix:"482",flag:"🇺🇦",name:"Ukrayna"},{prefix:"484",flag:"🇲🇩",name:"Moldova"},
  {prefix:"485",flag:"🇦🇲",name:"Ermenistan"},{prefix:"486",flag:"🇬🇪",name:"Gürcistan"},
  {prefix:"487",flag:"🇰🇿",name:"Kazakistan"},{prefix:"489",flag:"🇭🇰",name:"Hong Kong"},
  {prefix:"500–509",flag:"🇬🇧",name:"Birleşik Krallık"},{prefix:"520–521",flag:"🇬🇷",name:"Yunanistan"},
  {prefix:"528",flag:"🇱🇧",name:"Lübnan"},{prefix:"529",flag:"🇨🇾",name:"Kıbrıs"},
  {prefix:"539",flag:"🇮🇪",name:"İrlanda"},{prefix:"540–549",flag:"🇧🇪",name:"Belçika"},
  {prefix:"560",flag:"🇵🇹",name:"Portekiz"},{prefix:"569",flag:"🇮🇸",name:"İzlanda"},
  {prefix:"570–579",flag:"🇩🇰",name:"Danimarka"},{prefix:"590",flag:"🇵🇱",name:"Polonya"},
  {prefix:"594",flag:"🇷🇴",name:"Romanya"},{prefix:"599",flag:"🇭🇺",name:"Macaristan"},
  {prefix:"600–601",flag:"🇿🇦",name:"Güney Afrika"},{prefix:"611",flag:"🇲🇦",name:"Fas"},
  {prefix:"619",flag:"🇹🇳",name:"Tunus"},{prefix:"622",flag:"🇪🇬",name:"Mısır"},
  {prefix:"625",flag:"🇯🇴",name:"Ürdün"},{prefix:"626",flag:"🇮🇷",name:"İran"},
  {prefix:"627",flag:"🇰🇼",name:"Kuveyt"},{prefix:"628",flag:"🇸🇦",name:"Suudi Arabistan"},
  {prefix:"629",flag:"🇦🇪",name:"BAE"},{prefix:"640–649",flag:"🇫🇮",name:"Finlandiya"},
  {prefix:"690–699",flag:"🇨🇳",name:"Çin"},{prefix:"700–709",flag:"🇳🇴",name:"Norveç"},
  {prefix:"730–739",flag:"🇸🇪",name:"İsveç"},{prefix:"750",flag:"🇲🇽",name:"Meksika"},
  {prefix:"754–755",flag:"🇨🇦",name:"Kanada"},{prefix:"760–769",flag:"🇨🇭",name:"İsviçre"},
  {prefix:"789–790",flag:"🇧🇷",name:"Brezilya"},{prefix:"800–839",flag:"🇮🇹",name:"İtalya"},
  {prefix:"840–849",flag:"🇪🇸",name:"İspanya"},{prefix:"858",flag:"🇸🇰",name:"Slovakya"},
  {prefix:"859",flag:"🇨🇿",name:"Çek Cumhuriyeti"},{prefix:"860",flag:"🇷🇸",name:"Sırbistan"},
  {prefix:"868–869",flag:"🇹🇷",name:"Türkiye"},{prefix:"870–879",flag:"🇳🇱",name:"Hollanda"},
  {prefix:"880",flag:"🇰🇷",name:"Güney Kore"},{prefix:"885",flag:"🇹🇭",name:"Tayland"},
  {prefix:"888",flag:"🇸🇬",name:"Singapur"},{prefix:"890",flag:"🇮🇳",name:"Hindistan"},
  {prefix:"893",flag:"🇻🇳",name:"Vietnam"},{prefix:"899",flag:"🇮🇩",name:"Endonezya"},
  {prefix:"900–919",flag:"🇦🇹",name:"Avusturya"},{prefix:"930–939",flag:"🇦🇺",name:"Avustralya"},
  {prefix:"940–949",flag:"🇳🇿",name:"Yeni Zelanda"},{prefix:"955",flag:"🇲🇾",name:"Malezya"},
];

/* ═══════════════════════════════════════════════════════════════════
   § E-NUMARALAR VERİTABANI
   ═══════════════════════════════════════════════════════════════════ */
const E_DB={
  "E100":{n:"Kurkumin (Zerdeçal)",c:"🎨 Renk",s:"safe",v:true,tr:"Zerdeçaldan doğal sarı boya. Anti-inflamatuar. Güvenli.",w:""},
  "E101":{n:"Riboflavin (B2)",c:"🎨 Renk",s:"safe",v:true,tr:"Doğal vitamin. Sarımsı renk. Güvenli.",w:""},
  "E102":{n:"Tartrazin",c:"🎨 Renk",s:"avoid",v:true,tr:"Sarı sentetik boya. Çocuklarda hiperaktivite.",w:"Çocuklar kaçınsın"},
  "E104":{n:"Kinolin Sarısı",c:"🎨 Renk",s:"avoid",v:true,tr:"Sentetik sarı boya. Norveç'te yasaklı.",w:"Çocuklar kaçınsın"},
  "E110":{n:"Sunset Yellow FCF",c:"🎨 Renk",s:"avoid",v:true,tr:"Turuncu-sarı boya. Hiperaktivite bağlantısı.",w:"Hassasiyete neden olabilir"},
  "E120":{n:"Karmin (Koşinil)",c:"🎨 Renk",s:"caution",v:false,tr:"Koşinil böceğinden kırmızı boya. Vegan değil.",w:"Vegan değil"},
  "E122":{n:"Karmoizin",c:"🎨 Renk",s:"avoid",v:true,tr:"Sentetik kırmızı. Norveç ve İsveç'te yasaklı.",w:"Bazı ülkelerde yasaklı"},
  "E123":{n:"Amaranth",c:"🎨 Renk",s:"banned",v:true,tr:"ABD ve Rusya'da yasaklı. Kanserojenik iddia.",w:"ABD'de yasaklı"},
  "E124":{n:"Ponceau 4R",c:"🎨 Renk",s:"avoid",v:true,tr:"Kırmızı boya. Norveç ve ABD'de yasaklı.",w:"Çocuklar kaçınsın"},
  "E129":{n:"Allura Red AC",c:"🎨 Renk",s:"avoid",v:true,tr:"Kırmızı-turuncu boya. Çocuklarda hiperaktivite.",w:"Çocuklar kaçınsın"},
  "E140":{n:"Klorofil",c:"🎨 Renk",s:"safe",v:true,tr:"Bitkilerin yeşil pigmenti. Doğal ve güvenli.",w:""},
  "E150a":{n:"Sade Karamel",c:"🎨 Renk",s:"safe",v:true,tr:"Şeker yakılmasıyla kahverengi boya. Güvenli.",w:""},
  "E150d":{n:"Sülfitli Amonyum Karamel",c:"🎨 Renk",s:"caution",v:true,tr:"Cola içeceklerinde yaygın. Aşırı tüketimde dikkat.",w:"Aşırı tüketimde dikkat"},
  "E160a":{n:"Beta-Karoten",c:"🎨 Renk",s:"safe",v:true,tr:"Havuçtan doğal turuncu boya; A vitaminine dönüşür.",w:""},
  "E160d":{n:"Likopen",c:"🎨 Renk",s:"safe",v:true,tr:"Domateslerden kırmızı pigment; antioksidan.",w:""},
  "E162":{n:"Pancardan Kırmızı",c:"🎨 Renk",s:"safe",v:true,tr:"Pancardan doğal kırmızı/mor boya. Güvenli.",w:""},
  "E163":{n:"Antosiyaninler",c:"🎨 Renk",s:"safe",v:true,tr:"Üzüm, böğürtlenden mor/kırmızı boya. Antioksidan.",w:""},
  "E171":{n:"Titanyum Dioksit",c:"🎨 Renk",s:"avoid",v:true,tr:"Beyaz renklendirici. AB'de 2022'den itibaren yasaklandı.",w:"AB'de yasaklı (2022)"},
  "E200":{n:"Sorbik Asit",c:"🛡 Koruyucu",s:"safe",v:true,tr:"Doğal koruyucu. Güvenli.",w:""},
  "E202":{n:"Potasyum Sorbat",c:"🛡 Koruyucu",s:"safe",v:true,tr:"Yaygın ve güvenli koruyucu.",w:""},
  "E210":{n:"Benzoik Asit",c:"🛡 Koruyucu",s:"caution",v:true,tr:"E211 ile C vitaminiyle benzene dönüşebilir.",w:"E300 ile benzene dönüşebilir"},
  "E211":{n:"Sodyum Benzoat",c:"🛡 Koruyucu",s:"avoid",v:true,tr:"C vitaminiyle asidik ortamda benzene dönüşebilir (IARC Grup 1). Çocuklarda hiperaktivite.",w:"Benzene riski; çocuklar kaçınsın"},
  "E220":{n:"Kükürt Dioksit",c:"🛡 Koruyucu",s:"caution",v:true,tr:"Şarap, kuru meyvede yaygın. Astım tetikleyici.",w:"Astım hastaları dikkat"},
  "E250":{n:"Sodyum Nitrit",c:"🛡 Koruyucu",s:"avoid",v:true,tr:"İşlenmiş ette nitrozamin oluşturur. WHO Grup 1 karsinojen.",w:"Karsinojen risk — işlenmiş et"},
  "E251":{n:"Sodyum Nitrat",c:"🛡 Koruyucu",s:"avoid",v:true,tr:"İşlenmiş ette; nitrozamine dönüşme riski.",w:"Karsinojen risk"},
  "E270":{n:"Laktik Asit",c:"🛡 Koruyucu",s:"safe",v:true,tr:"Fermentasyonla doğal asit; yoğurt, peynir. Güvenli.",w:""},
  "E300":{n:"L-Askorbik Asit (C Vitamini)",c:"⚗️ Antioksidan",s:"safe",v:true,tr:"Doğal ve faydalı antioksidan. Tamamen güvenli.",w:""},
  "E306":{n:"Tokoferoller (E Vitamini)",c:"⚗️ Antioksidan",s:"safe",v:true,tr:"E vitamini; doğal antioksidan.",w:""},
  "E319":{n:"TBHQ",c:"⚗️ Antioksidan",s:"avoid",v:true,tr:"Hızlı yiyecek ve cipste. Yüksek dozda tümör riski.",w:"Dikkatli tüketin"},
  "E320":{n:"BHA",c:"⚗️ Antioksidan",s:"avoid",v:true,tr:"IARC Grup 2B olası karsinojen. Japonya'da yasaklı.",w:"Olası karsinojen (IARC 2B)"},
  "E321":{n:"BHT",c:"⚗️ Antioksidan",s:"caution",v:true,tr:"Hayvan çalışmalarında tümör bağlantısı; tartışmalı.",w:"Yüksek dozda kaçının"},
  "E322":{n:"Lesitinler (Soya/Ayçiçeği)",c:"⚗️ Antioksidan",s:"safe",v:true,tr:"Emülgatör; güvenli. Soya alerjisinde dikkat.",w:"Soya alerjisi var ise dikkat"},
  "E330":{n:"Sitrik Asit",c:"⚗️ Antioksidan",s:"safe",v:true,tr:"Narenciyede doğal asit; güvenli.",w:""},
  "E338":{n:"Fosforik Asit",c:"⚗️ Antioksidan",s:"caution",v:true,tr:"Cola içeceklerinde. Aşırı tüketim kemik yoğunluğunu azaltır.",w:"Aşırı tüketimde kemik kaybı riski"},
  "E407":{n:"Karragenan",c:"🧪 Emülsifier",s:"caution",v:true,tr:"Kırmızı deniz yosunu. Bağırsak iltihabı bağlantısı.",w:"Bağırsak hastalığında dikkat"},
  "E412":{n:"Guar Gam",c:"🧪 Emülsifier",s:"safe",v:true,tr:"Guar fasulyesinden doğal kıvam artırıcı. Güvenli.",w:""},
  "E415":{n:"Ksantan Gam",c:"🧪 Emülsifier",s:"safe",v:true,tr:"Fermantasyonla üretilen kıvam artırıcı. Güvenli.",w:""},
  "E440":{n:"Pektinler",c:"🧪 Emülsifier",s:"safe",v:true,tr:"Meyve kabuklarından doğal jelleştirici. Prebiyotik.",w:""},
  "E466":{n:"Karboksimetilselüloz (CMC)",c:"🧪 Emülsifier",s:"caution",v:true,tr:"Klinik çalışmalarda bağırsak mikrobiyomunu bozduğu gösterildi.",w:"Bağırsak florasına etkisi var"},
  "E471":{n:"Mono ve Digliseritler",c:"🧪 Emülsifier",s:"caution",v:null,tr:"Hayvansal veya bitkisel kaynaklı. Kaynak etiketle belirtilmeyebilir.",w:"Hayvansal kaynak olabilir"},
  "E500":{n:"Sodyum Karbonatlar",c:"⚖️ Asidite",s:"safe",v:true,tr:"Kabartma tozu. Güvenli.",w:""},
  "E621":{n:"Monosodyum Glutamat (MSG)",c:"🌶 Aroma",s:"caution",v:true,tr:"Umami lezzet güçlendirici. Hassasiyeti olanlarda baş ağrısı.",w:"Hassasiyet var ise dikkat"},
  "E631":{n:"Disodyum İnosinat",c:"🌶 Aroma",s:"caution",v:null,tr:"Et veya balıktan aroma güçlendirici. Gut hastaları kaçınmalı.",w:"Vegan değil; gut hastaları dikkat"},
  "E901":{n:"Bal Mumu",c:"🍬 Tatlandırıcı",s:"safe",v:false,tr:"Arı mumu; meyve ve şeker kaplama. Vegan değil.",w:"Vegan değil"},
  "E950":{n:"Asesülfam K",c:"🍬 Tatlandırıcı",s:"caution",v:true,tr:"Sıfır kalori tatlandırıcı. Bağırsak florasına etkisi tartışmalı.",w:"Uzun vadeli etki tartışmalı"},
  "E951":{n:"Aspartam",c:"🍬 Tatlandırıcı",s:"caution",v:true,tr:"2023'te IARC Grup 2B sınıflandırıldı. PKU hastası kesinlikle kaçınsın.",w:"IARC 2B (2023); PKU hastası yasak"},
  "E952":{n:"Siklamilik Asit",c:"🍬 Tatlandırıcı",s:"banned",v:true,tr:"ABD ve Japonya'da yasaklı.",w:"ABD'de yasaklı"},
  "E954":{n:"Sakarin",c:"🍬 Tatlandırıcı",s:"caution",v:true,tr:"En eski yapay tatlandırıcı. Yüksek dozda mesane kanseri riski (hayvan).",w:"Yüksek doz dikkat"},
  "E955":{n:"Sükraloz",c:"🍬 Tatlandırıcı",s:"caution",v:true,tr:"Klorlu şeker bileşiği. Bağırsak florasına etkisi tartışmalı.",w:"Bağırsak florasına etkisi tartışmalı"},
  "E960":{n:"Steviol Glikozitler (Stevia)",c:"🍬 Tatlandırıcı",s:"safe",v:true,tr:"Stevia bitkisinden doğal tatlandırıcı. Güvenli.",w:""},
  "E967":{n:"Ksilitol",c:"🍬 Tatlandırıcı",s:"caution",v:true,tr:"İnsanlar için güvenli. KÖPEKLERİ KORUYUN — köpekler için ölümcül.",w:"KÖPEKLER İÇİN ÖLÜMLEYİCİ"},
  "E968":{n:"Eritritol",c:"🍬 Tatlandırıcı",s:"safe",v:true,tr:"Doğal şeker alkolü; düşük kalorili. İyi tolere edilir.",w:""},
};

/* ═══════════════════════════════════════════════════════════════════
   § KAPSAMLI ÜRÜN VERİTABANI
   ═══════════════════════════════════════════════════════════════════ */
const PRODUCTS_DETAIL=[
  {
    brand:"Coca-Cola",emoji:"🥤",color:"#DA291C",origin:"🇺🇸 ABD",
    status:"neutral",revenue:"$45.8 Milyar (2023)",founded:1886,
    about:"Dünya genelinde 200+ ülkede satılan, 1886'dan beri üretilen ikonik gazlı içecek markası. The Coca-Cola Company bünyesindeki 500+ marka arasında en bilinenidir.",
    products:[
      {name:"Coca-Cola Classic",emoji:"🥤",
        ingredients:["Karbonatlı su","Şeker (AB'de sukroz)","Karamel renklendirici (E150d)","Fosforik asit (E338)","Doğal aromalar (kola yaprağı ekstrakt)","Kafein"],
        nutrition:"330ml: 139 kcal | 35g şeker | 34mg kafein",
        additives:["E150d","E338"],warn:[],notes:"Orijinal 1886 formülü. AB'de HFCS yerine şeker kullanılır. 'Gizli' 7X formülü hâlâ gizli tutulmaktadır."},
      {name:"Coca-Cola Zero Sugar",emoji:"🥤",
        ingredients:["Karbonatlı su","Karamel renklendirici (E150d)","Fosforik asit (E338)","Aspartam (E951)","Asesülfam K (E950)","Doğal aromalar","Kafein"],
        nutrition:"330ml: 1 kcal | 0g şeker | 34mg kafein",
        additives:["E150d","E338","E951","E950"],warn:["E951 — IARC 2B 2023"]},
      {name:"Fanta Orange",emoji:"🍊",
        ingredients:["Karbonatlı su","Şeker","Portakal meyve suyu (%5-8)","Sitrik asit (E330)","Doğal portakal aroması","Beta-karoten (E160a)"],
        nutrition:"330ml: 155 kcal | 37g şeker",
        additives:["E330","E160a"],warn:[],notes:"AB versiyonunda yapay renklendirici içermez."},
      {name:"Sprite",emoji:"🟢",
        ingredients:["Karbonatlı su","Şeker","Sitrik asit (E330)","Limon-misket limonu aroması","Sodyum sitrat","Sodyum benzoat (E211)"],
        nutrition:"330ml: 140 kcal | 36g şeker",
        additives:["E330","E211"],warn:["E211 — C vitaminiyle benzene dönüşebilir"]},
    ]
  },
  {
    brand:"Nestlé",emoji:"☕",color:"#009999",origin:"🇨🇭 İsviçre",
    status:"boycott",revenue:"$94.4 Milyar (2023)",founded:1866,
    boycottReason:"İsrail'deki Osem gıda şirketinin %60 hissesine sahip.",
    about:"Dünyanın en büyük gıda ve içecek şirketi. 189 ülkede 2000+ marka altında ürün satmaktadır. Bebek maması krizleri ve su kaynaklarını işletme tartışmalarıyla da gündemdedir.",
    products:[
      {name:"Nescafé Classic",emoji:"☕",
        ingredients:["Kahve (Robusta + Arabica karışımı, %100)"],
        nutrition:"1 bardak (2g): 4 kcal | ~50-80mg kafein",
        additives:[],warn:[],notes:"Spray-dried teknolojisi. Granüle serisinde kavrulmuş tahıl eklenebilir."},
      {name:"KitKat Sütlü",emoji:"🍫",
        ingredients:["Şeker","Buğday unu","Kakao yağı","Yağsız süt tozu","Kakao kütlesi","Palm yağı","Peynir altı suyu tozu","E322 (soya lesitini)","Vanilya aroması"],
        nutrition:"41.5g: 218 kcal | 22g şeker | 8.7g doymuş yağ",
        additives:["E322"],warn:[],notes:"Avrupa versiyonu UTZ/Rainforest Alliance sertifikalı kakao."},
      {name:"Maggi Çorba Bazı",emoji:"🍲",
        ingredients:["İyotsuz tuz","Hidrolize bitkisel protein","Şeker","Mısır nişastası","Sebze yağı","Maya ekstrakt","Baharatlar"],
        nutrition:"10g porsiyon: 30 kcal | 1100mg sodyum",
        additives:[],warn:["Yüksek sodyum"],notes:"Avrupa versiyonu MSG (E621) içermez."},
      {name:"S.Pellegrino",emoji:"💧",
        ingredients:["Doğal mineralli su","CO2 (karbonasyon)"],
        nutrition:"750ml: 0 kcal | Ca 208mg | Mg 55mg | pH 7.7",
        additives:[],warn:[],notes:"Lombardiya, İtalya. 1899'dan beri aynı kaynaktan."},
    ]
  },
  {
    brand:"Unilever",emoji:"🧴",color:"#1F36C7",origin:"🇬🇧🇳🇱 İngiltere/Hollanda",
    status:"boycott",revenue:"$60.1 Milyar (2023)",founded:1929,
    boycottReason:"İsrail'de fabrika operasyonları; Rexona ve Dove Israel pazar payı.",
    about:"Dove, Rexona, Lipton, Knorr, Ben&Jerry's dahil 400+ markayla FMCG devsi. 2.5 milyar insan her gün Unilever ürünü kullanmaktadır.",
    products:[
      {name:"Dove Nemlendirici Sabun",emoji:"🧼",
        ingredients:["Sodyum lauroyl isethionate","Stearik asit","Su","Sodyum klorür","Parfüm","1/4 nemlendirici krem (gliserin bazlı)","BHT"],
        nutrition:"pH 7 — deri bariyerini korur",
        additives:[],warn:["Parfüm alerjisi olanlarda dikkat"],notes:"AB'de mikrobead içermez."},
      {name:"Lipton Yellow Label Çay",emoji:"🍵",
        ingredients:["Siyah çay yaprakları (%100, Rainforest Alliance sertifikalı)"],
        nutrition:"200ml: 2 kcal | ~40-50mg kafein",
        additives:[],warn:[],notes:"Avrupa'da piramit poşet formatı."},
      {name:"Hellmann's Mayonez",emoji:"🥄",
        ingredients:["Kolza yağı (%78)","Su","Pastörize yumurta sarısı (%7.9)","Distile sirke","Tuz","Şeker","Limon suyu","Ca dinatrium EDTA"],
        nutrition:"100g: 721 kcal | 78g yağ | 0.9g şeker",
        additives:[],warn:[],notes:"Avrupa versiyonu serbest-dolaşan tavuk yumurtası."},
      {name:"Knorr Tavuk Çorba",emoji:"🍲",
        ingredients:["Tuz","Nişasta","Şeker","Tavuk yağı (%3.6)","Soğan tozu","Tavuk eti tozu (%2.1)","Maya ekstrakt"],
        nutrition:"1 litre: 35 kcal | 750mg sodyum",
        additives:[],warn:["Yüksek sodyum"],notes:"AB versiyonu MSG-free."},
    ]
  },
  {
    brand:"L'Oréal",emoji:"💄",color:"#C8002B",origin:"🇫🇷 Fransa",
    status:"boycott",revenue:"$41.2 Milyar (2023)",founded:1909,
    boycottReason:"İsrail'deki üretim tesisleri; Garnier, Maybelline lokal üretim.",
    about:"Dünyanın en büyük güzellik şirketi. Garnier, Maybelline, Lancôme, NYX, Kérastase, Vichy dahil 36 marka.",
    products:[
      {name:"Garnier Micellar Water",emoji:"💧",
        ingredients:["Su","Heksilen glikol","Gliserin","Poloksamer 184","Propilen glikol","EDTA dinatrium","Sodyum hidroksit"],
        nutrition:"%96 doğal kökenli içerik (Avrupa versiyonu)",
        additives:[],warn:[],notes:"pH 7 formül. Mikeller tek pasoda temizler."},
      {name:"L'Oréal Revitalift C Vitamini Serum",emoji:"✨",
        ingredients:["Su","Askorbik asit (%12 C vitamini)","Gliserin","Hyaluronik asit (3 tip)","Propanediol","Fenoxyetanol"],
        nutrition:"—",
        additives:[],warn:[],notes:"Dermatolog onaylı. Pro-Retinol + Centella Asiatica."},
      {name:"Maybelline Fit Me Fondöten",emoji:"💄",
        ingredients:["Su","Cyclopentasiloxane","Titanyum dioksit","Talc","Gliserin","Dimethicone","Tocopheryl asetat"],
        nutrition:"40 renk tonu | SPF18",
        additives:["E171"],warn:["E171 AB'de gıdada yasaklı — kozmetikte farklı sınır"],notes:"Non-comedogenic."},
      {name:"NYX Likit Mat Ruj",emoji:"💋",
        ingredients:["Isododecane","Trimethylsiloxysilicate","Dimethicone","Kaolin","Parfüm","Tocopheryl asetat","Pigmentler"],
        nutrition:"45 renk | 8-10 saat kalıcılık",
        additives:[],warn:[],notes:"Vegan; PETA onaylı."},
    ]
  },
  {
    brand:"Ferrero",emoji:"🍫",color:"#C89520",origin:"🇮🇹 İtalya",
    status:"neutral",revenue:"$17.2 Milyar (2023)",founded:1946,
    about:"Nutella, Kinder, Ferrero Rocher, Tic Tac ile dünya çapında milyarlarca tüketiciye ulaşan İtalyan şekerlemesi devi. Borsaya kote değil; hâlâ aile şirketi.",
    products:[
      {name:"Nutella",emoji:"🫙",
        ingredients:["Şeker (%56.3)","Palm yağı (RSPO sertifikalı)","Fındık (%13)","Yağsız kakao tozu (%7.4)","Yağsız süt tozu (%6.6)","Soya lesitini (E322)","Vanilya aroması"],
        nutrition:"15g: 80 kcal | 8.6g şeker | 4.5g yağ",
        additives:["E322"],warn:["Yüksek şeker oranı"],notes:"Dünyanın en çok satılan fındıklı sürme ürünü."},
      {name:"Ferrero Rocher",emoji:"🍫",
        ingredients:["Sütlü çikolata (%30 kakao)","Fındık","Şeker","Buğday unu","Palm yağı","Yağsız süt tozu","Vanilya"],
        nutrition:"1 adet (12.5g): 73 kcal | 5.9g şeker",
        additives:[],warn:[],notes:"3 katmanlı: wafer + praline + bütün fındık + çikolata."},
      {name:"Kinder Bueno",emoji:"🍬",
        ingredients:["Sütlü çikolata","Şeker","Palm yağı","Fındık (%9.4)","Yağsız süt tozu","Buğday unu","Vanilya"],
        nutrition:"43g: 230 kcal | 22g şeker | 14g yağ",
        additives:[],warn:[],notes:"Avrupa'da %40 wafer bar pazar payı."},
      {name:"Tic Tac Nane",emoji:"🌿",
        ingredients:["Şeker","Nişasta","Magnezyum stearat","Gum arabik","Doğal nane aroması","E Vitamini","Karnauba mumu"],
        nutrition:"1 adet (1.9g): 7.4 kcal | 1.9g şeker",
        additives:[],warn:[],notes:"1 adet '0 kalori' etiketi eşiği altındadır (0.5g limiti)."},
    ]
  },
  {
    brand:"Danone",emoji:"🥛",color:"#0059B3",origin:"🇫🇷 Fransa",
    status:"watch",revenue:"$27.6 Milyar (2023)",founded:1919,
    about:"Activia, Actimel, Evian, Alpro ve Oikos ile süt ürünleri ve bitkisel alternatif segmentinde lider. İsrail bağlantısı kesin değil, takip altında.",
    products:[
      {name:"Activia Probiyotik Yoğurt",emoji:"🫙",
        ingredients:["Pastörize tam yağlı süt","Yağsız süt tozu","Şeker","Pektin (E440)","Bifidobacterium animalis (CNCM I-2494)","L. bulgaricus","S. thermophilus"],
        nutrition:"125g: 99 kcal | 11g şeker | 4.6g protein | 10⁸ CFU/g",
        additives:["E440"],warn:[],notes:"Bifidobacterium suşu patentli."},
      {name:"Evian Doğal Maden Suyu",emoji:"💧",
        ingredients:["Doğal mineralli su (karbonatsız)"],
        nutrition:"pH 7.2 | Ca 80mg/L | Mg 26mg/L | Na 6.5mg/L | Bikarbonat 360mg/L",
        additives:[],warn:[],notes:"15 yıllık yeraltı filtrasyon süreci. Nitrat <1mg/L."},
      {name:"Alpro Yulaf İçeceği",emoji:"🌾",
        ingredients:["Su","Yulaf (%10)","Trikalsiyum fosfat","Kalsiyum karbonat","Deniz tuzu","Riboflavin (B2)","Vitamin B12","D vitamini"],
        nutrition:"100ml: 46 kcal | Ca 120mg",
        additives:[],warn:["Gluten içerir (yulaf)"],notes:"EFSA onaylı LDL düşürme iddiası."},
    ]
  },
  {
    brand:"P&G",emoji:"🧺",color:"#00309B",origin:"🇺🇸 ABD",
    status:"boycott",revenue:"$82.0 Milyar (2023)",founded:1837,
    boycottReason:"İsrail ordu faaliyetleri kapsamındaki BDS listesi; tedarik zinciri bağlantısı.",
    about:"Ariel, Gillette, Pampers, Head&Shoulders, Pantene, Oral-B ile küresel tüketici ürünleri lideri. 65+ ülkede üretim.",
    products:[
      {name:"Ariel 3in1 Pods",emoji:"🧺",
        ingredients:["Protease enzimi","Amylase enzimi","Polycarboxylate","Alkylbenzene sulfonat","Optik beyazlatıcı","Parfüm"],
        nutrition:"—",additives:[],warn:[],notes:"Avrupa biyolojik formülü 60°C etkin."},
      {name:"Gillette Fusion6 ProGlide",emoji:"🪒",
        ingredients:["Paslanmaz çelik bıçak","Titanyum kaplama","Jel şerit: Aloe vera + E vitamini + poliüretan"],
        nutrition:"—",additives:[],warn:[],notes:"Titanyum kaplama sürtünmeyi %25 azaltır."},
      {name:"Pampers Premium Protection",emoji:"👶",
        ingredients:["Polipropilen fleece","SAP (süperemici polimer)","Selüloz","Polietilen film"],
        nutrition:"—",additives:[],warn:[],notes:"SAP 30x ağırlığında su emer."},
      {name:"Oral-B Smart Diş Fırçası",emoji:"🦷",
        ingredients:["ABS plastik gövde","Naylon kıllar","Manyetik indüksiyon motoru"],
        nutrition:"48.800 darbe/dakika",additives:[],warn:[],notes:"Bluetooth bağlantılı. AB'de 2 yıl garanti."},
    ]
  },
  {
    brand:"Heineken",emoji:"🍺",color:"#007A33",origin:"🇳🇱 Hollanda",
    status:"neutral",revenue:"$36.4 Milyar (2023)",founded:1873,
    about:"Dünya genelinde 195 ülkede 300+ marka ile bira sektörünün en büyük oyuncularından biri. Heineken, Amstel, Desperados ve Tiger ana markalar.",
    products:[
      {name:"Heineken Lager",emoji:"🍺",
        ingredients:["Su","Arpa maltı","Mısır nişastası","Şerbetçiotu","Özel A-yeast suşu (1886'dan beri değişmedi)"],
        nutrition:"330ml: 139 kcal | %5 ABV | 11g karbonhidrat",
        additives:[],warn:["Gluten içerir","Alkol"],notes:"A-yeast 1886'dan beri değişmedi."},
      {name:"Heineken 0.0",emoji:"🟢",
        ingredients:["Su","Arpa maltı","Şerbetçiotu","Doğal aromalar"],
        nutrition:"330ml: 69 kcal | 0.05% ABV",
        additives:[],warn:["Gluten içerir"],notes:"Fermente edilip ardından alkol uzaklaştırılır."},
      {name:"Desperados Tekila Bira",emoji:"🌵",
        ingredients:["Su","Arpa maltı","Mısır nişastası","Şerbetçiotu","Şeker","Tekila aroma (mavi agave)","Limon suyu"],
        nutrition:"330ml: 158 kcal | %5.9 ABV",
        additives:[],warn:["Alkol"],notes:"Avrupa'da 18-25 yaş en hızlı büyüyen bira."},
    ]
  },
];

/* ═══════════════════════════════════════════════════════════════════
   § ABONELIK PLANLARI
   ═══════════════════════════════════════════════════════════════════ */
const PLANS=[
  {id:"free",name:"Ücretsiz",price:0,priceStr:"₺0",period:"Sonsuza kadar",
   color:"var(--muted)",features:["Tüm ülke kodları","İsrail & boykot listesi","Alternatifler","E-kodu veritabanı","Barkod tarayıcı","CSV & PDF export"],
   cta:"Mevcut Plan",disabled:true},
  {id:"monthly",name:"Premium",price:4999,priceStr:"₺49.99",period:"/ ay",
   color:"var(--purple)",tag:"🔥 Popüler",highlight:true,
   features:["Ücretsiz planın hepsi +","OpenFoodFacts API anlık sorgu","OCR ile kamera E-kodu tespiti","Kişisel ürün kara listesi","Aile profilleri (alerji takibi)","Offline mod","Reklamsız deneyim"],
   cta:"Premium'a Geç",disabled:false},
  {id:"yearly",name:"Yıllık Premium",price:39999,priceStr:"₺399.99",period:"/ yıl (%33 tasarruf)",
   color:"var(--gold)",
   features:["Premium'un hepsi +","Sınırsız ürün geçmişi","Beta özelliklere ilk erişim","Öncelikli destek"],
   cta:"Yıllık Başla",disabled:false},
];

/* ═══════════════════════════════════════════════════════════════════
   § YARDIMCI FONKSİYONLAR
   ═══════════════════════════════════════════════════════════════════ */
const norm=(v="")=>v.toLocaleLowerCase("tr").normalize("NFD").replace(/[\u0300-\u036f]/g,"");
const matchCountry=(n)=>{if(n==null||isNaN(n))return null;return COUNTRIES.find(({prefix})=>{const c=prefix.replace(/\s/g,"");if(c.includes("–")){const[s,e]=c.split("–");return n>=+s&&n<=+e;}return n===+c;})||null;};
const safetyMeta=(s)=>({safe:{label:"Güvenli",c:"var(--green)",bg:"var(--green-bg)",i:"✅"},caution:{label:"Dikkatli",c:"var(--amber)",bg:"var(--amber-bg)",i:"⚠️"},avoid:{label:"Kaçının",c:"var(--red)",bg:"var(--red-bg)",i:"🚫"},banned:{label:"Yasaklı",c:"var(--purple)",bg:"var(--purple-bg)",i:"⛔"}})[s]||{label:"Bilinmiyor",c:"var(--muted)",bg:"var(--surface3)",i:"❓"};

function doCSV(){
  const rows=[["E Kodu","İsim","Kategori","Güvenlik","Vegan","Bilgi","Uyarı"]];
  Object.entries(E_DB).forEach(([code,e])=>rows.push([code,e.n,e.c,e.s,e.v===true?"Evet":e.v===false?"Hayır":"Belirsiz",e.tr,e.w]));
  const csv="\uFEFF"+rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));a.download="e-numbers.csv";a.click();
}
function doPDF(){const el=document.getElementById("pdf-root");if(!el)return;el.style.display="block";window.print();el.style.display="none";}

/* ═══════════════════════════════════════════════════════════════════
   § UI ATOMLARI
   ═══════════════════════════════════════════════════════════════════ */
function Badge({children,tone="neutral",small}){
  const m={neutral:{bg:"var(--surface3)",c:"var(--muted)",b:"var(--border)"},
    gold:{bg:"var(--gold-bg)",c:"var(--gold)",b:"var(--gold)"},
    green:{bg:"var(--green-bg)",c:"var(--green)",b:"var(--green)"},
    red:{bg:"var(--red-bg)",c:"var(--red)",b:"var(--red)"},
    blue:{bg:"var(--blue-bg)",c:"var(--blue)",b:"var(--blue)"},
    purple:{bg:"var(--purple-bg)",c:"var(--purple)",b:"var(--purple)"},
    amber:{bg:"var(--amber-bg)",c:"var(--amber)",b:"var(--amber)"},
    cyan:{bg:"var(--cyan-bg)",c:"var(--cyan)",b:"var(--cyan)"}};
  const t=m[tone]||m.neutral;
  return <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:small?"2px 7px":"3px 9px",borderRadius:999,background:t.bg,color:t.c,border:`1px solid ${t.b}`,fontSize:small?10:11,fontWeight:700,whiteSpace:"nowrap"}}>{children}</span>;
}
function Btn({children,onClick,tone="neutral",icon,small,full}){
  const m={neutral:{bg:"var(--surface2)",c:"var(--text)",b:"var(--border)"},
    green:{bg:"var(--green-bg)",c:"var(--green)",b:"var(--green)"},
    blue:{bg:"var(--blue-bg)",c:"var(--blue)",b:"var(--blue)"},
    purple:{bg:"var(--purple-bg)",c:"var(--purple)",b:"var(--purple)"},
    amber:{bg:"var(--amber-bg)",c:"var(--amber)",b:"var(--amber)"},
    cyan:{bg:"var(--cyan-bg)",c:"var(--cyan)",b:"var(--cyan)"},
    red:{bg:"var(--red-bg)",c:"var(--red)",b:"var(--red)"},
    gold:{bg:"var(--gold-bg)",c:"var(--gold)",b:"var(--gold)"}};
  const t=m[tone]||m.neutral;
  return <button onClick={onClick} style={{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6,padding:small?"6px 11px":"9px 15px",borderRadius:11,border:`1px solid ${t.b}`,background:t.bg,color:t.c,fontFamily:"inherit",fontSize:small?12:13,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",width:full?"100%":"auto",transition:"opacity .15s"}}>{icon&&<span>{icon}</span>}{children}</button>;
}
function Card({children,style,onClick}){
  return <div onClick={onClick} style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:14,boxShadow:"var(--shadow)",backdropFilter:"blur(12px)",cursor:onClick?"pointer":"default",transition:"transform .15s",...style}} onMouseEnter={onClick?(e)=>{e.currentTarget.style.transform="translateY(-2px)";}:undefined} onMouseLeave={onClick?(e)=>{e.currentTarget.style.transform="";}:undefined}>{children}</div>;
}
function Inp({value,onChange,placeholder,autoFocus,type="text"}){
  return <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} autoFocus={autoFocus} style={{width:"100%",boxSizing:"border-box",background:"var(--input)",color:"var(--text)",border:"1px solid var(--border-s)",borderRadius:11,padding:"10px 13px",fontSize:14,outline:"none",fontFamily:"inherit",backdropFilter:"blur(8px)"}}/>;
}
function PDFRoot(){
  return <div id="pdf-root" style={{display:"none",fontFamily:"sans-serif",padding:24,color:"#000"}}>
    <h1>E-Kodu Rehberi</h1>
    {Object.entries(E_DB).map(([code,e])=>(
      <div key={code} style={{marginBottom:8,borderBottom:"1px solid #eee",paddingBottom:6}}>
        <strong>{code} — {e.n}</strong> [{e.s.toUpperCase()}]<br/>
        <small>{e.c} | {e.tr}</small>
        {e.w&&<><br/><small style={{color:"red"}}>⚠ {e.w}</small></>}
      </div>
    ))}
  </div>;
}

/* ═══════════════════════════════════════════════════════════════════
   § SCANNER MODAL
   ═══════════════════════════════════════════════════════════════════ */
function ScannerModal({onClose}){
  const videoRef=useRef(null);const streamRef=useRef(null);const rafRef=useRef(null);
  const[result,setResult]=useState(null);const[error,setError]=useState("");
  const[manualVal,setManualVal]=useState("");const[scanning,setScanning]=useState(true);
  const[hasBarcodeAPI,setHasBarcodeAPI]=useState(null);
  const processCode=useCallback((raw)=>{
    const clean=raw.trim();const digits=clean.replace(/\D/g,"");
    const pfx=digits.length>=3?+digits.slice(0,3):null;
    const country=matchCountry(pfx);
    const eMatch=clean.toUpperCase().match(/^E(\d{3,4})$/);
    if(eMatch){const eData=E_DB["E"+eMatch[1]];setResult({type:"e-number",code:"E"+eMatch[1],data:eData,raw:clean});setScanning(false);return;}
    setResult({type:"barcode",raw:clean,digits,country,prefix:pfx});setScanning(false);
  },[]);
  useEffect(()=>{
    if("BarcodeDetector" in window)setHasBarcodeAPI(true);else setHasBarcodeAPI(false);
    let active=true;
    const startCam=async()=>{
      try{
        const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"},width:{ideal:1280},height:{ideal:720}}});
        streamRef.current=stream;
        if(videoRef.current){videoRef.current.srcObject=stream;await videoRef.current.play();}
        if("BarcodeDetector" in window){
          const det=new BarcodeDetector({formats:["ean_13","ean_8","qr_code","code_128","upc_a","upc_e"]});
          const loop=async()=>{if(!active||!scanning)return;if(videoRef.current?.readyState>=2){try{const bc=await det.detect(videoRef.current);if(bc.length>0){processCode(bc[0].rawValue);return;}}catch(e){}}rafRef.current=requestAnimationFrame(loop);};
          rafRef.current=requestAnimationFrame(loop);
        }
      }catch(e){setError("Kamera erişimi reddedildi. Tarayıcı ayarlarından kamera iznini etkinleştirin.");}
    };
    startCam();
    return()=>{active=false;if(rafRef.current)cancelAnimationFrame(rafRef.current);if(streamRef.current)streamRef.current.getTracks().forEach(t=>t.stop());};
  },[processCode,scanning]);
  const reset=()=>{setResult(null);setManualVal("");setScanning(true);};
  return(
    <div style={{position:"fixed",inset:0,zIndex:100,background:"var(--overlay)",display:"flex",flexDirection:"column",animation:"fadeIn .2s ease"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"13px 16px",background:"var(--surface)",backdropFilter:"blur(16px)",borderBottom:"1px solid var(--border-s)"}}>
        <div style={{fontWeight:900,fontSize:16,color:"var(--text)"}}>📷 Barkod & E-Kodu Tarayıcı</div>
        <button onClick={onClose} style={{width:36,height:36,borderRadius:10,border:"1px solid var(--border)",background:"var(--surface2)",color:"var(--text)",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
      </div>
      <div style={{flex:1,position:"relative",overflow:"hidden",background:"#000"}}>
        <video ref={videoRef} style={{width:"100%",height:"100%",objectFit:"cover"}} muted playsInline/>
        {scanning&&!error&&(
          <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none"}}>
            <div style={{width:"70%",maxWidth:300,aspectRatio:"1.5",border:"2px solid var(--cyan)",borderRadius:12,boxShadow:"0 0 0 3000px rgba(0,0,0,0.5)",position:"relative"}}>
              {[{t:0,l:0,bw:"3px 0 0 3px"},{t:0,r:0,bw:"3px 3px 0 0"},{b:0,l:0,bw:"0 0 3px 3px"},{b:0,r:0,bw:"0 3px 3px 0"}].map((p,i)=>(
                <div key={i} style={{position:"absolute",width:20,height:20,borderColor:"var(--cyan)",borderStyle:"solid",borderWidth:p.bw,...(p.t!=null?{top:p.t}:{}),(p.b!=null?{bottom:p.b}:{}),(p.l!=null?{left:p.l}:{}),(p.r!=null?{right:p.r}:{})}}/>
              ))}
              <div style={{position:"absolute",left:4,right:4,height:2,background:"linear-gradient(90deg,transparent,var(--cyan),transparent)",animation:"scanLine 2s linear infinite"}}/>
            </div>
            <div style={{position:"absolute",bottom:"28%",color:"#fff",fontSize:13,fontWeight:600,textShadow:"0 1px 4px #000",textAlign:"center",padding:"0 20px"}}>
              {hasBarcodeAPI?"Barkod veya QR kodu kameraya gösterin":"Manuel giriş kullanın"}
            </div>
          </div>
        )}
        {error&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:12,padding:24}}><div style={{fontSize:40}}>📷❌</div><div style={{color:"var(--red)",fontWeight:700,textAlign:"center",fontSize:14}}>{error}</div></div>}
      </div>
      <div style={{background:"var(--surface)",backdropFilter:"blur(16px)",borderTop:"1px solid var(--border-s)",padding:"14px 16px",maxHeight:"55vh",overflowY:"auto"}}>
        {!result?(
          <div style={{display:"grid",gap:10}}>
            <div style={{fontSize:12,color:"var(--muted)",fontWeight:700,textTransform:"uppercase",letterSpacing:.8}}>Manuel Giriş</div>
            <div style={{display:"flex",gap:8}}><Inp value={manualVal} onChange={setManualVal} placeholder="Barkod numarası veya E-kodu (örn: E211, 8690000001234)"/><Btn tone="cyan" onClick={()=>manualVal.trim()&&processCode(manualVal.trim())}>Sorgula</Btn></div>
          </div>
        ):(
          <div style={{display:"grid",gap:11}}>
            {result.type==="barcode"&&(
              <div style={{display:"grid",gap:9}}>
                <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                  {result.country&&<span style={{fontSize:26}}>{result.country.flag}</span>}
                  <div><div style={{fontWeight:900,fontSize:16,color:"var(--text)"}}>{result.country?.name||"Bilinmeyen Menşei"}</div><div style={{fontSize:12,color:"var(--muted)"}}>Barkod: {result.raw} | Prefix: {result.prefix}</div></div>
                  {result.country?.highlight&&<Badge tone="red">🇮🇱 İsrail ürünü!</Badge>}
                </div>
                {result.country?.highlight&&<div style={{background:"var(--red-bg)",border:"1px solid var(--red)",borderRadius:10,padding:"10px 13px",fontSize:13,color:"var(--red)",fontWeight:600}}>⚠ Bu ürün İsrail kaynaklıdır (GS1 prefix 729).</div>}
              </div>
            )}
            {result.type==="e-number"&&result.data&&(()=>{const m=safetyMeta(result.data.s);return(
              <div style={{display:"grid",gap:8}}>
                <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                  <span style={{fontFamily:"monospace",fontSize:18,fontWeight:900,color:"var(--cyan)"}}>{result.code}</span>
                  <span style={{fontWeight:800,fontSize:15,color:"var(--text)"}}>{result.data.n}</span>
                  <Badge tone={result.data.s==="safe"?"green":result.data.s==="caution"?"amber":result.data.s==="banned"?"purple":"red"}>{m.i} {m.label}</Badge>
                  {result.data.v===false&&<Badge tone="amber">Vegan ✗</Badge>}
                </div>
                <div style={{fontSize:13,color:"var(--text)",lineHeight:1.7,background:"var(--surface2)",borderRadius:10,padding:"10px 13px"}}>{result.data.tr}</div>
                {result.data.w&&<div style={{fontSize:12,color:m.c,background:m.bg,border:`1px solid ${m.c}`,borderRadius:9,padding:"7px 11px",fontWeight:700}}>⚠ {result.data.w}</div>}
              </div>
            );})()}
            {result.type==="e-number"&&!result.data&&<div style={{color:"var(--muted)",fontSize:13}}>"{result.raw}" için veritabanında kayıt bulunamadı.</div>}
            <Btn tone="neutral" onClick={reset} full>← Yeni Tarama</Btn>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   § AUTH MODAL — Google, GitHub, Apple, E-posta
   ═══════════════════════════════════════════════════════════════════ */
function AuthModal({onClose,onAuth}){
  const[mode,setMode]=useState("login");// login | register | forgot
  const[email,setEmail]=useState("");const[pass,setPass]=useState("");
  const[name,setName]=useState("");const[loading,setLoading]=useState(false);
  const[msg,setMsg]=useState("");

  const handleProvider=async(provider)=>{
    setLoading(true);
    // TODO: Replace with actual OAuth
    // Google: window.google.accounts.id.initialize({client_id:"YOUR_GOOGLE_CLIENT_ID",...})
    // GitHub: window.location.href = "https://github.com/login/oauth/authorize?client_id=..."
    // Apple: AppleID.auth.signIn()
    await new Promise(r=>setTimeout(r,1200));
    onAuth({name:`${provider} Kullanıcısı`,email:`user@${provider.toLowerCase()}.com`,provider});
    setLoading(false);
  };

  const handleEmail=async(e)=>{
    e.preventDefault();setLoading(true);
    await new Promise(r=>setTimeout(r,800));
    if(mode==="forgot"){setMsg("Şifre sıfırlama bağlantısı gönderildi!");setLoading(false);return;}
    onAuth({name:name||email.split("@")[0],email,provider:"email"});
    setLoading(false);
  };

  return(
    <div style={{position:"fixed",inset:0,zIndex:90,background:"var(--overlay)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",padding:16,animation:"fadeIn .2s ease"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"var(--surface)",backdropFilter:"blur(20px)",border:"1px solid var(--border)",borderRadius:20,maxWidth:400,width:"100%",boxShadow:"var(--shadow)",animation:"slideUp .25s ease"}}>
        <div style={{padding:"18px 20px",borderBottom:"1px solid var(--border-s)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontWeight:900,fontSize:17,color:"var(--text)"}}>
            {mode==="login"?"🔐 Giriş Yap":mode==="register"?"✨ Kayıt Ol":"🔑 Şifremi Unuttum"}
          </div>
          <button onClick={onClose} style={{width:34,height:34,borderRadius:9,border:"1px solid var(--border)",background:"var(--surface2)",color:"var(--text)",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
        <div style={{padding:"18px 20px",display:"grid",gap:12}}>
          {/* Provider buttons */}
          {mode!=="forgot"&&(
            <div style={{display:"grid",gap:8}}>
              {[
                {id:"Google",icon:"🔵",label:"Google ile Giriş",c:"#4285F4"},
                {id:"GitHub",icon:"⚫",label:"GitHub ile Giriş",c:"#333"},
                {id:"Apple",icon:"🍎",label:"Apple ile Giriş",c:"#000"},
              ].map(p=>(
                <button key={p.id} onClick={()=>handleProvider(p.id)} disabled={loading}
                  style={{width:"100%",padding:"11px",borderRadius:11,border:"1px solid var(--border)",background:`linear-gradient(135deg,${p.c}18,${p.c}08)`,color:"var(--text)",fontFamily:"inherit",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:9}}>
                  <span style={{fontSize:18}}>{p.icon}</span>{loading?"Bağlanıyor...":p.label}
                </button>
              ))}
              <div style={{display:"flex",alignItems:"center",gap:10,color:"var(--muted)",fontSize:12}}>
                <div style={{flex:1,height:1,background:"var(--border-s)"}}/>veya e-posta ile<div style={{flex:1,height:1,background:"var(--border-s)"}}/>
              </div>
            </div>
          )}
          {/* Email form */}
          <form onSubmit={handleEmail} style={{display:"grid",gap:9}}>
            {mode==="register"&&<Inp value={name} onChange={setName} placeholder="Adınız"/>}
            <Inp value={email} onChange={setEmail} placeholder="E-posta adresi" type="email"/>
            {mode!=="forgot"&&<Inp value={pass} onChange={setPass} placeholder="Şifre" type="password"/>}
            {msg&&<div style={{fontSize:12,color:"var(--green)",fontWeight:600}}>{msg}</div>}
            <Btn tone="purple" full onClick={handleEmail}>
              {loading?"İşleniyor...":mode==="login"?"Giriş Yap":mode==="register"?"Kayıt Ol":"Sıfırlama Linki Gönder"}
            </Btn>
          </form>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"var(--muted)"}}>
            {mode==="login"&&<><button onClick={()=>setMode("register")} style={{background:"none",border:"none",color:"var(--blue)",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>Hesap oluştur</button><button onClick={()=>setMode("forgot")} style={{background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>Şifremi unuttum</button></>}
            {mode!=="login"&&<button onClick={()=>setMode("login")} style={{background:"none",border:"none",color:"var(--blue)",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>Giriş yap</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   § SUBSCRIPTION / PAYMENT MODAL — Stripe entegrasyonlu
   ═══════════════════════════════════════════════════════════════════ */
function SubscriptionModal({onClose,user}){
  const[step,setStep]=useState("plans");// plans | payment | success
  const[selectedPlan,setSelectedPlan]=useState(null);
  const[cardNum,setCardNum]=useState("");const[expiry,setExpiry]=useState("");
  const[cvc,setCvc]=useState("");const[cardName,setCardName]=useState("");
  const[loading,setLoading]=useState(false);

  const formatCard=(v)=>v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
  const formatExpiry=(v)=>{const d=v.replace(/\D/g,"").slice(0,4);return d.length>2?d.slice(0,2)+"/"+d.slice(2):d;};

  const handlePay=async(e)=>{
    e.preventDefault();setLoading(true);
    // TODO: Replace with actual Stripe:
    // const stripe = await loadStripe("pk_live_YOUR_STRIPE_PUBLISHABLE_KEY");
    // const response = await fetch("/api/create-payment-intent", {method:"POST",body:JSON.stringify({plan:selectedPlan.id})});
    // const {clientSecret} = await response.json();
    // const {error} = await stripe.confirmCardPayment(clientSecret, {payment_method:{card:elements.getElement(CardElement)}});
    await new Promise(r=>setTimeout(r,1800));
    setStep("success");setLoading(false);
  };

  const plan=PLANS.find(p=>p.id===selectedPlan?.id);

  return(
    <div style={{position:"fixed",inset:0,zIndex:90,background:"var(--overlay)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",padding:16,animation:"fadeIn .2s ease"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"var(--surface)",backdropFilter:"blur(20px)",border:"1px solid var(--border)",borderRadius:20,maxWidth:540,width:"100%",maxHeight:"92vh",overflowY:"auto",boxShadow:"var(--shadow)",animation:"slideUp .25s ease"}}>
        {/* Header */}
        <div style={{padding:"16px 20px",borderBottom:"1px solid var(--border-s)",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:"var(--surface)",backdropFilter:"blur(20px)",zIndex:1}}>
          <div style={{fontWeight:900,fontSize:17,color:"var(--text)"}}>
            {step==="plans"?"⭐ Premium Planlar":step==="payment"?"💳 Ödeme":step==="success"?"🎉 Başarılı!":""}
          </div>
          <button onClick={onClose} style={{width:34,height:34,borderRadius:9,border:"1px solid var(--border)",background:"var(--surface2)",color:"var(--text)",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>

        {step==="plans"&&(
          <div style={{padding:"16px 20px",display:"grid",gap:13}}>
            {PLANS.map(p=>(
              <div key={p.id} style={{border:`1px solid ${p.highlight?"var(--purple)":"var(--border)"}`,borderRadius:14,overflow:"hidden",background:p.highlight?"var(--purple-bg)":"var(--surface2)",backdropFilter:"blur(8px)",animation:"fadeInUp .3s ease"}}>
                <div style={{padding:"13px 16px",borderBottom:"1px solid var(--border-s)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:7}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontWeight:900,fontSize:15,color:p.color}}>{p.name}</span>
                    {p.tag&&<Badge tone="purple">{p.tag}</Badge>}
                  </div>
                  <div><span style={{fontSize:20,fontWeight:900,color:p.color}}>{p.priceStr}</span><span style={{fontSize:12,color:"var(--muted)",marginLeft:4}}>{p.period}</span></div>
                </div>
                <div style={{padding:"12px 16px",display:"grid",gap:5}}>
                  {p.features.map(f=><div key={f} style={{display:"flex",alignItems:"flex-start",gap:7,fontSize:13,color:"var(--text)"}}><span style={{color:"var(--green)",flexShrink:0,marginTop:1}}>✓</span><span style={{lineHeight:1.5}}>{f}</span></div>)}
                  <button onClick={()=>{if(!p.disabled){setSelectedPlan(p);setStep("payment");}}} disabled={p.disabled}
                    style={{marginTop:8,width:"100%",padding:"10px",borderRadius:10,border:`1px solid ${p.color}`,background:p.disabled?"var(--surface3)":p.color,color:p.disabled?"var(--muted)":p.id==="monthly"?"#fff":"#000",fontFamily:"inherit",fontWeight:800,fontSize:14,cursor:p.disabled?"default":"pointer"}}>
                    {p.cta}
                  </button>
                </div>
              </div>
            ))}
            {/* Payment methods */}
            <div style={{borderTop:"1px solid var(--border-s)",paddingTop:12,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",justifyContent:"center"}}>
              <div style={{fontSize:11,color:"var(--muted)",fontWeight:600}}>Desteklenen ödeme yöntemleri:</div>
              {["💳 Visa","💳 Mastercard","🅿 PayPal","🏦 IBAN (Havale)","🍎 Apple Pay","🔵 Google Pay"].map(m=><span key={m} style={{fontSize:12,background:"var(--surface3)",border:"1px solid var(--border-s)",borderRadius:6,padding:"3px 8px",color:"var(--muted)"}}>{m}</span>)}
            </div>
          </div>
        )}

        {step==="payment"&&plan&&(
          <div style={{padding:"16px 20px"}}>
            <div style={{background:"var(--purple-bg)",border:"1px solid var(--purple)",borderRadius:12,padding:"11px 14px",marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontWeight:800,color:"var(--purple)"}}>{plan.name}</div>
              <div style={{fontWeight:900,fontSize:18,color:"var(--purple)"}}>{plan.priceStr}</div>
            </div>
            <form onSubmit={handlePay} style={{display:"grid",gap:12}}>
              <div>
                <div style={{fontSize:12,color:"var(--muted)",fontWeight:600,marginBottom:5}}>Kart Sahibi</div>
                <Inp value={cardName} onChange={setCardName} placeholder="Ad Soyad"/>
              </div>
              <div>
                <div style={{fontSize:12,color:"var(--muted)",fontWeight:600,marginBottom:5}}>Kart Numarası</div>
                <Inp value={cardNum} onChange={v=>setCardNum(formatCard(v))} placeholder="0000 0000 0000 0000"/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div>
                  <div style={{fontSize:12,color:"var(--muted)",fontWeight:600,marginBottom:5}}>Son Kullanma</div>
                  <Inp value={expiry} onChange={v=>setExpiry(formatExpiry(v))} placeholder="AA/YY"/>
                </div>
                <div>
                  <div style={{fontSize:12,color:"var(--muted)",fontWeight:600,marginBottom:5}}>CVC</div>
                  <Inp value={cvc} onChange={v=>setCvc(v.replace(/\D/g,"").slice(0,3))} placeholder="000"/>
                </div>
              </div>
              <div style={{fontSize:11,color:"var(--muted)",lineHeight:1.6,padding:"9px 11px",background:"var(--surface3)",borderRadius:9}}>
                🔒 256-bit SSL şifreleme ile korunmaktadır. Kart bilgileriniz Stripe güvenli vault'unda saklanır. Bizim sunucularımıza iletilmez.
              </div>
              <div style={{display:"flex",gap:8}}>
                <Btn tone="neutral" onClick={()=>setStep("plans")}>← Geri</Btn>
                <button type="submit" disabled={loading} style={{flex:1,padding:"12px",borderRadius:11,border:"none",background:loading?"var(--surface3)":"linear-gradient(135deg,var(--purple),var(--blue))",color:"#fff",fontFamily:"inherit",fontWeight:800,fontSize:14,cursor:loading?"default":"pointer"}}>
                  {loading?"Ödeme işleniyor...":"Ödemeyi Tamamla →"}
                </button>
              </div>
            </form>
          </div>
        )}

        {step==="success"&&(
          <div style={{padding:"36px 20px",textAlign:"center"}}>
            <div style={{fontSize:64,marginBottom:16,animation:"bounce .5s ease"}}>🎉</div>
            <div style={{fontWeight:900,fontSize:20,color:"var(--green)",marginBottom:8}}>Premium aktif!</div>
            <div style={{fontSize:13,color:"var(--muted)",marginBottom:20}}>Tebrikler! {plan?.name||""} planınız başarıyla aktifleştirildi.</div>
            <Btn tone="green" onClick={onClose} full>Harika, devam edelim!</Btn>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   § HAMBURGEr MENU — sağdan kayar panel
   ═══════════════════════════════════════════════════════════════════ */
function HamburgerPanel({open,onClose,tab,setTab}){
  const MENU=[
    {key:"overview",   icon:"✨",label:"Genel Bakış"},
    {key:"barcodes",   icon:"🔍",label:"Barkod Tarayıcı"},
    {key:"enumbers",   icon:"🧪",label:"E-Kodu Rehberi"},
    {key:"israeli",    icon:"🇮🇱",label:"İsrail Markaları"},
    {key:"alternatives",icon:"✅",label:"Alternatifler"},
    {key:"products",   icon:"🌍",label:"Global Markalar"},
  ];
  return(
    <>
      {/* Backdrop */}
      {open&&<div onClick={onClose} style={{position:"fixed",inset:0,zIndex:45,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(4px)",animation:"fadeIn .2s ease"}}/>}
      {/* Panel */}
      <div style={{position:"fixed",top:0,right:0,bottom:0,zIndex:46,width:280,background:"var(--surface)",backdropFilter:"blur(24px)",border:"1px solid var(--border)",borderRight:"none",borderRadius:"20px 0 0 20px",display:"flex",flexDirection:"column",transform:open?"translateX(0)":"translateX(100%)",transition:"transform .28s cubic-bezier(.4,0,.2,1)",boxShadow:open?"var(--shadow)":"none"}}>
        <div style={{padding:"18px 16px 12px",borderBottom:"1px solid var(--border-s)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontWeight:900,fontSize:14,color:"var(--gold)",letterSpacing:2,textTransform:"uppercase"}}>Menü</div>
          <button onClick={onClose} style={{width:32,height:32,borderRadius:8,border:"1px solid var(--border)",background:"var(--surface2)",color:"var(--text)",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"10px 10px"}}>
          {MENU.map((item,i)=>(
            <button key={item.key} onClick={()=>{setTab(item.key);onClose();}}
              style={{width:"100%",display:"flex",alignItems:"center",gap:13,padding:"13px 14px",borderRadius:12,border:`1px solid ${tab===item.key?"var(--border)":"transparent"}`,background:tab===item.key?"var(--surface2)":"transparent",color:tab===item.key?"var(--text)":"var(--muted)",fontFamily:"inherit",fontSize:15,fontWeight:tab===item.key?800:600,cursor:"pointer",textAlign:"left",marginBottom:3,animation:`fadeInRight .2s ease ${i*0.04}s both`,transition:"background .15s,color .15s"}}>
              <span style={{fontSize:22,flexShrink:0}}>{item.icon}</span>
              <span>{item.label}</span>
              {tab===item.key&&<div style={{marginLeft:"auto",width:6,height:6,borderRadius:99,background:"var(--gold)"}}/>}
            </button>
          ))}
        </div>
        <div style={{padding:"12px 16px",borderTop:"1px solid var(--border-s)",fontSize:11,color:"var(--muted)",textAlign:"center"}}>
          Barkod Rehberi & Alternatif Merkezi v3.0
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   § FOOTER — Ödeme yöntemleri
   ═══════════════════════════════════════════════════════════════════ */
function Footer(){
  return(
    <footer style={{background:"var(--surface)",backdropFilter:"blur(16px)",borderTop:"1px solid var(--border-s)",padding:"14px 20px"}}>
      <div style={{maxWidth:1000,margin:"0 auto",display:"flex",flexDirection:"column",gap:10,alignItems:"center"}}>
        <div style={{fontSize:11,color:"var(--muted)",fontWeight:600,textTransform:"uppercase",letterSpacing:1}}>Desteklenen Ödeme Yöntemleri</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center"}}>
          {[
            {l:"💳 Visa",c:"#1A1F71"},
            {l:"💳 Mastercard",c:"#EB001B"},
            {l:"🅿 PayPal",c:"#003087"},
            {l:"🍎 Apple Pay",c:"#000"},
            {l:"🔵 Google Pay",c:"#4285F4"},
            {l:"🏦 IBAN / EFT",c:"var(--muted)"},
            {l:"⚡ Stripe",c:"#635BFF"},
          ].map(m=>(
            <div key={m.l} style={{display:"flex",alignItems:"center",gap:5,padding:"5px 10px",borderRadius:8,border:"1px solid var(--border-s)",background:"var(--surface2)",fontSize:12,color:"var(--text)",fontWeight:600}}>
              {m.l}
            </div>
          ))}
        </div>
        <div style={{fontSize:10,color:"var(--muted)",textAlign:"center"}}>
          🔒 Stripe ile güvenli ödeme · SSL/TLS şifreleme · GS1 Global Registry · BDS Movement Verileri
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   § ANA COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
export default function BarcodeGuide(){
  const[bgA,setBgA]=useState(PAL_G[0]);
  const[bgB,setBgB]=useState(PAL_G[1]);
  const[active,setActive]=useState("A");
  const[ripples,setRipples]=useState([]);
  const[theme,setTheme]=useState("dark");
  const[themeMode,setThemeMode]=useState("auto");
  const[tab,setTab]=useState("overview");
  const[menuOpen,setMenuOpen]=useState(false);
  const[showScanner,setShowScanner]=useState(false);
  const[showAuth,setShowAuth]=useState(false);
  const[showSub,setShowSub]=useState(false);
  const[user,setUser]=useState(null);
  const[countryQ,setCountryQ]=useState("");
  const[barcodeQ,setBarcodeQ]=useState("");
  const[eQ,setEQ]=useState("");
  const[eSafetyF,setESafetyF]=useState("all");
  const[expandedBrand,setExpandedBrand]=useState(null);
  const[isMobile,setIsMobile]=useState(false);
  const clickCount=useRef(0);

  // Sistem teması
  useEffect(()=>{
    const mq=window.matchMedia("(prefers-color-scheme: dark)");
    const apply=()=>{if(themeMode==="auto")setTheme(mq.matches?"dark":"light");else setTheme(themeMode);};
    apply();mq.addEventListener("change",apply);return()=>mq.removeEventListener("change",apply);
  },[themeMode]);
  useEffect(()=>{const fn=()=>setIsMobile(window.innerWidth<640);fn();window.addEventListener("resize",fn);return()=>window.removeEventListener("resize",fn);},[]);

  // Palestine gradient + ripple
  const handleClick=useCallback((e)=>{
    clickCount.current++;
    const idx=Math.floor(Math.random()*PAL_G.length);
    const next=PAL_G[idx];
    if(active==="A"){setBgB(next);setActive("B");}else{setBgA(next);setActive("A");}
    // Ripple at click position
    const id=Date.now();
    const x=e.clientX,y=e.clientY;
    const col=["#CE1126","#009736","#000000","#ffffff44"][idx%4];
    setRipples(r=>[...r,{id,x,y,col}]);
    setTimeout(()=>setRipples(r=>r.filter(rr=>rr.id!==id)),900);
  },[active]);

  const themeVars=THEME[theme];
  const digits=barcodeQ.replace(/\D/g,"");
  const barcodeMatch=matchCountry(digits.length>=3?+digits.slice(0,3):null);

  const filteredCountries=useMemo(()=>{const q=norm(countryQ);return COUNTRIES.filter(c=>!q||norm(c.name).includes(q)||c.prefix.includes(countryQ.trim()));},[countryQ]);
  const filteredE=useMemo(()=>{const q=norm(eQ);return Object.entries(E_DB).filter(([code,e])=>{const ps=!q||norm(code).includes(q)||norm(e.n).includes(q)||norm(e.tr).includes(q);const pf=eSafetyF==="all"||e.s===eSafetyF;return ps&&pf;});},[eQ,eSafetyF]);

  const shell={...themeVars,minHeight:"100vh",color:"var(--text)",fontFamily:"'DM Sans','Segoe UI',system-ui,sans-serif",transition:"color .3s",position:"relative"};

  return(
    <div style={shell} onClickCapture={handleClick}>
      {/* Palestine gradient layers */}
      <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:bgA,opacity:active==="A"?1:0,transition:"opacity .8s ease"}}/>
        <div style={{position:"absolute",inset:0,background:bgB,opacity:active==="B"?1:0,transition:"opacity .8s ease"}}/>
        {/* Floating particles */}
        {[...Array(12)].map((_,i)=>(
          <div key={i} style={{position:"absolute",width:i%3===0?8:i%3===1?5:3,height:i%3===0?8:i%3===1?5:3,borderRadius:"50%",background:["#CE112644","#00973644","#ffffff22","#00000033"][i%4],left:`${7+i*8}%`,top:`${5+i*7}%`,animation:`float${i%3} ${4+i%4}s ease-in-out infinite`,animationDelay:`${i*0.3}s`}}/>
        ))}
        {/* Click ripples */}
        {ripples.map(r=>(
          <div key={r.id} style={{position:"fixed",left:r.x,top:r.y,width:0,height:0,pointerEvents:"none",zIndex:1}}>
            <div style={{position:"absolute",transform:"translate(-50%,-50%)",width:300,height:300,borderRadius:"50%",background:`radial-gradient(circle,${r.col}55 0%,transparent 70%)`,animation:"rippleOut .9s ease-out forwards"}}/>
          </div>
        ))}
      </div>

      <PDFRoot/>
      {showScanner&&<ScannerModal onClose={()=>setShowScanner(false)}/>}
      {showAuth&&<AuthModal onClose={()=>setShowAuth(false)} onAuth={(u)=>{setUser(u);setShowAuth(false);}}/>}
      {showSub&&<SubscriptionModal onClose={()=>setShowSub(false)} user={user}/>}
      <HamburgerPanel open={menuOpen} onClose={()=>setMenuOpen(false)} tab={tab} setTab={setTab}/>

      {/* ── HEADER ── */}
      <header style={{position:"sticky",top:0,zIndex:40,backdropFilter:"blur(20px)",backgroundColor:"var(--header)",borderBottom:"1px solid var(--border-s)",transition:"background-color .3s",animation:"headerGlow 4s ease infinite"}}>
        <div style={{maxWidth:1000,margin:"0 auto",padding:isMobile?"11px 13px":"12px 20px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
            <div>
              <div style={{fontSize:9,fontWeight:800,letterSpacing:3,textTransform:"uppercase",color:"var(--gold)",marginBottom:2,animation:"fadeIn .5s ease"}}>GS1 PREFIX EXPLORER</div>
              <h1 style={{margin:0,fontSize:isMobile?17:24,fontWeight:900,lineHeight:1.1,letterSpacing:-.8,color:"var(--text)",animation:"slideDown .4s ease"}}>
                Barkod Rehberi <span style={{color:"var(--gold)"}}>& Alternatif Merkezi</span>
              </h1>
            </div>
            <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
              {/* 📷 Tarayıcı */}
              <button onClick={e=>{e.stopPropagation();setShowScanner(true);}} style={{display:"flex",alignItems:"center",gap:5,padding:"0 12px",height:36,borderRadius:10,border:"1px solid var(--cyan)",background:"var(--cyan-bg)",color:"var(--cyan)",fontFamily:"inherit",fontSize:12,fontWeight:800,cursor:"pointer"}}>
                📷{!isMobile&&" Tara"}
              </button>
              {/* ⭐ Premium */}
              <button onClick={e=>{e.stopPropagation();setShowSub(true);}} style={{display:"flex",alignItems:"center",gap:5,padding:"0 12px",height:36,borderRadius:10,background:"var(--purple-bg)",border:"1px solid var(--purple)",color:"var(--purple)",fontFamily:"inherit",fontSize:12,fontWeight:800,cursor:"pointer"}}>
                ⭐{!isMobile&&" Premium"}
              </button>
              {/* Auth */}
              {user?(
                <button onClick={e=>{e.stopPropagation();setUser(null);}} style={{display:"flex",alignItems:"center",gap:5,padding:"0 10px",height:36,borderRadius:10,border:"1px solid var(--border)",background:"var(--surface2)",color:"var(--text)",fontFamily:"inherit",fontSize:12,fontWeight:700,cursor:"pointer"}}>
                  👤{!isMobile&&` ${user.name.split(" ")[0]}`}
                </button>
              ):(
                <button onClick={e=>{e.stopPropagation();setShowAuth(true);}} style={{display:"flex",alignItems:"center",gap:5,padding:"0 10px",height:36,borderRadius:10,border:"1px solid var(--border)",background:"var(--surface2)",color:"var(--muted)",fontFamily:"inherit",fontSize:12,fontWeight:700,cursor:"pointer"}}>
                  🔐{!isMobile&&" Giriş"}
                </button>
              )}
              {/* Tema toggle */}
              <button onClick={e=>{e.stopPropagation();setThemeMode(m=>m==="auto"?"dark":m==="dark"?"light":"auto");}} title="Tema değiştir" style={{width:36,height:36,borderRadius:10,border:"1px solid var(--border)",background:"var(--surface2)",color:"var(--text)",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                {themeMode==="auto"?"🔄":theme==="dark"?"☀️":"🌙"}
              </button>
              {/* ☰ Hamburger */}
              <button onClick={e=>{e.stopPropagation();setMenuOpen(true);}} style={{width:36,height:36,borderRadius:10,border:"1px solid var(--border)",background:"var(--surface2)",color:"var(--text)",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:5,padding:"8px"}}>
                <div style={{width:18,height:2,background:"var(--text)",borderRadius:2}}/>
                <div style={{width:18,height:2,background:"var(--text)",borderRadius:2}}/>
                <div style={{width:18,height:2,background:"var(--text)",borderRadius:2}}/>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── İÇERİK ── */}
      <main style={{maxWidth:1000,margin:"0 auto",padding:isMobile?"16px 13px 30px":"20px 20px 40px",position:"relative",zIndex:1}}>

        {/* ════ OVERVIEW ════ */}
        {tab==="overview"&&(
          <div style={{display:"grid",gap:16,animation:"fadeInUp .35s ease"}}>
            <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)",gap:11}}>
              {[
                {label:"GS1 Ülke",value:COUNTRIES.length,tone:"blue"},
                {label:"E-Kodu",value:Object.keys(E_DB).length,tone:"cyan"},
                {label:"İsrail Markası",value:"15+",tone:"red"},
                {label:"Alternatif",value:"200+",tone:"green"},
              ].map((m,i)=>(
                <Card key={m.label} style={{padding:"14px 16px",animation:`fadeInUp .3s ease ${i*0.07}s both`,cursor:"default"}} className="card-hover">
                  <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:.5,color:"var(--muted)",marginBottom:8}}>{m.label}</div>
                  <div style={{fontSize:30,fontWeight:900,color:`var(--${m.tone})`,animation:`metricCount .5s ease ${i*0.1}s both`}}>{m.value}</div>
                </Card>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(3,1fr)",gap:13}}>
              {[
                {icon:"📷",title:"Barkod Tarayıcı",text:"Kamerayla ürün ülkesi ve E-kodunu sorgula.",action:()=>setShowScanner(true),tone:"cyan"},
                {icon:"🧪",title:"E-Kodu Rehberi",text:"200+ gıda katkısı — güvenlik ve uyarılar.",action:()=>setTab("enumbers"),tone:"purple"},
                {icon:"✅",title:"Alternatifler",text:"Boykot markalara bağımsız alternatifler bul.",action:()=>setTab("alternatives"),tone:"green"},
              ].map((c,i)=>(
                <Card key={c.title} style={{padding:18,cursor:"pointer",animation:`fadeInUp .3s ease ${i*0.1}s both`}} onClick={e=>{e.stopPropagation();c.action();}}>
                  <div style={{fontSize:28,marginBottom:10}}>{c.icon}</div>
                  <div style={{fontWeight:800,fontSize:15,color:"var(--text)",marginBottom:6}}>{c.title}</div>
                  <div style={{fontSize:12,color:"var(--muted)",lineHeight:1.65,marginBottom:12}}>{c.text}</div>
                  <div style={{fontSize:12,fontWeight:700,color:`var(--${c.tone})`}}>Görüntüle →</div>
                </Card>
              ))}
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <Btn tone="green" icon="⬇" onClick={doCSV}>CSV İndir</Btn>
              <Btn tone="blue" icon="🖨" onClick={doPDF}>PDF Yazdır</Btn>
            </div>
          </div>
        )}

        {/* ════ BARCODES ════ */}
        {tab==="barcodes"&&(
          <div style={{display:"grid",gap:14,animation:"fadeInUp .35s ease"}}>
            <Card style={{padding:16}}>
              <div style={{fontWeight:800,fontSize:14,color:"var(--text)",marginBottom:9}}>🔍 Anlık Barkod Çözümleyici</div>
              <Inp value={barcodeQ} onChange={setBarcodeQ} placeholder="EAN-13 barkod numarası gir (min 3 hane)..." autoFocus/>
              {digits.length>=3&&(
                <div style={{marginTop:11,padding:"13px 14px",borderRadius:11,background:barcodeMatch?"var(--green-bg)":"var(--red-bg)",border:`1px solid ${barcodeMatch?"var(--green)":"var(--red)"}`,display:"flex",alignItems:"center",gap:12,flexWrap:"wrap",animation:"fadeIn .2s ease"}}>
                  {barcodeMatch?<><span style={{fontSize:26}}>{barcodeMatch.flag}</span><div><div style={{fontWeight:900,fontSize:17,color:"var(--text)"}}>{barcodeMatch.name}</div><div style={{fontSize:12,color:"var(--muted)"}}>GS1 Prefix: {barcodeMatch.prefix}</div></div>{barcodeMatch.highlight&&<Badge tone="red">🇮🇱 İsrail ürünü!</Badge>}</> :<div style={{color:"var(--red)",fontWeight:700}}>⚠ Tanımlanamadı</div>}
                </div>
              )}
            </Card>
            <Card style={{padding:14}}>
              <Inp value={countryQ} onChange={setCountryQ} placeholder="Ülke adı veya GS1 kodu ara..."/>
              {!countryQ&&<div style={{background:"var(--gold-bg)",border:"1.5px solid var(--gold)",borderRadius:12,padding:"11px 14px",marginTop:10,marginBottom:5,display:"grid",gridTemplateColumns:"auto 1fr auto",gap:12,alignItems:"center"}}><span style={{fontSize:22}}>🇮🇱</span><div><div style={{fontSize:10,color:"var(--gold)",fontWeight:800,letterSpacing:2,textTransform:"uppercase"}}>Öncelikli — Boykot</div><div style={{fontWeight:800,fontSize:14,color:"var(--text)"}}>İsrail</div></div><div style={{fontFamily:"monospace",fontSize:18,fontWeight:900,color:"var(--gold)"}}>729</div></div>}
              <div style={{display:"grid",gap:3,maxHeight:440,overflowY:"auto",marginTop:8}}>
                {filteredCountries.filter(c=>!c.highlight||countryQ).map(c=>(
                  <div key={c.prefix} style={{background:"var(--surface2)",border:"1px solid var(--border-s)",borderRadius:9,padding:"8px 12px",display:"grid",gridTemplateColumns:"auto 1fr auto",gap:11,alignItems:"center"}}>
                    <span style={{fontSize:18}}>{c.flag}</span>
                    <span style={{fontSize:13,fontWeight:600,color:"var(--text)"}}>{c.name}</span>
                    <span style={{fontFamily:"monospace",fontSize:12,color:"var(--gold)",fontWeight:700}}>{c.prefix}</span>
                  </div>
                ))}
              </div>
              <div style={{fontSize:10,color:"var(--muted)",textAlign:"center",marginTop:10}}>Kaynak: GS1 Global Registry — gs1.org</div>
            </Card>
          </div>
        )}

        {/* ════ E-NUMBERS ════ */}
        {tab==="enumbers"&&(
          <div style={{display:"grid",gap:12,animation:"fadeInUp .35s ease"}}>
            <div style={{background:"var(--cyan-bg)",border:"1px solid var(--cyan)",borderRadius:12,padding:"11px 14px",fontSize:13,color:"var(--text)",lineHeight:1.7}}>
              🧪 <strong style={{color:"var(--cyan)"}}>E-Kodu Veritabanı</strong> — {Object.keys(E_DB).length} gıda katkısı · Güvenlik · Vegan uygunluğu · Türkçe bilgi
            </div>
            <Card style={{padding:14}}>
              <div style={{display:"grid",gap:9}}>
                <Inp value={eQ} onChange={setEQ} placeholder="E kodu veya madde adı ara (örn: E211, benzoat)..." autoFocus/>
                <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                  {["all","safe","caution","avoid","banned"].map(s=>{
                    const meta={all:{l:"Hepsi",t:"neutral"},safe:{l:"✅ Güvenli",t:"green"},caution:{l:"⚠️ Dikkat",t:"amber"},avoid:{l:"🚫 Kaçın",t:"red"},banned:{l:"⛔ Yasaklı",t:"purple"}}[s];
                    return <Btn key={s} small tone={eSafetyF===s?meta.t:"neutral"} onClick={()=>setESafetyF(s)}>{meta.l}</Btn>;
                  })}
                </div>
              </div>
            </Card>
            <div style={{fontSize:12,color:"var(--muted)",fontWeight:600}}>{filteredE.length} sonuç</div>
            <div style={{display:"grid",gap:6}}>
              {filteredE.map(([code,e],i)=>{const m=safetyMeta(e.s);return(
                <Card key={code} style={{padding:"11px 13px",animation:`fadeInUp .2s ease ${Math.min(i,10)*0.03}s both`}}>
                  <div style={{display:"flex",alignItems:"flex-start",gap:10,flexWrap:"wrap"}}>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,minWidth:54}}>
                      <div style={{fontFamily:"monospace",fontSize:13,fontWeight:900,color:"var(--cyan)",background:"var(--cyan-bg)",border:"1px solid var(--cyan)",borderRadius:7,padding:"2px 7px"}}>{code}</div>
                      <span style={{fontSize:17}}>{m.i}</span>
                    </div>
                    <div style={{flex:1,minWidth:160}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",marginBottom:4}}>
                        <span style={{fontWeight:800,fontSize:13,color:"var(--text)"}}>{e.n}</span>
                        <Badge tone={e.s==="safe"?"green":e.s==="caution"?"amber":e.s==="banned"?"purple":"red"} small>{m.label}</Badge>
                        {e.v===false&&<Badge tone="amber" small>Vegan ✗</Badge>}
                        {e.v===null&&<Badge tone="neutral" small>Kaynak ?</Badge>}
                      </div>
                      <div style={{fontSize:12,color:"var(--muted)",lineHeight:1.6,marginBottom:e.w?4:0}}>{e.tr}</div>
                      {e.w&&<div style={{fontSize:11,color:m.c,fontWeight:700,background:m.bg,border:`1px solid ${m.c}`,borderRadius:6,padding:"3px 8px",display:"inline-block"}}>⚠ {e.w}</div>}
                    </div>
                  </div>
                </Card>
              );})}
            </div>
          </div>
        )}

        {/* ════ İSRAİL ════ */}
        {tab==="israeli"&&(
          <div style={{display:"grid",gap:11,animation:"fadeInUp .35s ease"}}>
            <div style={{background:"var(--red-bg)",border:"1px solid var(--red)",borderRadius:12,padding:"11px 14px",fontSize:13,color:"var(--text)",lineHeight:1.7}}>
              🇮🇱 Barkodu <strong style={{color:"var(--gold)"}}>729</strong> ile başlayan ürünler İsrail menşeilidir.
            </div>
            {[
              {name:"SodaStream",cat:"Ev Aletleri",note:"İsrail kökenli — PepsiCo 3.2 milyar $'a satın aldı"},
              {name:"Osem",cat:"Gıda",note:"Nestlé'nin %60 iştiraki; İsrail'in en büyük gıda şirketi"},
              {name:"Strauss Group",cat:"Gıda & İçecek",note:"Hummus, Elite kahve; boykot listesinde"},
              {name:"Teva Pharmaceuticals",cat:"İlaç",note:"Dünyanın en büyük jenerik ilaç üreticisi"},
              {name:"Ahava",cat:"Kozmetik",note:"Ölü Deniz mineralli kozmetik; Batı Şeria tesisi"},
              {name:"Jafora Tabori",cat:"İçecek",note:"Coca-Cola Israel distribütörü"},
              {name:"Elite (Strauss)",cat:"Gıda",note:"Çikolata, kahve — Strauss Group bünyesinde"},
              {name:"Sabra",cat:"Gıda",note:"Hummus — PepsiCo & Strauss 50/50 JV"},
              {name:"Check Point Software",cat:"Teknoloji",note:"Siber güvenlik; 100.000+ kurumsal müşteri"},
              {name:"Wix",cat:"Teknoloji",note:"Web sitesi platformu; Tel Aviv merkezli"},
              {name:"Fiverr",cat:"Teknoloji",note:"Global freelance platform"},
              {name:"Monday.com",cat:"Teknoloji",note:"İş yönetimi SaaS; Tel Aviv merkezli"},
              {name:"Mobileye",cat:"Teknoloji",note:"Otonom sürüş sistemi; Intel bünyesinde"},
              {name:"Waze",cat:"Teknoloji",note:"Navigasyon; Google bünyesinde"},
              {name:"IronSource (Unity)",cat:"Teknoloji",note:"Oyun monetizasyonu; Unity Software'e satıldı"},
            ].map((b,i)=>(
              <Card key={b.name} style={{padding:"12px 14px",display:"flex",gap:11,alignItems:"flex-start",animation:`fadeInUp .25s ease ${i*0.03}s both`}}>
                <div style={{width:34,height:34,borderRadius:8,background:"var(--red-bg)",border:"1px solid var(--red)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"monospace",fontSize:11,color:"var(--red)",fontWeight:900,flexShrink:0}}>729</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",marginBottom:3}}><span style={{fontWeight:800,fontSize:14,color:"var(--text)"}}>{b.name}</span><Badge tone="red">{b.cat}</Badge></div>
                  <div style={{fontSize:12,color:"var(--muted)",lineHeight:1.55}}>{b.note}</div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* ════ ALTERNATİFLER ════ */}
        {tab==="alternatives"&&(
          <div style={{display:"grid",gap:11,animation:"fadeInUp .35s ease"}}>
            <div style={{background:"var(--green-bg)",border:"1px solid var(--green)",borderRadius:12,padding:"11px 14px",fontSize:13,color:"var(--text)",lineHeight:1.7}}>
              ✅ <strong style={{color:"var(--green)"}}>200+ bağımsız alternatif</strong> — Boykot markalar için yerli ve Avrupa seçenekleri
            </div>
            {[
              {brand:"SodaStream",alts:[{n:"Aarke Carbonator Pro",m:"🇸🇪 İsveç"},{n:"Drinkmate OmniFizz",m:"🇺🇸 ABD"},{n:"Philips ADD4902",m:"🇳🇱 Hollanda"},{n:"Mysoda Woody",m:"🇫🇮 Finlandiya"}]},
              {brand:"Sabra / Hummus",alts:[{n:"Sera Nohut Ezmesi",m:"🇹🇷 Türkiye"},{n:"Al Wadi Hummus",m:"🇱🇧 Lübnan"},{n:"Pınar Labne",m:"🇹🇷 Türkiye"},{n:"Evde yapım",m:"🌍 Evrensel"}]},
              {brand:"Elite / Çikolata & Kahve",alts:[{n:"Ülker Çikolata",m:"🇹🇷 Türkiye"},{n:"Eti Browni",m:"🇹🇷 Türkiye"},{n:"Lindt Excellence",m:"🇨🇭 İsviçre"},{n:"Kurukahveci ME",m:"🇹🇷 Türkiye"},{n:"Lavazza",m:"🇮🇹 İtalya"}]},
              {brand:"Starbucks (boykot)",alts:[{n:"Kahve Dünyası",m:"🇹🇷 Türkiye"},{n:"Costa Coffee",m:"🇬🇧 İngiltere"},{n:"Tchibo",m:"🇩🇪 Almanya"},{n:"Tim Hortons",m:"🇨🇦 Kanada"}]},
              {brand:"McDonald's (boykot)",alts:[{n:"Burger King (TR franchise)",m:"🇹🇷 Türkiye"},{n:"Simit Sarayı",m:"🇹🇷 Türkiye"},{n:"Bun Kasap Burger",m:"🇹🇷 Türkiye"}]},
              {brand:"Puma (BDS / İsrail FA sponsoru)",alts:[{n:"New Balance",m:"🇬🇧 İngiltere"},{n:"Asics",m:"🇯🇵 Japonya"},{n:"Hummel",m:"🇩🇰 Danimarka"},{n:"Kinetix",m:"🇹🇷 Türkiye"}]},
              {brand:"Wix / Web Platformu",alts:[{n:"WordPress.com",m:"🇺🇸 ABD"},{n:"Webflow",m:"🇺🇸 ABD"},{n:"Ghost (açık kaynak)",m:"🇬🇧 İngiltere"}]},
              {brand:"Google/AWS (Nimbus)",alts:[{n:"Hetzner Cloud",m:"🇩🇪 Almanya"},{n:"OVHcloud",m:"🇫🇷 Fransa"},{n:"Proton Mail",m:"🇨🇭 İsviçre"},{n:"DuckDuckGo",m:"🇺🇸 ABD"}]},
              {brand:"HP / HPE (BDS)",alts:[{n:"Lenovo",m:"🇨🇳 Çin"},{n:"Asus",m:"🇹🇼 Tayvan"},{n:"Acer",m:"🇹🇼 Tayvan"}]},
              {brand:"Nestlé (Osem iştiraki)",alts:[{n:"Tchibo Kahve",m:"🇩🇪 Almanya"},{n:"Doğadan Çay",m:"🇹🇷 Türkiye"},{n:"Ülker & Eti",m:"🇹🇷 Türkiye"}]},
            ].map(({brand,alts},i)=>(
              <Card key={brand} style={{padding:"12px 14px",animation:`fadeInUp .25s ease ${i*0.04}s both`}}>
                <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:8}}><Badge tone="red">🇮🇱 Boykot</Badge><span style={{fontWeight:800,fontSize:13,color:"var(--red)"}}>{brand}</span></div>
                <div style={{display:"grid",gap:5}}>
                  {alts.map(a=><div key={a.n} style={{display:"flex",alignItems:"center",gap:8,background:"var(--green-bg)",border:"1px solid var(--green)",borderRadius:8,padding:"7px 11px"}}><span style={{fontWeight:700,fontSize:13,color:"var(--text)",flex:1}}>{a.n}</span><span style={{fontSize:12,color:"var(--green)",fontWeight:600}}>{a.m}</span></div>)}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* ════ GLOBAL MARKALAR — ÜRÜN DETAYI ════ */}
        {tab==="products"&&(
          <div style={{display:"grid",gap:14,animation:"fadeInUp .35s ease"}}>
            <div style={{background:"var(--blue-bg)",border:"1px solid var(--blue)",borderRadius:12,padding:"11px 14px",fontSize:13,color:"var(--text)",lineHeight:1.7}}>
              🌍 <strong style={{color:"var(--blue)"}}>Global Markalar — Kapsamlı Ürün İçerikleri</strong> · Avrupa & küresel segment · Tam içindekiler listesi
            </div>
            {PRODUCTS_DETAIL.map((brand,bi)=>{
              const open=expandedBrand===bi;
              return(
                <Card key={brand.brand} style={{overflow:"hidden",animation:`fadeInUp .3s ease ${bi*0.05}s both`}}>
                  <button onClick={e=>{e.stopPropagation();setExpandedBrand(open?null:bi);}} style={{width:"100%",background:"transparent",border:"none",cursor:"pointer",textAlign:"left"}}>
                    <div style={{padding:"15px 17px",display:"flex",alignItems:"center",gap:13,flexWrap:"wrap",borderBottom:open?"1px solid var(--border-s)":"none"}}>
                      <div style={{width:50,height:50,borderRadius:13,background:brand.color,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{brand.emoji}</div>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:3}}>
                          <span style={{fontWeight:900,fontSize:17,color:"var(--text)"}}>{brand.brand}</span>
                          <Badge tone={brand.status==="boycott"?"red":brand.status==="watch"?"amber":"green"}>{brand.status==="boycott"?"🚫 Boykot":brand.status==="watch"?"👀 Takip":"✅ Bağımsız"}</Badge>
                        </div>
                        <div style={{fontSize:11,color:"var(--muted)"}}>{brand.origin} · {brand.segment} · {brand.revenue} · Kuruluş: {brand.founded}</div>
                      </div>
                      <div style={{fontSize:18,color:"var(--blue)",transform:open?"rotate(90deg)":"none",transition:"transform .2s",flexShrink:0}}>›</div>
                    </div>
                  </button>
                  {open&&(
                    <div style={{padding:"14px 17px 17px"}}>
                      {brand.boycottReason&&<div style={{background:"var(--red-bg)",border:"1px solid var(--red)",borderRadius:10,padding:"9px 12px",fontSize:12,color:"var(--red)",marginBottom:12}}>⚠ Boykot gerekçesi: {brand.boycottReason}</div>}
                      <div style={{fontSize:12,color:"var(--muted)",lineHeight:1.7,marginBottom:14,padding:"9px 12px",background:"var(--surface2)",borderRadius:10}}>{brand.about}</div>
                      <div style={{fontSize:11,fontWeight:800,textTransform:"uppercase",letterSpacing:1,color:"var(--muted)",marginBottom:12}}>📦 Ürün İçerikleri</div>
                      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(2,1fr)",gap:10}}>
                        {brand.products.map(p=>(
                          <div key={p.name} style={{background:"var(--surface2)",border:"1px solid var(--border-s)",borderRadius:12,padding:"12px 14px",display:"flex",flexDirection:"column",gap:8}}>
                            <div style={{display:"flex",alignItems:"center",gap:7}}><span style={{fontSize:22}}>{p.emoji}</span><span style={{fontWeight:800,fontSize:14,color:"var(--text)",lineHeight:1.2}}>{p.name}</span></div>
                            {/* İçindekiler */}
                            <div>
                              <div style={{fontSize:10,fontWeight:800,color:"var(--cyan)",textTransform:"uppercase",letterSpacing:.8,marginBottom:5}}>⚗ İçindekiler</div>
                              <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                                {p.ingredients.map((ing,i)=><span key={i} style={{display:"inline-block",background:"var(--surface3)",border:"1px solid var(--border-s)",borderRadius:5,padding:"2px 6px",fontSize:11,color:"var(--text)"}}>{ing}</span>)}
                              </div>
                            </div>
                            {/* Besin */}
                            {p.nutrition&&<div style={{fontSize:11,color:"var(--gold)",lineHeight:1.5}}>🏷 {p.nutrition}</div>}
                            {/* E-kodları */}
                            {p.additives?.length>0&&<div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{p.additives.map(a=>{const ed=E_DB[a];const m=ed?safetyMeta(ed.s):null;return<span key={a} style={{fontSize:10,fontFamily:"monospace",background:m?m.bg:"var(--surface3)",color:m?m.c:"var(--muted)",border:`1px solid ${m?m.c:"var(--border)"}`,borderRadius:5,padding:"2px 6px"}}>{a}{ed&&` — ${ed.n}`}</span>;})}</div>}
                            {/* Uyarılar */}
                            {p.warn?.length>0&&<div style={{fontSize:11,color:"var(--red)",fontWeight:600}}>⚠ {p.warn.join(" · ")}</div>}
                            {/* Not */}
                            {p.notes&&<div style={{fontSize:11,color:"var(--muted)",borderTop:"1px solid var(--border-s)",paddingTop:7,lineHeight:1.55}}>💡 {p.notes}</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </main>

      <Footer/>

      {/* CSS Animasyonları */}
      <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeInRight { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bounce { 0%,100%{transform:scale(1)} 50%{transform:scale(1.2)} }
        @keyframes scanLine { 0%{top:4px} 100%{top:calc(100% - 6px)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.6} }
        @keyframes rippleOut { 0%{opacity:.7;transform:translate(-50%,-50%) scale(0)} 100%{opacity:0;transform:translate(-50%,-50%) scale(1)} }
        @keyframes float0 { 0%,100%{transform:translateY(0px) rotate(0deg)} 50%{transform:translateY(-20px) rotate(180deg)} }
        @keyframes float1 { 0%,100%{transform:translateY(0px) rotate(0deg)} 50%{transform:translateY(-30px) rotate(-90deg)} }
        @keyframes float2 { 0%,100%{transform:translateY(0px) scale(1)} 50%{transform:translateY(-15px) scale(1.3)} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes glowPulse { 0%,100%{box-shadow:0 0 8px rgba(206,17,38,0.3)} 33%{box-shadow:0 0 16px rgba(0,151,54,0.3)} 66%{box-shadow:0 0 12px rgba(245,198,106,0.3)} }
        @keyframes headerGlow { 0%,100%{border-bottom-color:rgba(206,17,38,0.3)} 50%{border-bottom-color:rgba(0,151,54,0.3)} }
        @keyframes metricCount { from{opacity:0;transform:scale(0.5)} to{opacity:1;transform:scale(1)} }
        .card-hover:hover { transform:translateY(-3px) scale(1.01) !important; transition:transform .2s ease !important; }
        *{box-sizing:border-box;}
        input::placeholder{color:var(--muted);}
        ::-webkit-scrollbar{width:5px;height:5px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:var(--border);border-radius:99px;}
        @media print {
          body>*:not(#pdf-root){display:none!important;}
          #pdf-root{display:block!important;}
          *{color:#000!important;background:#fff!important;}
        }
      `}</style>
    </div>
  );
}

/*
 * ═══════════════════════════════════════════════════════════════════
 * NEXT.JS KULLANIM
 * ═══════════════════════════════════════════════════════════════════
 * App Router → components/BarcodeGuide.jsx olarak kaydet
 *   app/page.jsx:
 *     import BarcodeGuide from "@/components/BarcodeGuide";
 *     export default function Page(){ return <BarcodeGuide/>; }
 *
 * Pages Router → pages/index.jsx:
 *   import dynamic from "next/dynamic";
 *   const BarcodeGuide = dynamic(()=>import("@/components/BarcodeGuide"),{ssr:false});
 *   export default BarcodeGuide;
 * ═══════════════════════════════════════════════════════════════════
 */
