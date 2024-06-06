-- TDT einzigartig REST
SELECT
  -- COUNT(*)
  adj.pw AS original,
  ad.pw AS fuzzed,
  ad.hit,
  adj.hit AS ogHit
FROM
  analysed_data ad
  JOIN analysed_data adj ON ad.original_version_id = adj.id
WHERE
  ad.hit = 1
  AND ad.pw_type = "tdt"
  AND (
     BINARY LOWER(adj.pw) = ad.pw
       OR (
         BINARY CONCAT(
          UPPER(LEFT(adj.pw, 1)),
          LOWER(RIGHT(adj.pw, LENGTH(adj.pw) - 1))
      ) = ad.pw
      AND UPPER(LEFT(adj.pw, 1)) RLIKE '^[A-Z]'
      ) -- Nur erster Buchstabe groß
     OR (
       BINARY CONCAT(
          LOWER(LEFT(adj.pw, LENGTH(adj.pw) - 1)),
         UPPER(RIGHT(adj.pw, 1))
       ) = ad.pw
        AND UPPER(RIGHT(adj.pw, 1)) RLIKE '^[A-Z]'
      ) -- Nur letzter Buchstabe groß
      OR BINARY CONCAT(
        UPPER(LEFT(adj.pw, 1)),
        LOWER(SUBSTRING(adj.pw, 2, LENGTH(adj.pw) -2)),
        UPPER(RIGHT(adj.pw, 1))
       ) = ad.pw
      AND UPPER(LEFT(adj.pw, 1)) RLIKE '^[A-Z]'
      AND UPPER(RIGHT(adj.pw, 1)) RLIKE '^[A-Z]' -- nur erster & letzter buchstabe groß
    (
      BINARY CONCAT(adj.pw, "1") = ad.pw
      AND RIGHT(adj.pw, 1) <> "0"
    )
    OR BINARY CONCAT(adj.pw, "11") = ad.pw
    OR BINARY CONCAT(adj.pw, "12") = ad.pw
    OR BINARY CONCAT(adj.pw, "13") = ad.pw
    OR BINARY CONCAT(adj.pw, "22") = ad.pw
    OR (
      BINARY CONCAT(adj.pw, "23") = ad.pw
      AND RIGHT(adj.pw, 1) <> "1"
    )
    OR BINARY CONCAT(adj.pw, "07") = ad.pw
    OR BINARY CONCAT(adj.pw, "!") = ad.pw
    OR BINARY CONCAT(adj.pw, "*") = ad.pw
    OR (
      (
        BINARY CONCAT(LOWER(adj.pw), "1") = ad.pw
        OR BINARY CONCAT(LOWER(adj.pw), "11") = ad.pw
        OR BINARY CONCAT(LOWER(adj.pw), "12") = ad.pw
        OR BINARY CONCAT(LOWER(adj.pw), "23") = ad.pw
        OR BINARY CONCAT(LOWER(adj.pw), "!") = ad.pw
        OR BINARY CONCAT(LOWER(adj.pw), "*") = ad.pw
      )
      AND BINARY LOWER(adj.pw) <> adj.pw
    )
    OR (
      (
        BINARY CONCAT(UPPER(adj.pw), "1") = ad.pw
        OR BINARY CONCAT(UPPER(adj.pw), "11") = ad.pw
        OR BINARY CONCAT(UPPER(adj.pw), "12") = ad.pw
        OR BINARY CONCAT(UPPER(adj.pw), "!") = ad.pw
        OR BINARY CONCAT(UPPER(adj.pw), "*") = ad.pw
      )
      AND BINARY UPPER(adj.pw) <> adj.pw
    )
       OR (
      (
      BINARY CONCAT(CONCAT(UPPER(LEFT(adj.pw,1)), LOWER(RIGHT(adj.pw, LENGTH(adj.pw) - 1))), "1") = ad.pw
        OR BINARY CONCAT(CONCAT(UPPER(LEFT(adj.pw,1)), LOWER(RIGHT(adj.pw, LENGTH(adj.pw) - 1))), "11") = ad.pw
         OR BINARY CONCAT(CONCAT(UPPER(LEFT(adj.pw,1)), LOWER(RIGHT(adj.pw, LENGTH(adj.pw) - 1))), "12") = ad.pw
         OR BINARY CONCAT(CONCAT(UPPER(LEFT(adj.pw,1)), LOWER(RIGHT(adj.pw, LENGTH(adj.pw) - 1))), "23") = ad.pw
         OR BINARY CONCAT(CONCAT(UPPER(LEFT(adj.pw,1)), LOWER(RIGHT(adj.pw, LENGTH(adj.pw) - 1))), "!") = ad.pw
         OR BINARY CONCAT(CONCAT(UPPER(LEFT(adj.pw,1)), LOWER(RIGHT(adj.pw, LENGTH(adj.pw) - 1))), ".") = ad.pw
         OR BINARY CONCAT(CONCAT(UPPER(LEFT(adj.pw,1)), LOWER(RIGHT(adj.pw, LENGTH(adj.pw) - 1))), "*") = ad.pw
         OR BINARY CONCAT(CONCAT(UPPER(LEFT(adj.pw,1)), LOWER(RIGHT(adj.pw, LENGTH(adj.pw) - 1))), "@") = ad.pw
       )
       AND BINARY CONCAT(UPPER(LEFT(adj.pw,1)), LOWER(RIGHT(adj.pw, LENGTH(adj.pw) - 1))) <> adj.pw
     )
  )
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


-- TDT einzigartig REST
SELECT
  COUNT(*)
 -- adj.pw AS original,
 -- ad.pw AS fuzzed
FROM
  analysed_data ad
  JOIN analysed_data adj ON ad.original_version_id = adj.id
WHERE
  ad.hit = 1
  AND ad.pw_type = "tdt"
  AND NOT(
    BINARY LOWER(adj.pw) = ad.pw
    OR (
      BINARY CONCAT(
        UPPER(LEFT(adj.pw, 1)),
        LOWER(RIGHT(adj.pw, LENGTH(adj.pw) - 1))
      ) = ad.pw
      AND UPPER(LEFT(adj.pw, 1)) RLIKE '^[A-Z]'
    ) -- Nur erster Buchstabe groß
    OR (
      BINARY CONCAT(
        LOWER(LEFT(adj.pw, LENGTH(adj.pw) - 1)),
        UPPER(RIGHT(adj.pw, 1))
      ) = ad.pw
      AND UPPER(RIGHT(adj.pw, 1)) RLIKE '^[A-Z]'
    ) -- Nur letzter Buchstabe groß
    OR BINARY CONCAT(
      UPPER(LEFT(adj.pw, 1)),
      LOWER(SUBSTRING(adj.pw, 2, LENGTH(adj.pw) -2)),
      UPPER(RIGHT(adj.pw, 1))
    ) = ad.pw
    AND UPPER(LEFT(adj.pw, 1)) RLIKE '^[A-Z]'
    AND UPPER(RIGHT(adj.pw, 1)) RLIKE '^[A-Z]' -- nur erster & letzter buchstabe groß
    OR (
      BINARY CONCAT(adj.pw, "1") = ad.pw
      AND RIGHT(adj.pw, 1) <> "0"
    )
    OR BINARY CONCAT(adj.pw, "11") = ad.pw
    OR BINARY CONCAT(adj.pw, "12") = ad.pw
    OR BINARY CONCAT(adj.pw, "13") = ad.pw
    OR BINARY CONCAT(adj.pw, "22") = ad.pw
    OR (
      BINARY CONCAT(adj.pw, "23") = ad.pw
      AND RIGHT(adj.pw, 1) <> "1"
    )
    OR BINARY CONCAT(adj.pw, "07") = ad.pw
    OR BINARY CONCAT(adj.pw, "!") = ad.pw
    OR BINARY CONCAT(adj.pw, "*") = ad.pw
    OR (
      (
        BINARY CONCAT(LOWER(adj.pw), "1") = ad.pw
        OR BINARY CONCAT(LOWER(adj.pw), "11") = ad.pw
        OR BINARY CONCAT(LOWER(adj.pw), "12") = ad.pw
        OR BINARY CONCAT(LOWER(adj.pw), "!") = ad.pw
        OR BINARY CONCAT(LOWER(adj.pw), "*") = ad.pw
      )
      AND BINARY LOWER(adj.pw) <> adj.pw
    )
    OR (
      (
        BINARY CONCAT(UPPER(adj.pw), "1") = ad.pw
        OR BINARY CONCAT(UPPER(adj.pw), "11") = ad.pw
        OR BINARY CONCAT(UPPER(adj.pw), "12") = ad.pw
        OR BINARY CONCAT(UPPER(adj.pw), "!") = ad.pw
        OR BINARY CONCAT(UPPER(adj.pw), "*") = ad.pw
      )
      AND BINARY UPPER(adj.pw) <> adj.pw
    )
  )
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
