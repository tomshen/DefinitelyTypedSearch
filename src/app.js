import React from "react";
import ReactDOM from "react-dom";

import { getAllPackages } from "./github";
import searchIndex from "./search";
import Table from "./table";

getAllPackages()
    .then(packages => {
        packages.forEach((pkg, index) => {
            searchIndex.add({
                id: index,
                packageName: pkg.packageName,
                fileNames: pkg.fileNames.join(" ")
            });
        });
        ReactDOM.render(
            <Table packages={packages} searchIndex={searchIndex}/>,
            document.getElementById("container")
        );
    });
