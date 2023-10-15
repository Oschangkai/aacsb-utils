SELECT
  T.Name AS TeacherName, Research.Title,
  AddressAuthors, OtherAuthors, OrderAuthors,
  Seminar, City, Country, Issue,
  JournalsClass, JournalsName, JournalsStatus, JournalsType,
  PageStart, PageEnd, Project, Publication, Volume,
  Year, YearEnd, YearStart, Month, MonthEnd, MonthStart, DayEnd, DayStart, FullText,
  STRING_AGG(RT.Code, ',') AS ResearchTypeCode
FROM [ReportGenerator].[Research]
  LEFT JOIN [ReportGenerator].[Teachers] T on T.Id = Research.TeacherId
  LEFT JOIN [ReportGenerator].[ResearchResearchType] RRT on Research.Id = RRT.ResearchId
  LEFT JOIN [ReportGenerator].[ResearchType] RT on RRT.ResearchTypeId = RT.Id
GROUP BY T.Name, Research.Title,
  AddressAuthors, OtherAuthors, OrderAuthors,
  Seminar, City, Country, Issue,
  JournalsClass, JournalsName, JournalsStatus, JournalsType,
  PageStart, PageEnd, Project, Publication, Volume,
  Year, YearEnd, YearStart, Month, MonthEnd, MonthStart, DayEnd, DayStart, FullText
ORDER BY COALESCE(Year, YearEnd, YearStart) DESC, COALESCE(Month, MonthEnd, MonthStart) DESC