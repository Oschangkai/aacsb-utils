SELECT
  T.Name AS TeacherName, Type, Research.Title,
  AddressAuthors, OtherAuthors, OrderAuthors,
  Seminar, City, Country, Issue,
  JournalsClass, JournalsName, JournalsStatus, JournalsType,
  PageStart, PageEnd, Project, Publication, Volume,
  Year, YearEnd, YearStart, Month, MonthEnd, MonthStart, DayEnd, DayStart, FullText
FROM [ReportGenerator].[Research]
  LEFT JOIN [ReportGenerator].[Teachers] T on T.Id = Research.TeacherId
ORDER BY T.DepartmentId ,Type, Year DESC, YearStart DESC, Month DESC, MonthStart DESC