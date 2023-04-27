const BillingCycle = require("./billingCycle");
const errorHandler = require("../common/errorHandler");

BillingCycle.methods(["get", "post", "put", "delete"]);
BillingCycle.updateOptions({ new: true, runValidators: true });
BillingCycle.after("post", errorHandler).after("put", errorHandler);

BillingCycle.route("count", (req, res, next) => {
  BillingCycle.count((err, value) => {
    if (err) {
      res.send(500).json({ errors: [err] });
    } else {
      res.json({ value });
    }
  });
});

BillingCycle.route("summary", (req, res, next) => {
  BillingCycle.aggregate([
    {
      $project: {
        credit: { $sum: "$credits.value" },
        debt: { $sum: "$debts.value" },
      },
    },
    {
      $group: {
        _id: null,
        credit: { $sum: "$credit" },
        debt: { $sum: "$debt" },
      },
    },
    {
      $project: { _id: 0, credit: true, debt: true },
    },
  ]).exec((err, result) => {
    if (err) {
      res.status(500).json({ errors: [err] });
    } else {
      res.json(result[0] || { credit: 0, debt: 0 });
    }
  });
});

module.exports = BillingCycle;
