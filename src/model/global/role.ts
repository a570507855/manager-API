export class Role {
  public id: string;

  public name: string;

  public power: { [key: number]: number[] };

  public nums: number;

  public createOn: number;

  public modifiedOn?: number;
}
