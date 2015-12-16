import React from "react";

export default class Table extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            query: ""
        };
    }

    handleQueryChange(event) {
        this.setState({
            query: event.target.value
        });
    }
    render() {
        const packages = this.state.query.length === 0 ? this.props.packages
            : this.props.searchIndex.search(this.state.query).map(result => this.props.packages[result.ref]);

        return <div className="search-table">
            <input type="text" value={this.state.query} onChange={(event) => this.handleQueryChange(event)} />
            <ul>
            {
                packages.map((packageName, index) => {
                    return <li key={index}>
                        <a href={`https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/${packageName}`}>
                            {packageName}
                        </a>
                    </li>;
                })
            }
            </ul>
        </div>;
    }
}
