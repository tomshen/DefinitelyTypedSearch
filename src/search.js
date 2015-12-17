import lunr from "lunr";

export default lunr(function () {
    this.field("packageName", { boost: 10 });
    this.field("fileNames");
    this.ref("id");
});
