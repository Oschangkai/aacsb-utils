import * as fs from 'fs';
import * as sql from 'mssql';
import * as database from '@config/database';
import { Department, Qualification, Teacher } from './model';
import { TeacherQualification } from './model/data/TeacherQualification';

export class FillTeacherQualification {
  private config: sql.config;
  constructor() {
    this.config = database.config;
  }

  private establishDatabaseConnection = () => sql.connect({...this.config});

  private closeDatabaseConnection = (poolConnection: sql.ConnectionPool) => poolConnection.close();

  private loadDataFromDisk(): TeacherQualification[] {
    try {
      let data = fs.readFileSync('./data/ReportGenerator/teacher_qualification.json', 'utf8');
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

      let qualifactions: Qualification[] = (await poolConnection.request()
        .query(`SELECT [Id], [Abbreviation] FROM [ReportGenerator].[Qualifications]`))
        .recordset;

      let skip = 0;
      for (let i = 0; i < teachers.length; i++) {
        let teacher = data.find(d => d.name === teachers[i].Name);
        if (teacher === undefined) {
          skip++;
          console.log(`Skip ${teachers[i].Name}`);
          continue;
        }

        let department = departments.find(d => teacher.department.includes(d.EnglishName));
        if(department === undefined && teacher.department.includes('以上皆非 None of the above')) {
          department = departments.find(d => d.EnglishName === 'Others');
        }
        let qualification = qualifactions.find(q => teacher.qualification.endsWith(`${q.Abbreviation})`));

        let query = `UPDATE [ReportGenerator].[Teachers] SET `;
        if (department !== undefined) {
            query += `[DepartmentId] = '${department.Id}'`;
        }
        if (qualification !== undefined) {
          if (department !== undefined) query += `, `;
          query += `[QualificationId] = '${qualification.Id}'`;
        }
        if (!!teacher.title) {
          if (department !== undefined || qualification !== undefined) query += `, `;
          query += `[Title] = N'${teacher.title}'`;
        }
        if(!!teacher.email) {
          if (department !== undefined || qualification !== undefined || !!teacher.title) query += `, `;
          query += `[Email] = '${teacher.email}'`;
        }

        query += ` WHERE [Id] = '${teachers[i].Id}'`;
        console.log(`${teacher.name}, ${query}`);

        await poolConnection.request().query(query);
      }
      
      this.closeDatabaseConnection(poolConnection);
      console.log(`Skipped ${skip} teachers, affected ${teachers.length - skip} rows.`);
    } catch (err) {
      console.error(err.message);
    }
  }
}