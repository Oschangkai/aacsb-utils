import * as fs from 'fs';
import * as sql from 'mssql';
import * as database from '@config/database';
import { TeacherData } from './model/data';
import { Department, Teacher } from './model';

export class FillTeacherData {
  private config: sql.config;
  constructor() {
    this.config = database.config;
  }

  private establishDatabaseConnection = () => sql.connect({...this.config});

  private closeDatabaseConnection = (poolConnection: sql.ConnectionPool) => poolConnection.close();

  private loadDataFromDisk(): TeacherData[] {
    try {
      let data = fs.readFileSync('./data/ReportGenerator/110teacher_data.json', 'utf8');
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

      let teachersSet = await poolConnection.request()
        .query(`SELECT [Id], [Name] FROM [ReportGenerator].[Teachers] ORDER BY [Name]`);
      let teachers: Teacher[] = teachersSet.recordset;

      let departments: Department[] = (await poolConnection.request()
        .query(`SELECT [Id], [EnglishName] FROM [ReportGenerator].[Departments]`))
        .recordset;


      for (let i = 0; i < teachers.length; i++) {
        let teacher = data.find(d => d.Name === teachers[i].Name);
        if (teacher === undefined) {
          console.log(`Skip ${teachers[i].Name}`);
          continue;
        }

        let department = departments.find(d => d.EnglishName == teacher.Department);

        let query = `UPDATE [ReportGenerator].[Teachers] SET `;
        if (!!teacher.EnglishName) {
          query += `[EnglishName] = '${teacher.EnglishName}'`;
        }
        if (!!teacher.Degree) {
          if (!teacher.EnglishName) {
            query += `[Degree] = '${teacher.Degree}'`;
          } else {
            query += `, [Degree] = '${teacher.Degree}'`;
          }
        }
        if (!!teacher.DegreeYear) {
          if (!teacher.EnglishName && !teacher.Degree) {
            query += `[DegreeYear] = '${teacher.DegreeYear}'`;
          } else {
            query += `, [DegreeYear] = '${teacher.DegreeYear}'`;
          }
        }
        if (!!teacher.Responsibility) {
          if (!teacher.EnglishName && !teacher.Degree && !teacher.DegreeYear) {
            query += `[Responsibilities] = '${teacher.Responsibility}'`;
          } else {
            query += `, [Responsibilities] = '${teacher.Responsibility}'`;
          }
        }
        if (department !== undefined) {
          if (!teacher.EnglishName && !teacher.Degree && !teacher.DegreeYear && !teacher.Responsibility) {
            query += `[DepartmentId] = '${department.Id}'`;
          } else {
            query += `, [DepartmentId] = '${department.Id}'`;
          }
        }
        query += ` WHERE [Id] = '${teachers[i].Id}'`;
        console.log(`${teacher.Name}, ${query}`);

        await poolConnection.request().query(query);
      }
      
      this.closeDatabaseConnection(poolConnection);
    } catch (err) {
      console.error(err.message);
    }
  }
}