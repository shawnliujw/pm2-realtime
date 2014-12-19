/**
 * Created by Shawn Liu on 2014/12/19.
 */
'use strict';
module.exports = function (app) {
    app.use("/system", require("./routes/system"));
    app.use("/pm", require("./routes/pm"));
};

