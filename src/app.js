import React from "react";
import ReactDOM from "react-dom";

import Table from "./table";
import { getAllPackages } from "./typings";

getAllPackages()
    .then(packages => {
        ReactDOM.render(<Table packages={packages}/>, document.getElementById("container"));
    });
