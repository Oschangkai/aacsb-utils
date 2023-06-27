SELECT DISTINCT c.Code AS Code, d.Code AS DisciplineCode, d.Name AS DisciplineName
FROM [ReportGenerator].Courses c
  LEFT JOIN [ReportGenerator].[Discipline] d on c.DisciplineId = d.Id
WHERE c.DisciplineId IS NOT NULL