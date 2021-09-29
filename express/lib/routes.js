exports.order = function order(req, res, next) {
  const order = req.body;
  console.log({ order });

  if (!order.prices || !order.quantities || !order.country || !order.reduction) {
    console.log('error: missing property');
    return res.status(400).json({});
  }

  let totalWithoutTax = 0;
  for (i = 0; i < order.prices.length; i++) {
    totalWithoutTax += order.prices[i] * order.quantities[i];
  }
  console.log({totalWithoutTax})

  let tax;
  if (['DE', 'FR', 'RO', 'NL', 'EL', 'LV', 'MT'].includes(order.country)) {
    tax = 0.20;
  } else if(['UK', 'PL', 'BG', 'DK', 'IE', 'CY'].includes(order.country)) {
    tax = 0.21;
  } else if(['LT', 'HR', 'SE', 'PT'].includes(order.country)) {
    tax = 0.23;
  } else if(['LU', 'IT'].includes(order.country)) {
    tax = 0.25;
  } else if(['ES', 'CZ'].includes(order.country)) {
    tax = 0.19;
  } else if(['BE', 'SI'].includes(order.country)) {
    tax = 0.24;
  } else if(['SK'].includes(order.country)) {
    if (totalWithoutTax > 1000) {
      tax = 0.50;
    } else {
      tax = 0.18;
    }
  } else if(['FI'].includes(order.country)) {
    tax = 0.17;
  } else if(['HU'].includes(order.country)) {
    tax = 0.27;
  } else if(['EE', 'AT'].includes(order.country)) {
    tax = 0.22;
  } else {
    console.log('error: unknown country');
    return res.status(400).json({});
  }

  const total = totalWithoutTax * (1 + tax);
  console.log({total});

  const totalWithReduction = _getTotalWithReduction(total, order.reduction);
  console.log({totalWithReduction});

  // KILLSWITCH
  // res.status(404).json({});

  if (isNaN(totalWithoutTax)) {
    return res.status(404);
  }

  return res.json({ total: totalWithReduction });
}

function _getTotalWithReduction(total, reduction) {
  if (total < 1000 || reduction === "PAY THE PRICE") {
    return total;
  }

  if (reduction === "HALF PRICE") {
    return total * 0.5;
  }

  if (total >= 1000 && total < 5000) {
    return total * 0.97;
  }

  if (total >= 5000 && total < 7000) {
    return total * 0.95;
  }

  if (total >= 7000 && total < 10000) {
    return total * 0.93;
  }

  if (total >= 10000 && total < 50000) {
    return total * 0.90;
  }

  if (total >= 50000) {
    return total * 0.85;
  }
}

exports.feedback = function feedback(req, res, next) {
  console.info("FEEDBACK:", req.body.type, req.body.content);
  next();
}
