export abstract class ApiBase {
  public $route: string;

  public async after(): Promise<void> {}

  public abstract async invoke(): Promise<any>;
}
