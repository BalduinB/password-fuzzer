import numpy as np
import pandas as pd
import matplotlib.pyplot as pl

data = {
    'Kategorie':  [ "Löschen" , "Großschreibung" , "Einfügen" , "Umkehren" , "Tastatur-Sequenzen" , "Sortierung" , "Leetspeak"  ],
    'notLeaked':  [ 92237 , 62942 , 836652 , 29367 , 11930 , 16584 + 16313 , 137771],
    'leaked'   :  [ 1005 , 784 , 581 , 266 , 86 , 49 + 15 , 22 ],
}
df = pd.DataFrame(data)

fig, (ax, ax2) = plt.subplots(2,1, figsize=(12, 6))

bar_width = 0.35
index = np.arange(len(df['Kategorie']))

bars1 = ax.barh(df["Kategorie"], df['leaked'], bar_width, label='kompromittiert', color='#1f77b4')
ax.set_xlabel("kompromittierte Passwörter",color='blue')

bars2 = ax2.barh(df["Kategorie"], df['notLeaked'], bar_width, label='nicht kompromittiert', color='darkorange')
ax2.set_xlabel("nicht kompromittierte Passwörter",color='darkorange')

plt.tight_layout()
plt.savefig("pics/guesser-pw-origins.png")
# plt.show()
