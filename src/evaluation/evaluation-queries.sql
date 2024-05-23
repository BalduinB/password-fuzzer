-- Allgemeine Statistiken nach Fuzzing Methoden
SELECT pw_type, hit, COUNT(*)
FROM
  analysed_data
GROUP BY
  pw_type, hit
ORDER BY
  pw_type;

-- Einzigartige kompromittierte Passörter der Fuzzzing Methoden
SELECT ad.pw_type, ad.email, ad.pw, adj.pw AS originalPassword, adj.id AS originalId
FROM
  analysed_data ad
  JOIN analysed_data adj 
  ON ad.original_version_id = adj.id
WHERE
  ad.hit = 1
  AND ad.pw_type <> "base"
  AND NOT EXISTS (
    SELECT *
    FROM
      analysed_data ade
    WHERE
      ade.original_version_id = ad.original_version_id
      AND ade.pw_type NOT IN("base", ad.pw_type)
      AND ade.pw = ad.pw
  )
ORDER BY
  ad.original_version_id;

-- Einzigartige kompromittierte Passörter von TDT die nur den ersten buchstaben groß haben
SELECT
  count(*)
FROM
  analysed_data ad
  JOIN analysed_data adj ON ad.original_version_id = adj.id
WHERE
  ad.hit = 1
  AND ad.pw_type = "tdt"
  AND BINARY CONCAT(UPPER(LEFT(adj.pw,1)), LOWER(RIGHT(adj.pw, LENGTH(adj.pw) - 1))) = ad.pw
  AND UPPER(LEFT(adj.pw,1)) RLIKE '^[A-Z]'
  AND NOT EXISTS (
    SELECT
      *
    FROM
      analysed_data ade
    WHERE
      ade.original_version_id = ad.original_version_id
      AND ade.pw_type NOT IN("base", ad.pw_type)
      AND ade.pw = ad.pw
  )
ORDER BY
  ad.original_version_id;