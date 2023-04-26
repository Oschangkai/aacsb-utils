export class AuditableEntity {
    public CreatedBy: string;

    public CreatedOn: Date;

    public LastModifiedBy?: string;

    public LastModifiedOn: Date;

    public DeletedBy?: string;

    public DeletedOn?: Date;
}