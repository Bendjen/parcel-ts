import { Select } from "antd";
import createHistory from "history/createHashHistory";
import React from "react";
import { Link } from "react-router-dom";
import { menuList } from "../../data/map";
import style from "./index.scss";
const history = createHistory();
const Option = Select.Option;

class Search extends React.Component {
  constructor(props) {
    super(props);
    let searchOptions = [];
    Object.entries(menuList).forEach(item => {
      const type = item[0];
      const value = Object.values(item[1]);
      value.forEach(i => (i.type = type));
      searchOptions = [...searchOptions, ...value];
    });
    this.state = { searchOptions };
  }
  public handleSelect(value, option) {
    history.push(`/detail/${option.props.type}/${option.props.idName}`);
  }
  public render() {
    const options = this.state.searchOptions.map(item => (
      <Option
        key={item.id}
        type={item.type}
        value={item.title}
        idName={item.id}
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
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
          placeholder="Search..."
          dropdownStyle={{ fontSize: 10 }}
          notFoundContent="Not Found"
          dropdownMatchSelectWidth={false}
          showSearch={true}
          mode="combobox"
          showArrow={false}
          onSelect={this.handleSelect}
        >
          {options}
        </Select>
      </div>
    );
  }
}

export default Search;
