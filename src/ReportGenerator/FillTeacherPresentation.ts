import * as fs from 'fs';
import * as sql from 'mssql';
import * as database from '@config/database';
import { v4 as uuidv4, NIL as NIL_UUID } from 'uuid';
import { Teacher } from './model';
import { TeacherPresentation } from './model/data';


export class FillTeacherPresentation {
  private config: sql.config;
  constructor() {
    this.config = database.config;
  }

  private establishDatabaseConnection = () => sql.connect({...this.config});

  private closeDatabaseConnection = (poolConnection: sql.ConnectionPool) => poolConnection.close();

  private loadDataFromDisk(): TeacherPresentation[] {
    try {
      let data = fs.readFileSync('./data/ReportGenerator/teacher_presentation_ba.json', 'utf8');
      return JSON.parse(data);
    } catch(e) {
      return [];
    }
  }

  public async Run(): Promise<void> {
    try {
      // load data from disk
      const data = this.loadDataFromDisk();
      if (data.length <= 0) throw new Error('No data loaded from disk.');

      // establish database connection
      let poolConnection = await this.establishDatabaseConnection();

      // load ids from database
      let teachers: Teacher[] = (await poolConnection.request()
        .query(`SELECT [Id], [Name] FROM [ReportGenerator].[Teachers] ORDER BY [Name]`))
        .recordset;

      
      let query = `INSERT INTO [ReportGenerator].[Research] ([Id], [Type], [TeacherId], [Title], [OtherAuthors], [OrderAuthors], [AddressAuthors], [Publication], [Seminar], [YearStart], [MonthStart], [DayStart], [YearEnd], [MonthEnd], [DayEnd], [Country], [City], [PageStart], [PageEnd], [Project], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn]) VALUES `;
      
      for (let i = 0; i < data.length; i++) {
        let teacher = teachers.find(t => t.Name == data[i].teacher_name_c);
        if (teacher === undefined) {
          console.log(`Skip ${JSON.stringify(data[i])}`);
          continue;
        }

        let q = query + `('${uuidv4()}', 'Presentation', '${teacher.Id}', N'${data[i].journals_title}', N'${data[i].other_authors}', N'${data[i].order_authors}', ${data[i].address_authors == '是' ? 1 : data[i].address_authors == '' ? null : 0}, ${data[i].publication == '是' ? 1 : data[i].publication == '' ? null : 0}, ${data[i].seminar == '' ? null : "N'" + data[i].seminar + "'"}, ${data[i].year_id_s == "" ? null : data[i].year_id_s}, ${data[i].month_id_s == "" ? null : data[i].month_id_s}, ${data[i].day_id_s == "" ? null : data[i].day_id_s}, ${data[i].year_id_e == "" ? null : data[i].year_id_e}, ${data[i].month_id_e == "" ? null : data[i].month_id_e}, ${data[i].day_id_e == "" ? null : data[i].day_id_e}, ${data[i].country == '' ? null : "N'" + data[i].country + "'"}, ${data[i].city == '' ? null : "N'" + data[i].city + "'"}, ${data[i].page_s == '' ? null : data[i].page_s}, ${data[i].page_e == '' ? null : data[i].page_e}, ${data[i].project == '' ? null : "N'" + data[i].project + "'"}, '${NIL_UUID}', GETDATE(), '${NIL_UUID}', GETDATE())`;
        // console.log(q);
        await poolConnection.request().query(q);
      }

      this.closeDatabaseConnection(poolConnection);
    } catch(err) {
      console.error(err.message);
    }
  }
}