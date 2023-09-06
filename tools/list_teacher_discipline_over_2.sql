SELECT a.Teacher, a.Discipline, a.DisciplineTotal, a.CreditTotal, a.WorkType
FROM [ReportGenerator].[F_GetTeacherDiscipline](111) a
  RIGHT JOIN (
    SELECT Teacher
  FROM [ReportGenerator].[F_GetTeacherDiscipline](111)
  GROUP BY Teacher
  HAVING COUNT(Teacher) > 2
) b ON a.Teacher = b.Teacher