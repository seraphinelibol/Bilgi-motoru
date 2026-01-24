import os, datetime, textwrap

GIRDI = "girdi"
CIKTI = "cikti"

os.makedirs(CIKTI, exist_ok=True)

def oku_ve_isle():
    metinler = []
    for dosya in os.listdir(GIRDI):
        if dosya.endswith(".txt"):
            with open(os.path.join(GIRDI, dosya), "r", encoding="utf-8") as f:
                metinler.append(f.read().strip())
    return "\n---\n".join(metinler)

icerik = oku_ve_isle()
now = datetime.datetime.now().isoformat()
out_file = f"{CIKTI}/{now}.txt"

with open(out_file, "w", encoding="utf-8") as f:
    f.write(f"Tarih: {now}\n\n")
    f.write(textwrap.fill(icerik, 80))

print("Akıllı çıktı üretildi:", out_file)
