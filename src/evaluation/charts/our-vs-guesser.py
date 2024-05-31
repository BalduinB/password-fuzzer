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

fig, ax = plt.subplots(figsize=(12, 6))

bar_width = 0.35
index = np.arange(len(df['Kategorie']))

bars1 = plt.bar(index + bar_width, df['leaked'], bar_width, label='kompromittiert')
bars2 = plt.bar(index, df['notLeaked'], bar_width, label='nicht kompromittiert')


plt.ylabel('Änderung in %')
plt.title('Gruppiertes Balkendiagramm mit negativen Werten')
plt.xticks(index + bar_width / 2, df['Kategorie'])
plt.axhline(0, color='black', linewidth=0.8)
plt.legend()

plt.show()
