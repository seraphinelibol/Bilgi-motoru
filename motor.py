def kategori(dosya):
    if "ai" in dosya: return "AI"
    if "felsefe" in dosya: return "FELSEFE"
    return "GENEL"
import os, datetime, textwrap

GIRDI = "girdi"
CIKTI = "cikti"

os.makedirs(CIKTI, exist_ok=True)

def oku_ve_isle():
    etiketli = []
for dosya in os.listdir(GIRDI):
    if dosya.endswith(".txt"):
        k = kategori(dosya)
        with open(os.path.join(GIRDI,dosya),encoding="utf-8") as f:
            etiketli.append(f"[{k}]\n"+f.read())
icerik = "\n---\n".join(etiketli)

icerik = oku_ve_isle()
now = datetime.datetime.now().isoformat()
out_file = f"{CIKTI}/{now}.txt"

with open(out_file, "w", encoding="utf-8") as f:
    f.write(f"Tarih: {now}\n\n")
    f.write(textwrap.fill(icerik, 80))

print("Akıllı çıktı üretildi:", out_file)
if "kurallar.txt" in os.listdir(GIRDI):
    icerik = "KURALLI METIN:\n" + icerik

if "geri_bildirim.txt" in os.listdir(GIRDI):
    with open(os.path.join(GIRDI,"geri_bildirim.txt"),encoding="utf-8") as f:
        icerik = "EVRIM:\n" + f.read() + "\n---\n" + icerik
for i in range(3):
    with open(f"{CIKTI}/{now}_{i}.txt","w",encoding="utf-8") as f:
        f.write(icerik)
