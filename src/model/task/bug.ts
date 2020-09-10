import { BugState } from "../enum";

export class Bug {
  public id: string;

  public desc: string;

  public solution: string;

  public state: BugState;

  public createOn?: number;

  public completeOn?: number;
}