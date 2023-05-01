import { AuditableEntity } from './AuditableEntity';
import { BaseEntity } from './BaseEntity';
import { CourseTeacher } from './CourseTeacher';

export class Course extends AuditableEntity implements BaseEntity
{
    public Id: string;

    public Name: string;

    public Semester: number;

    public Code: string;

    public EnglishName: string;

    public Credit: number;

    public Required: boolean;

    public Year: boolean;

    public Time: string;

    public ClassRoomNo?: string;

    public Contents?: string;

    public DepartmentId: string;
    public ImportSignatureId: string;
    public DisciplineId: string;

    public Teachers?: CourseTeacher[];
}

// export type CourseKey = Array<keyof Course>;