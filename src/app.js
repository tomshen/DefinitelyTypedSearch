import lunr from "lunr";
import React from "react";
import ReactDOM from "react-dom";

import { getAllPackages } from "./github";
import Table from "./table";

const searchIndex = lunr(function () {
    this.field("packageName");
    this.ref("id");
});

getAllPackages()
    .then(packages => {
        packages.forEach((packageName, index) => searchIndex.add({
            id: index,
            packageName: packageName
        }));
        ReactDOM.render(
            <Table packages={packages} searchIndex={searchIndex}/>,
            document.getElementById("container")
        );
    });
