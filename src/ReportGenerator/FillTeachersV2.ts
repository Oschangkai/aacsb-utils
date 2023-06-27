import * as fs from 'fs';
import * as sql from 'mssql';
import * as database from '@config/database';
import { NewTeacherData } from './model/data';
import { Department, Teacher } from './model';

export class FillTeachersV2 {
  private config: sql.config;
  constructor() {
    this.config = database.config;
  }

  private establishDatabaseConnection = () => sql.connect({...this.config});

  private closeDatabaseConnection = (poolConnection: sql.ConnectionPool) => poolConnection.close();

  private loadDataFromDisk(): NewTeacherData[] {
    try {
      let data = fs.readFileSync('./data/ReportGenerator/teacher_data_v2.json', 'utf8');
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

      let skip = 0;
      for (let i = 0; i < teachers.length; i++) {
        let teacher = data.find(d => d.Name == teachers[i].Name);
        if (teacher === undefined) {
          continue;
        }

        let department = departments.find(d => d.Abbreviation == teacher.Department);
        if (teacher.Degree.includes('博士')) {
          teacher.Degree = 'PhD';
        } else if (teacher.Degree.includes('碩士')) {
          teacher.Degree = 'Master';
        } else if (teacher.Degree.includes('學士')) {
          teacher.Degree = 'Bachelor';
        } else teacher.Degree = null;

        let query = `UPDATE [ReportGenerator].[Teachers] SET `;
        if (!!teacher.Degree) {
          query += `[Degree] = '${teacher.Degree}'`;
        }
        if (!!teacher.DegreeYear) {
          if (!teacher.Degree) {
            query += `[DegreeYear] = '${teacher.DegreeYear}'`;
          } else {
            query += `, [DegreeYear] = '${teacher.DegreeYear}'`;
          }
        }
        if (!!teacher.Position) {
          if (!teacher.Degree && !teacher.DegreeYear) {
            query += `[Title] = N'${teacher.Position}'`;
          } else {
            query += `, [Title] = N'${teacher.Position}'`;
          }
        }
        if (department !== undefined) {
          if (!teacher.Degree && !teacher.DegreeYear && !teacher.Position) {
            query += `[DepartmentId] = '${department.Id}'`;
          } else {
            query += `, [DepartmentId] = '${department.Id}'`;
          }
        }
        if(!!teacher.PS) {
          if (!teacher.Degree && !teacher.DegreeYear && !teacher.Position && department === undefined) {
            query += `[WorkTypeAbbr] = N'${teacher.PS}'`;
          } else {
            query += `, [WorkTypeAbbr] = N'${teacher.PS}'`;
          }
        }
        query += ` WHERE [Id] = '${teachers[i].Id}'`;
        console.log(`${teacher.Name}, ${query}`);

        await poolConnection.request().query(query);
      }

      for (let i = 0 ; i < data.length; i++) {
        let teacher = teachers.find(t => t.Name == data[i].Name);
        if (teacher === undefined) {
          console.log(`Skip ${data[i].Name} - ${data[i].Department}`);
          skip++;
        };
      }
      
      this.closeDatabaseConnection(poolConnection);
      console.log(`Skipped ${skip} teachers, affected ${teachers.length - skip} rows.`);
    } catch (err) {
      console.error(err.message);
    }
  }
}