let route_loader = {};

let config = require("../config");

route_loader.init = (app, router) => {
  console.log("called route_loader.init.");

  initRoutes(app, router);
};

function initRoutes(app, router) {
  console.log("called initRoutes is called");

  for (let i = 0; i < config.middleware_info.length; ++i) {
    let curItem = config.middleware_info[i];

    let curModule = require("." + curItem.path);
    app.use(curItem.path, curModule);
  }
}

module.exports = route_loader;
