-- Select LG, LO (Simple)
SELECT DISTINCT lg.[goal_LG_content] AS [LG_Content]
      , lg.[goal_LG_sort] AS [LG_Code]
	  , lo.[goal_LO_content] AS [LO_Content]
	  , lo.goal_LO_sort AS [LO_Code]
FROM [AoL].[dbo].[goal_LG] lg
  LEFT JOIN [AoL].[dbo].[goal_LO] lo ON lg.[goal_LG_id] = lo.[goal_LG_id]
WHERE lg.[academic_year_id] = 17
ORDER BY lg.[goal_LG_sort], lo.[goal_LO_sort]

-- Select LG, LO (Full)
SELECT DISTINCT lg.[goal_LG_content] AS [LG_Content]
      , lg.[goal_LG_sort] AS [LG_Code]
	  , lo.[goal_LO_content] AS [LO_Content]
	  , lo.goal_LO_sort AS [LO_Code]
	  , ad.academic_degree_value AS [Degree]
	  , adept.academic_department_short AS [Department]
FROM [AoL].[dbo].[goal_LG] lg
  LEFT JOIN [AoL].[dbo].[goal_LO] lo ON lg.[goal_LG_id] = lo.[goal_LG_id]
  LEFT JOIN [AoL].[dbo].[academic_degree] ad ON lg.academic_degree_id = ad.academic_degree_id
  LEFT JOIN [AoL].[dbo].[academic_department] adept ON lo.academic_department_id = adept.academic_department_id
WHERE lg.[academic_year_id] = 17
ORDER BY lg.[goal_LG_sort], lo.[goal_LO_sort]

-- Select Rubrics
SELECT
  r.[goal_LO_id]
    , r.[rubrics_sample_rows_id]
    , r.[rubrics_sample_columns_id]
    , r.[rubrics_value]
	  , rs.[rubrics_sample_value]
	  , rsr.[rubrics_sample_rows_value]
	  , rsc.[rubrics_sample_columns_value]
FROM [AoL].[dbo].[rubrics] r
  LEFT JOIN [AoL].[dbo].[rubrics_sample] rs ON (r.goal_LO_id = rs.goal_LO_id AND r.rubrics_sample_rows_id = rs.rubrics_sample_rows_id AND r.rubrics_sample_columns_id = rs.rubrics_sample_columns_id)
  LEFT JOIN [AoL].[dbo].[rubrics_sample_rows] rsr ON r.rubrics_sample_rows_id = rsr.rubrics_sample_rows_id
  LEFT JOIN [AoL].[dbo].[rubrics_sample_columns] rsc ON r.rubrics_sample_columns_id = rsc.rubrics_sample_columns_id


-- Select LG, LO, Rubrics
SELECT DISTINCT
  lg.[goal_LG_content] AS [LG_Content]
    , lg.[goal_LG_sort] AS [LG_Code]
	  , lo.[goal_LO_content] AS [LO_Content]
	  , lo.[goal_LO_sort] AS [LO_Code]
    , r.[rubrics_value]
	  , rs.[rubrics_sample_value]
	  , rsr.[rubrics_sample_rows_value]
--,rsc.[rubrics_sample_columns_value]
FROM [AoL].[dbo].[goal_LG] lg
  LEFT JOIN [AoL].[dbo].[goal_LO] lo ON lg.[goal_LG_id] = lo.[goal_LG_id]
  LEFT JOIN [AoL].[dbo].[rubrics] r ON r.[goal_LO_id] = lg.[goal_LG_id]
  LEFT JOIN [AoL].[dbo].[rubrics_sample] rs ON (r.goal_LO_id = rs.goal_LO_id AND r.rubrics_sample_rows_id = rs.rubrics_sample_rows_id AND r.rubrics_sample_columns_id = rs.rubrics_sample_columns_id)
  LEFT JOIN [AoL].[dbo].[rubrics_sample_rows] rsr ON r.rubrics_sample_rows_id = rsr.rubrics_sample_rows_id
-- LEFT JOIN [AoL].[dbo].[rubrics_sample_columns] rsc ON r.rubrics_sample_columns_id = rsc.rubrics_sample_columns_id
WHERE lg.[academic_year_id] = 17
ORDER BY lg.[goal_LG_sort], lo.[goal_LO_sort]