"use strict";

/**
 * entry controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::entry.entry", ({ strapi }) => ({
  async seedate(ctx) {
    const entityId = ctx.params.id;
    try {
      let date = await strapi.entityService.findOne(
        "api::entry.entry",
        entityId
      );
      date = await strapi.entityService.update("api::entry.entry", entityId, {
        data: {
          seedate: new Date(),
        },
      });
      ctx.body = { seedate: date.seedate, summit: date.summit };
    } catch (err) {
      ctx.body = err;
    }
  },async summit(ctx) {
    const entityId = ctx.params.id;
    try {
      let date = await strapi.entityService.findOne(
        "api::entry.entry",
        entityId
      );
      date = await strapi.entityService.update("api::entry.entry", entityId, {
        data: {
          summit: true,
        },
      });
      ctx.body = { summit: date.summit };
    } catch (err) {
      ctx.body = err;
    }
  },
}));
