import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

def change_in_perc(a, b):
    return (b - a) / a * 100

data = {
    'Kategorie':  [ "Löschen" , "Großschreibung" , "Einfügen" , "Umkehren" , "Tastatur-Sequenzen" , "Sortierung" , "Leetspeak"],
    'notLeaked': [ change_in_perc(92188, 48281) , change_in_perc(62942, 107136) , change_in_perc(836652, 222741) , change_in_perc(29367, 29376) , change_in_perc(11930, 17811) , change_in_perc(16416 + 16530,14070 + 4491) , change_in_perc(137771, 5146)],
    'leaked': [ change_in_perc(1002, 1028) , change_in_perc(784, 1318) , change_in_perc(581, 597) , change_in_perc(266, 269) , change_in_perc(86, 147) , change_in_perc(50+ 17, 51 + 5) , change_in_perc(22, 6)]
}

df = pd.DataFrame(data)

fig, ax = plt.subplots(figsize=(10, 6))
ax.tick_params(axis='y', labelsize=14)
ax.tick_params(axis='x', labelsize=13)

bar_width = 0.35
index = np.arange(len(df['Kategorie']))

bars1 = plt.barh(index + bar_width, df['leaked'], bar_width, label='kompromittiert')
bars2 = plt.barh(index, df['notLeaked'], bar_width, label='nicht kompromittiert')


plt.xlabel('Änderung in %', fontsize=16)
plt.yticks(index + bar_width / 2, df['Kategorie'])
plt.axvline(0, color='black', linewidth=0.8)
plt.legend(fontsize=14)
plt.tight_layout()

plt.savefig("pics/our-vs-guesser.png")
# plt.show()
