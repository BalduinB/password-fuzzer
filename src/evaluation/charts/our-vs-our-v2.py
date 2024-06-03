import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

def change_in_perc(a, b):
    return (b - a) / a * 100

data = {
    'Kategorie':  [ "Löschen" , "Großschreibung" , "Einfügen" , "Umkehren" , "Tastatur-Sequenzen" , "Sortierung" , "Leetspeak", "Nummern", "Großschr. & Nummern"],
    'notLeaked': [ change_in_perc(48281, 48394) , change_in_perc(107136, 69969) , change_in_perc(222741,211078) , change_in_perc(29376, 29364) , change_in_perc( 17811, 18006) , change_in_perc(14070 + 4491, 14028 + 4611) , change_in_perc(5146, 6978),change_in_perc(117860, 108331),change_in_perc(60308, 41180)],
    'leaked': [ change_in_perc(1028,958) , change_in_perc(1318,1374) , change_in_perc(581, 802) , change_in_perc(266, 266) , change_in_perc(147,117) , change_in_perc(51 + 5,50 + 5) , change_in_perc(6,11),change_in_perc(773, 732),change_in_perc(63, 67)]
}

df = pd.DataFrame(data)

fig, ax = plt.subplots(figsize=(10, 6))

bar_width = 0.35
index = np.arange(len(df['Kategorie']))

bars1 = plt.barh(index + bar_width, df['leaked'], bar_width, label='kompromittiert')
bars2 = plt.barh(index, df['notLeaked'], bar_width, label='nicht kompromittiert')


plt.xlabel('Änderung in %')
plt.yticks(index + bar_width / 2, df['Kategorie'])
plt.axvline(0, color='black', linewidth=0.8)
plt.legend()
plt.tight_layout()

plt.savefig("pics/our-vs-our-v2.png")
# plt.show()
