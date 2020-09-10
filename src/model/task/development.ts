import { DevState } from "../enum";

export class Development {
  public id: string;

  public name: string;

  public desc: string;

  public demand: string;

  public state: DevState;

  public createOn?: number;

  public completeOn?: number;
}