import { AuditableEntity } from "./AuditableEntity";
import { BaseEntity } from "./BaseEntity";

export class Department extends AuditableEntity implements BaseEntity {
    public Id: string;

    public Name: string;

    public EnglishName: string;

    public Abbreviation: string;
}