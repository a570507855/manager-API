export class Development {
  public id: string;        //任务ID

  public taskName: string;  //任务名称

  public desc: string;      //任务描述

  public demand: string;    //功能需求

  public status: number;    //1:暂未处理,2:正在处理,3:任务完成

  public createOn?: number;  //创建时间

  public completeOn?: number;//完成时间
}