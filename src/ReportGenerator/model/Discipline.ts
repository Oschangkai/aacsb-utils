import { AuditableEntity } from "./AuditableEntity";
import { BaseEntity } from "./BaseEntity";
import { Course } from "./Course";

export class Discipline extends AuditableEntity implements BaseEntity {
  public Id: string;

  public Code: string;

  public Name: string;

  public Courses: Course[];
}