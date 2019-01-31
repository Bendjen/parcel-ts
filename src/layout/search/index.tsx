import { Select } from "antd";
import createHistory from "history/createHashHistory";
import * as React from "react";
// import { Link } from "react-router-dom";
import menu from "../../menu";
import { IOptionItem } from './declare.d'
import style from "./index.scss";
const history = createHistory();
const Option = Select.Option;



class Search extends React.Component<{}, { searchOptions: IOptionItem[] }> {
  constructor(props: {}) {
    super(props);
    const searchOptions: IOptionItem[] = menu;
    this.state = { searchOptions };
  }
  public render() {
    const options = this.state.searchOptions.map(item => (
      <Option
        key={item.id}
        value={item.title}
        data-type={item.type}
        data-id={item.id}
      >
        {item.title}
      </Option>
    ));
    return (
      <div className={style.container} data-flex="cross:center">
        <i className="iconfont icon-search" />
        <Select
          className={style.search}
          optionFilterProp="title"
          // tslint:disable-next-line:jsx-no-lambda
          filterOption={(input, option: any) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          placeholder="Search..."
          dropdownStyle={{ fontSize: 10, width: 160 }}
          notFoundContent="Not Found"
          dropdownMatchSelectWidth={false}
          showSearch={true}
          mode="combobox"
          allowClear={true}
          showArrow={false}
          onSelect={this.handleSelect}
        >
          {options}
        </Select>
      </div>
    );
  }

  private handleSelect(value: string, option: any) {
    history.push(`/detail/${option.props['data-type']}/${option.props['data-id']}`);
  }

}

export default Search;
