# LawBase

**Bazë ligjore personale që punon në xhep, pa internet.**

Një aplikacion i vetëm HTML për të mbajtur, kërkuar dhe punuar me ligje, praktikë gjyqësore, akte nënligjore dhe shënime — i ndërtuar për juristë që u duhen dispozitat në sallë, jo në cloud.

![Version](https://img.shields.io/badge/version-5.3.0-4361ee)
![Offline](https://img.shields.io/badge/offline-po-2dc653)
![Gjuhët](https://img.shields.io/badge/gjuh%C3%ABt-sq%20%C2%B7%20mk%20%C2%B7%20en-lightgrey)

---

## Përmbajtja

- [Çka bën](#çka-bën)
- [Instalimi](#instalimi)
- [Puna pa internet](#puna-pa-internet)
- [Sinkronizimi me Dropbox](#sinkronizimi-me-dropbox)
- [Asistenti AI](#asistenti-ai)
- [Privatësia dhe siguria](#privatësia-dhe-siguria)
- [Përditësimi](#përditësimi)
- [Zgjidhja e problemeve](#zgjidhja-e-problemeve)
- [Teknikisht](#teknikisht)

---

## Çka bën

### Ligjet
Importo nga TXT, DOCX ose PDF, ose ngjit tekstin direkt. Aplikacioni i ndan vetë nenet — në shqip (`Neni 5`), maqedonisht (`Член 5`) dhe anglisht (`Article 5`), përfshirë nenet me shkronjë si `Neni 122a`.

- Skedë për çdo ligj, me renditje me drag & drop
- Kërkim sipas numrit të nenit ose në tekstin e plotë
- Referenca kryqëzuese: numrat e neneve brenda tekstit bëhen lidhje të klikueshme
- Krahasim i dy ligjeve nen për nen, me ndryshimet të ngjyrosura
- Historik versionesh me mundësi rikthimi
- Mënyra e leximit, madhësi teksti e rregullueshme, shënime dhe theksime për nen
- Eksport në PDF

### LegalBase
Baza jote e shënimeve: kategori, tituj, tekst i formatuar, dhe referenca që lidhen drejtpërdrejt me nenet e ligjeve.

### Praktika gjyqësore
Vendime gjyqësore të lidhura me nenet përkatëse — nga neni sheh menjëherë çfarë ka thënë gjykata.

### Aktet nënligjore
Rregullore dhe udhëzime administrative të lidhura me ligjin bazë.

### Kalendari dhe kujtesat
Afate, seanca, dorëzime. Datë dhe orë, shënim, përsëritje ditore deri vjetore, paralajmërim 10 minuta / 1 orë / 1 ditë para. Njoftim brenda aplikacionit dhe njoftim i sistemit.

### Të tjera
Pesë tema (classic, legal, corporate, midnight, soft), secila me mënyrë të çelët dhe të errët. Ndërfaqja në shqip, maqedonisht dhe anglisht. Shkurtore tastiere, tabelë përmbajtjeje, faqeshënues.

---

## Instalimi

### Varianti 1 — nga disku (më i thjeshti)

Shkarko `index.html` dhe hape me dopio-klik. Kaq.

Punon nga USB, nga desktopi, nga çdo dosje. Nuk kërkon server, internet, as instalim. Të dhënat ruhen në shfletues (IndexedDB) dhe mbeten aty.

Kufizimi i vetëm: nga `file://` nuk instalohet dot si aplikacion me ikonë në ekranin kryesor — kjo është kufizim i shfletuesve, jo i aplikacionit.

### Varianti 2 — si aplikacion në telefon ose tablet

Për ikonë në ekranin kryesor dhe ekran të plotë, fajlli duhet të jetë në një adresë **HTTPS**.

**Me GitHub Pages, falas:**

1. Krijo një depo të re (mund të jetë publike ose private me GitHub Pro)
2. Ngarko **të dy** fajllat në rrënjë:
   - `index.html`
   - `sw.js`
3. `Settings` → `Pages` → `Source: Deploy from a branch` → `main` / `root` → `Save`
4. Pas një-dy minutash adresa jote është `https://<përdoruesi>.github.io/<depoja>/`
5. Hape atë adresë **me internet**, pastaj:
   - **Android/Chrome:** menyja ⋮ → *Install app*
   - **iPhone/iPad:** Share (□↑) → *Add to Home Screen*

Alternativa po aq të mira: [Netlify Drop](https://app.netlify.com/drop) (tërhiq dosjen), Cloudflare Pages, ose çdo hosting yti.

> **Të dy fajllat janë të domosdoshëm.** `index.html` është aplikacioni; `sw.js` është ai që e bën të punojë pa internet. Shih më poshtë pse.

---

## Puna pa internet

Pasi ta hapësh një herë me internet, aplikacioni ruhet në pajisje dhe hapet edhe kur nuk ka rrjet — përfshirë pas rifreskimit të faqes.

Kjo është arsyeja pse ekziston `sw.js`. Një aplikacion i instaluar e kërkon `index.html` nga rrjeti sa herë hapet; pa service worker, pa rrjet nuk hapet fare. Shfletuesit e kërkojnë service worker-in si fajll të veçantë — nuk mund të futet brenda `index.html`, dhe këtë e ndalon vetë specifikimi.

`sw.js` nuk përmban asnjë logjikë të aplikacionit. E ngarkon një herë dhe nuk e prek më.

**Si ta kontrollosh:** hap **Cilësimet**. Aty shkruan:

> ✅ **Punon pa internet.** Aplikacioni është ruajtur në pajisje.

Nëse në vend të kësaj del paralajmërim i kuq, `sw.js` mungon në server.

Çka punon offline: leximi, kërkimi, shënimet, praktika gjyqësore, aktet nënligjore, kalendari, eksporti. Çka nuk punon: sinkronizimi me Dropbox dhe asistenti AI — të dyja kërkojnë rrjet nga natyra e tyre.

---

## Sinkronizimi me Dropbox

Backup automatik dhe sinkronizim mes pajisjeve.

**Lidhja:**

1. Shko te [dropbox.com/developers/apps](https://www.dropbox.com/developers/apps) → *Create app*
2. Zgjidh **Scoped access** → **App folder** ← *jo* Full Dropbox
3. Te *Permissions* aktivizo: `files.content.write`, `files.content.read`
4. Kopjo **App key** dhe ngjite te Cilësimet → Dropbox

Me *App folder*, aplikacioni sheh vetëm dosjen e vet. Nuk ka akses te asgjë tjetër në Dropbox-in tënd.

**Backup-i bëhet vetëm kur ka ndryshim të vërtetë.** Krahasohet përmbajtja, jo koha. Klikimi i një skede tjetër, hapja e një paneli ose `Ctrl+S` pa redaktim nuk krijojnë backup. Redaktimi i tekstit, shënimi i ri, vendimi i ri, kujtesa e re dhe biseda me AI-në — po.

Kur një pajisje tjetër ka version më të ri, të pyetet një herë çfarë të mbash. Nuk të pyet përsëri për të njëjtën gjë.

---

## Asistenti AI

Pyet me fjalë të thjeshta, përgjigjet vijnë **vetëm** nga dokumentet e tua, me citime të klikueshme që të çojnë te neni.

Kërkimi bëhet lokalisht në pajisje: aplikacioni gjen nenet përkatëse në të gjitha dokumentet dhe vetëm ato ia dërgon modelit. Nëse diçka nuk gjendet, të thotë hapur në vend që ta trillojë.

**Ofruesit e mbështetur** — çelësin e merr ti, direkt prej tyre:

| Ofruesi | Çelësi falas |
|---|---|
| Google Gemini | [aistudio.google.com](https://aistudio.google.com/apikey) |
| Anthropic Claude | [console.anthropic.com](https://console.anthropic.com/) |
| Groq | [console.groq.com](https://console.groq.com/keys) |
| Mistral | [console.mistral.ai](https://console.mistral.ai/) |
| Cerebras | [cloud.cerebras.ai](https://cloud.cerebras.ai/) |
| OpenRouter | [openrouter.ai](https://openrouter.ai/keys) |

Çelësi ruhet vetëm në pajisjen tënde dhe dërgohet vetëm te ofruesi që zgjodhe.

---

## Privatësia dhe siguria

- **Nuk ka server.** Nuk ka llogari, regjistrim, telemetri apo analitikë.
- **Të dhënat rrinë te ti** — IndexedDB në shfletues, plus Dropbox-i yt nëse e lidh.
- **Teksti nga PDF dhe DOCX pastrohet** para se të ruhet, me listë të lejuar tagesh mbi një dokument inert.
- **Content Security Policy** e kufizon aplikacionin te vetëm ato adresa që i duhen.
- Kodi është i hapur — lexoje.

Për çelësat API: ruhen në `localStorage` të pajisjes. Mos e përdor në kompjuter të përbashkët.

---

## Përditësimi

Kur shkarkon një version të ri të `index.html`, ndrysho **rreshtin e parë** të `sw.js`:

```js
const CACHE = 'lawbase-v5.3.1';   // rrite numrin
```

Kjo është ajo që i detyron pajisjet ta marrin versionin e ri. Pa këtë, do të vazhdojnë të hapin versionin e ruajtur.

Kur del një version i ri, te Cilësimet shfaqet butoni **Përditëso**.

Historiku i plotë i versioneve gjendet brenda aplikacionit: **Cilësimet → Historiku i versioneve**.

**Të dhënat nuk humbin gjatë përditësimit** — rrinë në IndexedDB, jo në fajll. Prapëseprapë, bëj një eksport para se të përditësosh.

---

## Zgjidhja e problemeve

<details>
<summary><b>Nuk del butoni i instalimit</b></summary>

- Faqja duhet të jetë në **HTTPS**, jo `file://` dhe jo `http://`
- Provo Chrome ose Edge — Firefox në Android e mbështet ndryshe
- Nëse e ke instaluar më parë dhe e fshive, Chrome e mban në cache: `Settings` → `Privacy` → `Clear browsing data` → zgjidh vetëm faqen tënde
- Hape në Incognito për provë
- Te **Cilësimet** aplikacioni të thotë saktësisht në cilën gjendje je
</details>

<details>
<summary><b>Nuk hapet pa internet</b></summary>

- Kontrollo që `sw.js` është në **të njëjtën dosje** me `index.html`
- Hape një herë **me internet** pas ngarkimit — kjo e ruan në pajisje
- Te Cilësimet duhet të shkruajë *"Punon pa internet"*
- Në `file://` nuk aplikohet — atje punon offline gjithsesi
</details>

<details>
<summary><b>Dropbox-i bën backup pa ndryshim</b></summary>

Nuk duhet të ndodhë më që nga v5.0.0. Hap konsolën dhe shkruaj:

```js
await _lbSyncDebug()
```

Nëse `haNdryshim: false` dhe prapë bëhet backup, kjo është defekt — hape një *issue* me atë output.
</details>

<details>
<summary><b>AI-ja nuk gjen diçka që e di se ekziston</b></summary>

Në konsolë:

```js
await _lbAiDebug('pyetja jote')
// { termat: [...], dokumenteTeSkanuara: 8, dokumenteMePerputhje: 2, ... }
```

Nëse `dokumenteMePerputhje: 0`, kërkimi nuk i kapi termat. Provo me fjalë të tjera nga teksti i ligjit.
</details>

<details>
<summary><b>Humba të dhënat</b></summary>

Pastrimi i të dhënave të shfletuesit e fshin IndexedDB-në. Prandaj:

- Lidh Dropbox-in, ose
- Bëj eksport të rregullt: Cilësimet → *Eksporto*

Restaurimi bëhet nga i njëjti vend.
</details>

---

## Teknikisht

| | |
|---|---|
| Ndërtimi | Asnjë. Pa npm, pa bundler, pa varësi ndërtimi |
| Madhësia | ~682 KB, një fajll |
| Ruajtja | IndexedDB (ligjet, shënimet, praktika, aktet, versionet, kujtesat) |
| Nga jashtë | FontAwesome, pdf.js, mammoth — të tria cache-ohen për offline |
| Mbështetja | Chrome, Edge, Firefox, Safari — desktop dhe mobile |

Kodi është një fajll me qëllim: hapet me dopio-klik, dërgohet me email, kopjohet në USB. Brenda tij moduli i çdo veçorie është i ndarë në scope të vetin, me varësitë e deklaruara përmes një bërthame të përbashkët `LB`.

```js
(function(){ 'use strict';
  var esc = LB.esc, $ = LB.$, uid = LB.uid;   // varësitë, të deklaruara
  // ...
})();
```

---

## Kontribute

*Issues* dhe *pull requests* janë të mirëpritura. Nëse raporton një defekt, ndihmon shumë nëse shton:

- versionin (te Cilësimet, poshtë)
- shfletuesin dhe pajisjen
- outputin e konsolës nëse ka gabime

---

## Licenca

Shto këtu licencën që zgjedh — [MIT](https://choosealicense.com/licenses/mit/) është zgjedhje e zakonshme për projekte si ky.

---

<div align="center">

Ndërtuar për juristë që u duhen ligjet aty ku nuk ka sinjal.

</div>
