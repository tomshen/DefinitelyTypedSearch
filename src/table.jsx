import React from "react";

export default class Table extends React.Component {
    render() {
        return <ul className="search-table">
        {
            this.props.packages.map((packageName, index) => {
                return <li key={index}>
                    <a href={`https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/${packageName}`}>
                        {packageName}
                    </a>
                </li>;
            })
        }
        </ul>
    }
}
