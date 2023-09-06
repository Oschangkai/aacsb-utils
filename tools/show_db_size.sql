SELECT
  name,
  size,
  size * 8/1024 'Size (MB)',
  max_size
FROM sys.master_files
WHERE DB_NAME(database_id) = 'AACSB'