export interface IState {
  renderList: IModule[];
}

export interface IModule {
  type: string;
  title: string;
  articles: IArticleItem[];
}

export interface IArticleItem {
  title: string;
  url: string;
}
