import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

data = {
    'Kategorie':  [ "Löschen" , "Großschreibung" , "Einfügen" , "Umkehren" , "Tastatur-Sequenzen" , "Sortierung" , "Leetspeak", "Nummern", "Großschr. & Nummern"],
    'notLeaked':  [ 48394 , 69969 , 211078 , 29364 , 18006 , 14028 + 4611 , 6978, 108331, 41180],
    'leaked':[ 958 , 1374 , 802 , 266 , 117 , 50 + 5 , 11, 732, 67],
}
df = pd.DataFrame(data)

fig, (ax, ax2) = plt.subplots(2,1, figsize=(10, 6))

bar_width = 0.35
index = np.arange(len(df['Kategorie']))

bars1 = ax.barh(df["Kategorie"], df['leaked'], bar_width, label='kompromittiert', color='#1f77b4')
ax.set_xlabel("kompromittierte Passwörter",color='#1f77b4')

bars2 = ax2.barh(df["Kategorie"], df['notLeaked'], bar_width, label='nicht kompromittiert', color='darkorange')
ax2.set_xlabel("nicht kompromittierte Passwörter",color='darkorange')

plt.tight_layout()
plt.savefig("pics/our-pw-origins-v2.png")
# plt.show()
