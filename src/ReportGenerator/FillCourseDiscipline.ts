import * as fs from 'fs';
import * as sql from 'mssql';
import * as database from '@config/database';
import { CourseDiscipline } from './model/data';
import { Course, Discipline } from './model';

export class FillCourseDiscipline {
  private config: sql.config;
  constructor() {
    this.config = database.config;
  }

  private establishDatabaseConnection = () => sql.connect({...this.config});

  private closeDatabaseConnection = (poolConnection: sql.ConnectionPool) => poolConnection.close();

  private loadDataFromDisk(): CourseDiscipline[] {
    try {
    let data = fs.readFileSync('./data/ReportGenerator/110course_discipline.json', 'utf8');
      return JSON.parse(data);
    } catch(e) {
      return [];
    }
  }

  public async Run(): Promise<void> {
    try {
      const data = this.loadDataFromDisk();
      if (data.length <= 0) throw new Error('No data loaded from disk.');

      let poolConnection = await this.establishDatabaseConnection();

      let coursesSet = await poolConnection.request()
        .query(`SELECT * FROM [ReportGenerator].[Courses] WHERE ([Semester] = '1101') OR ([Semester] = '1102') ORDER BY [Code]`);
      let courses: Course[] = coursesSet.recordset;

      let disciplinesSet = await poolConnection.request()
        .query(`SELECT [Id], [Code] FROM [ReportGenerator].[Discipline]`);
      let disciplines: Discipline[] = disciplinesSet.recordset;
      
      for (let i = 0; i < courses.length; i++) {
          let course = data.find(d => d.Code === courses[i].Code);
          if (course === undefined) continue;
          let discipline = disciplines.find(d => d.Code == course.DisciplineCode.toString());
          if (discipline === undefined) continue;

          console.log(`Update Course ${courses[i].Code} with Discipline ${course.DisciplineCode} and DisciplineId ${discipline.Id}`);
          await poolConnection.request()
            .query(`UPDATE [ReportGenerator].[Courses] SET [DisciplineId] = '${discipline.Id}' WHERE [Code] = '${courses[i].Code}'`);
      }
      
      this.closeDatabaseConnection(poolConnection);
    } catch (err) {
      console.error(err.message);
    }
  }
}