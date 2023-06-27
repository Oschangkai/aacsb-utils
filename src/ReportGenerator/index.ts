import * as sql from 'mssql';
import * as database from '@config/database';
import { FillTeacherType } from './FillTeacherType';

export class ReportGenerator {

  private config: sql.config;
  constructor() {
    this.config = database.config;
  }

  public async testConnectAndQuery(): Promise<void> {
    try {
      let poolConnection = await sql.connect({...this.config});

      console.log("Reading rows from the Table...");
      let resultSet = await poolConnection.request().query(`SELECT * FROM [ReportGenerator].[Departments]`);

      console.log(`${resultSet.recordset.length} rows returned.`);

      // close connection only when we're certain application is finished
      poolConnection.close();
    } catch (err) {
      console.error(err.message);
    }
  }
}

export { FillCourseDiscipline } from './FillCourseDiscipline';
export { FillTeacherData } from './FillTeacherData';
export { FillTeacherType } from './FillTeacherType';
export { FillTeacherQualification } from './FillTeacherQualification';
export { FillTeachersV2 } from './FillTeachersV2';
export { FillTeachers } from './FillTeachers';