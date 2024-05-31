import numpy as np
import pandas as pd

notLeaked = [ 48281 , 107136 , 222741 , 29376 , 17811 , 14070 + 4491 , 5146, 78630, 99538]
leaked = [ 1028 , 1318 , 597 , 269 , 147 , 51 + 5 , 6, 605, 231]
index = [ "Löschen" , "Großschreibung" , "Einfügen" , "Umkehren" , "Tastatur-Sequenzen" , "Sortierung" , "Leetspeak", "Nummern", "Großschr. & Nummern"  ]
df = pd.DataFrame({'kompromittiert': leaked, 'nicht kompromittiert': notLeaked}, index=index)
ax = df.plot.barh(rot=45, logx=True, figsize=(12, 5), ylabel="Ableitungsvariante", xlabel="Anzahl Passwörter")
fig = ax.get_figure()
fig.savefig("pics/our-pw-origins.png")


