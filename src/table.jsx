require("./table.css");

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
            <input
                className="search-query"
                type="text"
                value={this.state.query}
                onChange={(event) => this.handleQueryChange(event)}
                autoFocus
            />
            <p>
                Matched {packages.length} packages with type definitions.
            </p>
            <ul>
            {
                packages.map(pkg => {
                    return <li className="search-result" key={pkg.packageName}>
                        <a href={`https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/${pkg.packageName}`}>
                            {pkg.packageName}
                        </a>
                        <ul>
                        {
                            pkg.fileNames.map(fileName => {
                                return <li key={`${pkg.packageName}/${fileName}`}>
                                    <a href={`https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/${pkg.packageName}/${fileName}`}>
                                        {fileName}
                                    </a>
                                </li>
                            })
                        }
                        </ul>
                    </li>;
                })
            }
            </ul>
        </div>;
    }
}
