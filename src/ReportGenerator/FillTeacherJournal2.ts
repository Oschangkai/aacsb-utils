import * as fs from 'fs';
import * as sql from 'mssql';
import * as database from '@config/database';
import { v4 as uuidv4, NIL as NIL_UUID } from 'uuid';
import { Teacher } from './model';
import { TeacherJournal2 } from './model/data';


export class FillTeacherJournal2 {
  private config: sql.config;
  constructor() {
    this.config = database.config;
  }

  private establishDatabaseConnection = () => sql.connect({...this.config});

  private closeDatabaseConnection = (poolConnection: sql.ConnectionPool) => poolConnection.close();

  private loadDataFromDisk(): TeacherJournal2[] {
    try {
      let data = fs.readFileSync('./data/ReportGenerator/teacher_journal2_ba.json', 'utf8');
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

      
      let query = `INSERT INTO [ReportGenerator].[Research] ([Id], [Type], [TeacherId], [Title], [OrderAuthors], [AddressAuthors], [JournalsType], [JournalsStatus], [Year], [Month], [JournalsClass], [OtherAuthors], [JournalsName], [Project], [Volume], [Issue], [PageStart], [PageEnd], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn]) VALUES `;
      
      for (let i = 0; i < data.length; i++) {
        let teacher = teachers.find(t => t.Name == data[i].teacher_name_c);
        if (teacher === undefined) {
          console.log(`Skip ${JSON.stringify(data[i])}`);
          continue;
        }

        let q = query + `('${uuidv4()}', 'Journal 2', '${teacher.Id}', N'${data[i].journals_title}', N'${data[i].order_authors}', ${data[i].address_authors == '是' ? 1 : 0}, N'${data[i].journals_type}', N'${data[i].journals_status_id}', ${data[i].year_id}, ${data[i].month_id == 0 ? null : data[i].month_id}, N'${data[i].journals_class}', N'${data[i].other_authors}', N'${data[i].journals_name}', ${data[i].project == '' ? null : "N'" + data[i].project + "'"}, ${data[i].volume == '' ? null : "N'" + data[i].volume + "'"}, ${data[i].issue == '' ? null : "'" + data[i].issue + "'"}, ${data[i].page_s == '' ? null : data[i].page_s}, ${data[i].page_e == '' ? null : data[i].page_e}, '${NIL_UUID}', GETDATE(), '${NIL_UUID}', GETDATE())`;
        // console.log(q);
        await poolConnection.request().query(q);
      }
      
      this.closeDatabaseConnection(poolConnection);
    } catch(err) {
      console.error(err.message);
    }
  }
}