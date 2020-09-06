export class MenuChild {
  public path: string;
  public title: string;
  public icon: string;
  public children: MenuChild[] | []
};

export class Menu {
  public id: string;

  public menus: MenuChild[] | [];
}