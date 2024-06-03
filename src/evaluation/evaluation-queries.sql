-- Allgemeine Statistiken nach Fuzzing Methoden
SELECT version, pw_type, hit, COUNT(*)
FROM
  analysed_data
GROUP BY
  version, pw_type, hit
ORDER BY
  version, pw_type;

-- Anzahl generierter kompr. passwörter, die nicht in der originalen Version kompr. sind
SELECT
  VERSION,
  pw_type,
  COUNT(*)
FROM
  analysed_data
WHERE
  id IN (
    SELECT
      ad.id
    FROM
      analysed_data ad
      JOIN analysed_data adj ON ad.original_version_id = adj.id
    WHERE
      ad.hit = 1
      AND adj.hit = 0
      AND ad.pw_type <> "REMOVED"
  )
GROUP BY
  pw_type,
  VERSION;

-- Anzalh orig. Passwörter für die mit unserer Methode ein kompr. Passwort generiert wurde und mit guesser oder tdt nicht.
-- bzw. andersrum, wenn man die `NOT EXISTS` Bedingung umdreht
SELECT
  ad.version,
  COUNT(*)
FROM
  analysed_data ad
WHERE
  ad.pw_type = "base"
  AND EXISTS (
    SELECT
      *
    FROM
      analysed_data ade
    WHERE
      ade.original_version_id = ad.id
      AND ade.pw_type = "our"
      AND ade.hit = 1
  )
  AND NOT EXISTS (
    SELECT
      *
    FROM
      analysed_data ade
    WHERE
      ade.original_version_id = ad.id
      AND ade.pw_type <> "our"
      AND ade.hit = 1
  )
GROUP BY
  VERSION;


-- Anzahl orig. Passwörter für die mit unseren Fuzzer ein kompr. Passwort generiert wurde.
-- V1 ist unsere v1 Methode, BASE ist unsere v2 Methode
SELECT
  ad.version,
  COUNT(*)
FROM
  analysed_data ad
WHERE
  ad.pw_type = "base"
  AND ad.hit = 0
  AND EXISTS (
    SELECT
      *
    FROM
      analysed_data ade
    WHERE
      ade.original_version_id = ad.id
      AND ade.pw_type = "our"
      AND ade.hit = 1
  )
GROUP BY
  VERSION;


-- Einzigartige kompromittierte Passörter der Fuzzzing Methoden
SELECT
  ad.pw_type,
  ad.version,
  COUNT(*)
FROM
  analysed_data ad
  JOIN analysed_data adj ON ad.original_version_id = adj.id
WHERE
  ad.hit = 1
  AND ad.pw_type <> "base"
  AND ad.version in ("BASE", "V2")
  AND NOT EXISTS (
    SELECT
      *
    FROM
      analysed_data ade
    WHERE
      ade.original_version_id = ad.original_version_id
      AND ade.pw_type NOT IN("base", ad.pw_type)
      AND ade.pw_type in ("guesser", "tdt")
      AND BINARY ade.pw = ad.pw
     -- AND ade.version = "BASE"
  )
GROUP BY
  ad.pw_type,
  VERSION;

-- Einzigartige kompromittierte Passörter von TDT die klein geschrieben sind
SELECT
  count(*)
FROM
  analysed_data ad
  JOIN analysed_data adj ON ad.original_version_id = adj.id
WHERE
  ad.hit = 1
  AND ad.pw_type = "tdt"
  AND BINARY LOWER(adj.pw) = ad.pw
  AND NOT EXISTS (
    SELECT
      *
    FROM
      analysed_data ade
    WHERE
      ade.original_version_id = ad.original_version_id
      AND ade.pw_type NOT IN("base", ad.pw_type)
      AND BINARY ade.pw = ad.pw
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
      AND BINARY ade.pw = ad.pw
  )
ORDER BY
  ad.original_version_id;

-- Nur ende groß
SELECT
   count(*)
FROM
  analysed_data ad
  JOIN analysed_data adj ON ad.original_version_id = adj.id
WHERE
  ad.hit = 1
  AND ad.pw_type = "tdt"
  AND BINARY CONCAT(LOWER(LEFT(adj.pw,LENGTH(adj.pw) - 1)), UPPER(RIGHT(adj.pw, 1))) = ad.pw
  AND RIGHT(adj.pw,1) RLIKE '^[a-z]'
  AND NOT EXISTS (
    SELECT
      *
    FROM
      analysed_data ade
    WHERE
      ade.original_version_id = ad.original_version_id
      AND ade.pw_type NOT IN("base", ad.pw_type)
      AND BINARY ade.pw = ad.pw
  )
ORDER BY
  ad.original_version_id;

-- Einzigartige kompromittierte Passörter von TDT die nur den ersten & letzten buchstaben groß haben
SELECT
  adj.pw as og, ad.pw-- count(*) 
FROM
  analysed_data ad
  JOIN analysed_data adj ON ad.original_version_id = adj.id
WHERE
  ad.hit = 1
  AND ad.pw_type = "tdt"
  AND BINARY CONCAT(UPPER(LEFT(adj.pw,1)), LOWER(SUBSTRING(adj.pw, 2, LENGTH(adj.pw) -2)),UPPER(RIGHT(adj.pw, 1))) = ad.pw
  AND UPPER(LEFT(adj.pw,1)) RLIKE '^[A-Z]' AND  UPPER(RIGHT(adj.pw,1)) RLIKE '^[A-Z]' 
  AND NOT EXISTS (
    SELECT
      *
    FROM
      analysed_data ade
    WHERE
      ade.original_version_id = ad.original_version_id
      AND ade.pw_type NOT IN("base", ad.pw_type)
      AND BINARY ade.pw = ad.pw
  )
ORDER BY
  ad.original_version_id;

-- Pop nummer / spezial postfix
SELECT
   count(*)
FROM
  analysed_data ad
  JOIN analysed_data adj ON ad.original_version_id = adj.id
WHERE
  ad.hit = 1
  AND ad.pw_type = "tdt"
  AND BINARY CONCAT(adj.pw, SUFFIX) = ad.pw
  -- AND RIGHT(adj.pw, 1) <> "1"  -- für pop nummer "23" -> 123 gehört zu nummer seq
  -- AND RIGHT(adj.pw, 1) <> "0"  -- für pop nummer "1" -> 01 gehört zu nummer seq
  AND NOT EXISTS (
    SELECT
      *
    FROM
      analysed_data ade
    WHERE
      ade.original_version_id = ad.original_version_id
      AND ade.pw_type NOT IN("base", ad.pw_type)
      AND BINARY ade.pw = ad.pw
  )
ORDER BY
  ad.original_version_id;

  -- Einzigartige kompromittierte Passörter von TDT LOWER/UPPER +  SUFFIX
SELECT
     adj.pw as og, ad.pw
FROM
  analysed_data ad
  JOIN analysed_data adj ON ad.original_version_id = adj.id
WHERE
  ad.hit = 1
  AND ad.pw_type = "tdt"
  AND BINARY CONCAT(LOWER(adj.pw), SUFFIX) = ad.pw AND BINARY LOWER(adj.pw) <> adj.pw
  AND NOT EXISTS (
    SELECT
      *
    FROM
      analysed_data ade
    WHERE
      ade.original_version_id = ad.original_version_id
      AND ade.pw_type NOT IN("base", ad.pw_type)
      AND BINARY ade.pw = ad.pw
  )
ORDER BY
  ad.original_version_id;
