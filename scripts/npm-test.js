/*jslint node:true, white: true*/
require("../test/package.test.js").on("complete", function () {
  require("../test/resources.test.js");
});
