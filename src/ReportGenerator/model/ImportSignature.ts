import { AuditableEntity } from "./AuditableEntity";
import { BaseEntity } from "./BaseEntity";

export class ImportSignature extends AuditableEntity implements BaseEntity {
    public Id: string;

    public Name: string;

    public Description: string;
}