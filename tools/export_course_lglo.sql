SELECT
  --adt.academic_department_name
  --,ad.academic_degree_value
  ay.academic_year_value
      , act.academic_term_value
	  , s.student_number
      , [course_name]
	  , r.student_rubrics_value
	  , lo.goal_LO_sort
	  , [course_code]
	  , lg.goal_LG_sort
FROM [AoL].[dbo].[course] c
  LEFT JOIN [AoL].[dbo].[academic_year] ay ON c.academic_year_id = ay.academic_year_id
  LEFT JOIN [AoL].[dbo].[academic_term] act ON c.academic_term_id = act.academic_term_id
  LEFT JOIN [AoL].[dbo].[academic_degree] ad ON c.academic_degree_id = ad.academic_degree_id
  LEFT JOIN [AoL].[dbo].[academic_department] adt ON c.academic_department_id = adt.academic_department_id
  LEFT JOIN [AoL].[dbo].[course_LGLO] cgo ON c.course_id = cgo.course_id
  LEFT JOIN [AoL].[dbo].[goal_LG] lg ON cgo.goal_LG_id = lg.goal_LG_id
  LEFT JOIN [AoL].[dbo].[goal_LO] lo ON cgo.goal_LO_id = lo.goal_LO_id
  LEFT JOIN [AoL].[dbo].[student_rubrics] r ON (c.course_id = r.course_id AND lo.goal_LO_id = r.goal_LO_id)
  LEFT JOIN [AoL].[dbo].[student] s ON (c.course_id = s.course_id AND r.student_id = s.student_id)
WHERE academic_department_name = 'Information Management' AND academic_degree_value = 'Bachelor'
ORDER BY goal_LG_sort, academic_year_value DESC, academic_term_value DESC, course_code