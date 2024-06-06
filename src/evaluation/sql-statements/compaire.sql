-- Anzahl nicht kompr. Anmeldedaten, für die mit einem bestimmten Fuzzer ein Treffer erzielt wurde 
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
      AND ade.pw_type = FUZZER_NAME
      AND ade.hit = 1
  )
GROUP BY
  VERSION;