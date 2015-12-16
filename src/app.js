import lunr from "lunr";
import React from "react";
import ReactDOM from "react-dom";

import { getAllPackages } from "./github";
import Table from "./table";

window.searchIndex = lunr(function () {
    this.field("packageName", { boost: 10 });
    this.field("fileNames");
    this.ref("id");
});

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
