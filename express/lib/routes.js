exports.order = function order(req, res, next) {
  const order = req.body;
  console.log({ order });

  if (!order.prices && !order.quantities && !order.country && !order.reduction) {
    res.status(404).json({});
    console.log('error: missing property');
    return;
  }

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
    tax = 0.18;
  } else if(['FI'].includes(order.country)) {
    tax = 0.17;
  } else if(['HU'].includes(order.country)) {
    tax = 0.27;
  } else if(['EE', 'AT'].includes(order.country)) {
    tax = 0.22;
  } else {
    res.status(404).json({});
    console.log('unknown country');
    return;
  }

  let totalWithoutTax = 0;
  for (i = 0; i < order.prices.length; i++) {
    totalWithoutTax += order.prices[i] * order.quantities[i];
  }
  console.log({totalWithoutTax})

  const total = totalWithoutTax * (1 + tax);

  console.log({total});

  if (total < 1000) {

    res.json({ total });
    return;
  }

  if (order.reduction === "HALF PRICE") {
    const totalWithReduction = total * 0.5;
    res.json({ total: totalWithReduction });
    return;
  }

  if (total >= 1000 && total < 5000) {
    const totalWithReduction = total * 0.97;
    res.json({ total: totalWithReduction });
    return;
  }

  if (total >= 5000 && total < 7000) {
    const totalWithReduction = total * 0.95;
    res.json({ total: totalWithReduction });
    return;
  }

  if (total >= 7000 && total < 10000) {
    const totalWithReduction = total * 0.93;
    res.json({ total: totalWithReduction });
    return;
  }

  if (total >= 10000 && total < 50000) {
    const totalWithReduction = total * 0.90;
    res.json({ total: totalWithReduction });
    return;
  }

  if (total >= 50000) {
    const totalWithReduction = total * 0.85;
    res.json({ total: totalWithReduction });
    return;
  }

  res.status(404).json({});

  console.log('unknown problem');
  return;
}

exports.feedback = function feedback(req, res, next) {
  console.info("FEEDBACK:", req.body.type, req.body.content);
  next();
}
