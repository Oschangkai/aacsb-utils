import { BaseEntity } from "./BaseEntity";

export class CourseTeacher implements BaseEntity {
    public Id: string;

    public TeacherId: string;

    public CourseId: string;
}