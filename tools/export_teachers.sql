SELECT t.Name, t.WorkTypeAbbr, t.EnglishName, t.Degree, t.DegreeYear, d.Abbreviation AS Department, Email, EnglishNameInNtustCourse, NameInNtustCourse, q.Abbreviation AS Qualification, ResignDate, Title, Supervisor, LinkTo
FROM [ReportGenerator].Teachers t
  LEFT JOIN [ReportGenerator].[Departments] d on t.DepartmentId = d.Id
  LEFT JOIN [ReportGenerator].[Qualifications] q on q.Id = t.QualificationId