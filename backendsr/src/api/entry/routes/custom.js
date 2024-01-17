"use strict";

module.exports = {
  routes: [
    //custom routes
    {
      method: "GET",
      path: "/entries/:id/seedate",
      handler: "entry.seedate",
    },{
        method: "GET",
        path: "/entries/:id/summit",
        handler: "entry.summit",
      },
  ],
};
