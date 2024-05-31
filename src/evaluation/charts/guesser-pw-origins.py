import numpy as np
import pandas as pd

notLeaked = [ 92237 , 62942 , 836652 , 29367 , 11930 , 16584 + 16313 , 137771]
leaked = [ 1005 , 784 , 581 , 266 , 86 , 49 + 15 , 22 ]
index = [ "Löschen" , "Großschreibung" , "Einfügen" , "Umkehren" , "Tastatur-Sequenzen" , "Sortierung" , "Leetspeak"  ]
df = pd.DataFrame({'kompromittiert': leaked, 'nicht kompromittiert': notLeaked}, index=index)
ax = df.plot.barh(rot=45, logx=True, figsize=(11, 5), ylabel="Ableitungsvariante", xlabel="Anzahl Passwörter")
fig = ax.get_figure()
fig.savefig("pics/guesser-pw-origins-h.png")