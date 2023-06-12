import * as fs from 'fs';
import * as sql from 'mssql';
import * as database from '@config/database';
import { TeacherType } from './model/data';
import { Department, Qualification, Teacher } from './model';

export class FillTeacherType {
  private config: sql.config;
  constructor() {
    this.config = database.config;
  }

  private establishDatabaseConnection = () => sql.connect({...this.config});

  private closeDatabaseConnection = (poolConnection: sql.ConnectionPool) => poolConnection.close();

  private loadDataFromDisk(): TeacherType[] {
    try {
      let data = fs.readFileSync('./data/ReportGenerator/110teacher_type.json', 'utf8');
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
        .query(`SELECT [Id], [Abbreviation] FROM [ReportGenerator].[Departments]`))
        .recordset;

      let qualifactions: Qualification[] = (await poolConnection.request()
        .query(`SELECT [Id], [Abbreviation] FROM [ReportGenerator].[Qualifications]`))
        .recordset;

      let skip = 0;
      for (let i = 0; i < teachers.length; i++) {
        let teacher = data.find(d => d.Teacher === teachers[i].Name);
        if (teacher === undefined) {
          skip++;
          console.log(`Skip ${teachers[i].Name}`);
          continue;
        }

        let department = departments.find(d => d.Abbreviation == teacher.DepartmentAbbr);

        let query = `UPDATE [ReportGenerator].[Teachers] SET`;
        if (department !== undefined) {
            query += ` [DepartmentId] = '${department.Id}'`;
        }
        if (!!teacher.Qualification) {
          if (department !== undefined) query += `, `;
          query += `[QualificationId] = '${qualifactions.find(q => q.Abbreviation == teacher.Qualification).Id}'`;
        }
        if (!!teacher.WorkType) {
          if (department !== undefined || !!teacher.Qualification) query += `, `;
          query += `[WorkType] = '${teacher.WorkType}'`;
          if (teacher.WorkType.toLocaleLowerCase() == "part time") {
            query += `, [WorkTypeAbbr] = 'S'`;
          } else if (teacher.WorkType.toLocaleLowerCase() == 'contractual') {
            query += `, [WorkTypeAbbr] = 'C'`;
          } else if (teacher.WorkType.toLocaleLowerCase() == 'full time') {
            query += `, [WorkTypeAbbr] = 'P'`;
          }
        }
        query += ` WHERE [Id] = '${teachers[i].Id}'`;
        console.log(`${teacher.Teacher}, ${query}`);

        await poolConnection.request().query(query);
      }
      
      this.closeDatabaseConnection(poolConnection);
      console.log(`Skipped ${skip} teachers, affected ${teachers.length - skip} rows.`);
    } catch (err) {
      console.error(err.message);
    }
  }
}