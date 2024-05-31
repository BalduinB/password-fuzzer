import pandas as pd
import matplotlib.pyplot as plt

# Daten erstellen
data1 = {
    'Kategorie': ['A', 'B', 'C', 'D', 'E'],
    'Wert1': [10, -20, 30, -40, 50]
}

data2 = {
    'Kategorie': ['A', 'B', 'C', 'D', 'E'],
    'Wert2': [20, -10, 40, -30, 60]
}

df1 = pd.DataFrame(data1)
df2 = pd.DataFrame(data2)

# Subplots erstellen
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))

# Erstes Balkendiagramm
ax1.bar(df1['Kategorie'], df1['Wert1'], color=['green' if v >= 0 else 'red' for v in df1['Wert1']])
ax1.set_title('Balkendiagramm 1')
ax1.set_xlabel('Kategorie')
ax1.set_ylabel('Wert')
ax1.axhline(0, color='black', linewidth=0.8)

# Zweites Balkendiagramm
ax2.bar(df2['Kategorie'], df2['Wert2'], color=['blue' if v >= 0 else 'orange' for v in df2['Wert2']])
ax2.set_title('Balkendiagramm 2')
ax2.set_xlabel('Kategorie')
ax2.set_ylabel('Wert')
ax2.axhline(0, color='black', linewidth=0.8)

plt.tight_layout()
plt.savefig("pics/test.png")

