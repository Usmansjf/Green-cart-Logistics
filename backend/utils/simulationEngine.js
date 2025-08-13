const Driver = require('../Models/Driver');
const Route = require('../Models/Route');
const Order = require('../Models/Order');

module.exports.runSimulation = async ({ numDrivers, startTime, maxHoursPerDriver }) => {
  if (numDrivers < 1 || maxHoursPerDriver < 0 || !/^\d{2}:\d{2}$/.test(startTime)) {
    throw new Error('Invalid simulation inputs');
  }

  const drivers = await Driver.find().sort({ createdAt: 1 }).limit(numDrivers);
  if (drivers.length < numDrivers) {
    throw new Error(`Only ${drivers.length} drivers available`);
  }
  const orders = await Order.find().populate('route_id').sort({ delivery_time: 1 });

  let allocations = [];
  let totalProfit = 0;
  let onTimeCount = 0;
  let lateCount = 0;
  let fuelCostTotal = 0;
  let fuelHigh = 0;
  let fuelNormal = 0;

  let driverState = drivers.map(d => ({
    id: d._id.toString(),
    name: d.name,
    remainingHours: maxHoursPerDriver,
    fatigued: d.past_week_hours.length > 0 && Number(d.past_week_hours[d.past_week_hours.length - 1]) > 8
  }));

  for (let order of orders) {
    const route = order.route_id;
    if (!route) {
      allocations.push({
        order_id: order.order_id,
        driver_name: "No Driver Assigned",  
        estimatedDeliveryTimeMinutes: 0,
        onTime: false,
        profit: -50
      });
      totalProfit -= 50;
      lateCount++;
      continue;
    }

    const baseTime = route.base_time_min;
    let bestDriver = null;
    let maxRemaining = -1;

    for (const driver of driverState) {
      const deliveryTime = driver.fatigued ? baseTime * 1.3 : baseTime;
      if (driver.remainingHours * 60 >= deliveryTime && driver.remainingHours > maxRemaining) {
        bestDriver = driver;
        maxRemaining = driver.remainingHours;
      }
    }

    if (!bestDriver) {
      allocations.push({
        order_id: order.order_id,
        driver_name: "No Driver Assigned",
        estimatedDeliveryTimeMinutes: 0,
        onTime: false,
        profit: -50
      });
      totalProfit -= 50;
      lateCount++;
      continue;
    }

    const deliveryTime = bestDriver.fatigued ? baseTime * 1.3 : baseTime;
    const isLate = deliveryTime > (baseTime + 10);
    const fuelCost = route.distance_km * (5 + (route.traffic_level === 'High' ? 2 : 0));
    if (route.traffic_level === 'High') {
      fuelHigh += fuelCost;
    } else {
      fuelNormal += fuelCost;
    }
    const bonus = (!isLate && order.value_rs > 1000) ? order.value_rs * 0.1 : 0;
    const penalty = isLate ? 50 : 0;
    const profit = order.value_rs + bonus - penalty - fuelCost;

    totalProfit += profit;
    fuelCostTotal += fuelCost;
    if (isLate) lateCount++; else onTimeCount++;

    allocations.push({
      order_id: order.order_id,
      driver_name: bestDriver.name,  
      estimatedDeliveryTimeMinutes: deliveryTime,
      onTime: !isLate,
      profit
    });

    bestDriver.remainingHours -= deliveryTime / 60;
  }

  const efficiency = orders.length > 0 ? (onTimeCount / (onTimeCount + lateCount)) * 100 : 0;

  return {
  inputs: { numDrivers, startTime, maxHoursPerDriver },
  kpis: { totalProfit, efficiency, onTime: onTimeCount, late: lateCount, fuelCostTotal, fuelBreakdown: { high: fuelHigh, normal: fuelNormal } },
  allocations: allocations.filter(a => a.driver_name !== "No Driver Assigned")
};

};
