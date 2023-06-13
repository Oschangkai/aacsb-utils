import { AuditableEntity } from "./AuditableEntity";
import { BaseEntity } from "./BaseEntity";
import { CourseTeacher } from "./CourseTeacher";
import { Department } from "./Department";
import { Professional } from "./Professional";
import { Qualification } from "./Qualification";
import { Research } from "./Research";
import { Responsibility } from "./Responsibility";

export class Teacher extends AuditableEntity implements BaseEntity
{
    public Id: string;

    public Name: string;

    public NameInNtustCourse?: string;

    public QualificationId?: string;

    public WorkType?: string;

    public WorkTypeAbbr?: string;

    public EnglishName?: string;

    public EnglishNameInNtustCourse?: string;

    public Degree: string;

    public DegreeYear?: number;

    public DepartmentId?: string;

    public Responsibilities: string;

    public Email?: string;

    public Title?: string;

    public ResignDate?: Date;

    public Research: Research[];

    public Professional: Professional[];

    public ImportSignatureId: string;

    public Courses: CourseTeacher[];
}