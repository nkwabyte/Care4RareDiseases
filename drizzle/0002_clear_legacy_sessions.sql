-- Session tokens move from stored JWTs to hashed opaque tokens; existing sessions cannot be migrated.
DELETE FROM `sessions`;
