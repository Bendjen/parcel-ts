import React from "react";
import { Link } from "react-router-dom";
import Search from "../search";
import style from "./index.scss";

interface INavItem {
    name: string,
    link: string
}

interface IState {
    curIndex: number,
    navList: INavItem[]
}

class Nav extends React.Component<{}, IState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            curIndex: 4,
            navList: [
                { name: "JavaScript", link: "/home/javascript" },
                { name: "Css", link: "/home/css" },
                { name: "Idea", link: "/home/idea" },
                { name: "Mark", link: "/mark" },
                { name: "About", link: "/about" }
            ],
        };
    }
    public handleClick(index: number) {
        this.setState({
            curIndex: index
        });
    }
    public render() {
        return (
            <nav className={style.container} data-flex="cross:center">
                {this.state.navList.map((item, index) => {
                    return (
                        <Link
                            to={item.link}
                            key={index}
                            onClick={this.handleClick.bind(this, index)}
                            className={style.item}
                        >
                            <span
                                className={
                                    index === this.state.curIndex ? style.active : style.disActive
                                }
                            >
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
                <Search />
            </nav>
        );
    }
    public componentDidMount() {
        const urlArr = location.hash.split('/')
        const urlKey = location.hash.includes('home') ? urlArr[2] : urlArr[1]
        const urlIndex = this.state.navList.findIndex(item => item.name.toLocaleLowerCase() === urlKey)
        this.setState({
            curIndex: urlIndex < 0 ? 4 : urlIndex
        })
    }
}

export default Nav;
