import { AuditableEntity } from "./AuditableEntity";
import { BaseEntity } from "./BaseEntity";

export class Responsibility extends AuditableEntity implements BaseEntity {
    public Id: string;

    public Description: string;

    public EnglishDescription: string;

    public Abbreviation: string;
}