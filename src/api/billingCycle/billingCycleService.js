const BillingCycle = require("./billingCycle");

BillingCycle.methods(["get", "post", "put", "delete"]);

BillingCycle.updateOptions({ new: true, runValidators: true });

BillingCycle.route("get", (req, res, next) => {
  BillingCycle.find({}, (err, docs) => {
    if (err) {
      res.status(500).json({ errors: [err] });
    } else {
      res.json(docs);
    }
  });
});

BillingCycle.route("count", (req, res, next) => {
  BillingCycle.count((err, value) => {
    if (err) {
      res.send(500).json({ errors: [err] });
    } else {
      res.json({ value });
    }
  });
});

module.exports = BillingCycle;
