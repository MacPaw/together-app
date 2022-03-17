export interface SlackMemberAttributes {
  id: string;
  name: string;
  email: string;
  isDeleted: boolean;
  isRestricted: boolean;
  isUltraRestricted: boolean;
}

export class SlackMember {
  public readonly id: string;

  public readonly name: string;

  public readonly email: string;

  public readonly isDeleted: boolean;

  public readonly isRestricted: boolean;

  public readonly isUltraRestricted: boolean;

  constructor(params: SlackMemberAttributes) {
    this.id = params.id;
    this.name = params.name;
    this.email = params.email;
    this.isDeleted = params.isDeleted;
    this.isRestricted = params.isRestricted;
    this.isUltraRestricted = params.isUltraRestricted;
  }
}
