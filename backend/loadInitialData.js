const path = require('path');
const csv = require('csvtojson');
const Driver = require('./Models/Driver');
const Route = require('./Models/Route');
const Order = require('./Models/Order');

async function loadCSVData(filename) {
  const filepath = path.join(__dirname, 'data', filename);
  try {
    const data = await csv().fromFile(filepath);
    if (!data || data.length === 0) {
      console.warn(`⚠️ No data found in ${filename}`);
      return [];
    }
    console.log(`📄 Loaded ${data.length} records from ${filename}`);
    return data;
  } catch (err) {
    console.error(`❌ Error reading ${filename}: ${err.message}`);
    throw err;
  }
}

async function loadData() {
  try {
    await Route.collection.dropIndex('routeId_1').catch(err => console.log(`ℹ️ No old routeId_1 index to drop or minor error: ${err.message}`));
    await Order.collection.dropIndex('orderId_1').catch(err => console.log(`ℹ️ No old orderId_1 index to drop or minor error: ${err.message}`));
    console.log('🧹 Dropped any faulty old indexes');

    await Driver.deleteMany({});
    await Route.deleteMany({});
    await Order.deleteMany({});
    console.log('🧹 Cleared existing data from collections');

    const drivers = await loadCSVData('drivers.csv');
    let driverSuccess = 0, driverSkipped = 0;
    for (const d of drivers) {
      if (!d.name) {
        console.warn(`⚠️ Skipping driver with missing name: ${JSON.stringify(d)}`);
        driverSkipped++;
        continue;
      }
      try {
        const pastWeekHours = d.past_week_hours
          ? d.past_week_hours.split('|').map(h => {
              const num = Number(h);
              if (isNaN(num)) {
                console.warn(`⚠️ Invalid past_week_hours for driver ${d.name}: ${h}`);
                return 0;
              }
              return num;
            })
          : [];
        await new Driver({
          name: d.name.trim(),
          shift_hours: Number(d.shift_hours) || 0,
          past_week_hours: pastWeekHours,
        }).save();
        driverSuccess++;
        console.log(`✅ Loaded driver: ${d.name}`);
      } catch (err) {
        console.warn(`⚠️ Failed to load driver ${d.name || 'unknown'}: ${err.message}`);
        driverSkipped++;
      }
    }
    console.log(`🎉 Drivers: ${driverSuccess} loaded, ${driverSkipped} skipped`);

    const routes = await loadCSVData('routes.csv');
    let routeSuccess = 0, routeSkipped = 0;
    for (const r of routes) {
      console.log(`🔍 Processing raw route: ${JSON.stringify(r)}`);  // Extra log to debug raw CSV data
      if (!r.route_id || isNaN(Number(r.route_id)) || !r.distance_km || !r.base_time_min) {
        console.warn(`⚠️ Skipping invalid route: ${JSON.stringify(r)}`);
        routeSkipped++;
        continue;
      }
      try {
        const routeIdNum = Number(r.route_id);
        const routeData = {
          route_id: routeIdNum,
          distance_km: Number(r.distance_km),
          traffic_level: ['Low', 'Medium', 'High'].includes(r.traffic_level?.trim())
            ? r.traffic_level.trim()
            : 'Low',
          base_time_min: Number(r.base_time_min),
        };
        console.log(`🔍 Attempting to load route data: ${JSON.stringify(routeData)}`);  
        await new Route(routeData).save();
        routeSuccess++;
        console.log(`✅ Loaded route: ${routeIdNum}`);
      } catch (err) {
        console.warn(`⚠️ Failed to load route ${r.route_id || 'unknown'}: ${err.message}`);
        routeSkipped++;
      }
    }
    console.log(`🎉 Routes: ${routeSuccess} loaded, ${routeSkipped} skipped`);

    const orders = await loadCSVData('orders.csv');
    let orderSuccess = 0, orderSkipped = 0;
    for (const o of orders) {
      console.log(`🔍 Processing raw order: ${JSON.stringify(o)}`);  
      if (!o.order_id || isNaN(Number(o.value_rs)) || !o.route_id || !o.delivery_time) {
        console.warn(`⚠️ Skipping invalid order: ${JSON.stringify(o)}`);
        orderSkipped++;
        continue;
      }
      try {
        const routeDoc = await Route.findOne({ route_id: Number(o.route_id) });
        if (!routeDoc) {
          console.warn(`⚠️ Route not found for order ${o.order_id}, route_id: ${o.route_id}`);
          orderSkipped++;
          continue;
        }
        const timeParts = o.delivery_time.trim().split(':');
        if (timeParts.length !== 2 || isNaN(timeParts[0]) || isNaN(timeParts[1])) {
          console.warn(`⚠️ Invalid delivery_time for order ${o.order_id}: ${o.delivery_time}`);
          orderSkipped++;
          continue;
        }
        const [hours, minutes] = timeParts.map(Number);
        if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
          console.warn(`⚠️ Invalid time range for order ${o.order_id}: ${o.delivery_time}`);
          orderSkipped++;
          continue;
        }
        const deliveryDate = new Date(1970, 0, 1, hours, minutes);
        const orderData = {
          order_id: o.order_id.trim(),
          value_rs: Number(o.value_rs),
          route_id: routeDoc._id,
          delivery_time: deliveryDate,
        };
        console.log(`🔍 Attempting to load order data: ${JSON.stringify(orderData)}`);  
        await new Order(orderData).save();
        orderSuccess++;
        console.log(`✅ Loaded order: ${o.order_id}`);
      } catch (err) {
        console.warn(`⚠️ Failed to load order ${o.order_id || 'unknown'}: ${err.message}`);
        orderSkipped++;
      }
    }
    console.log(`🎉 Orders: ${orderSuccess} loaded, ${orderSkipped} skipped`);

    console.log('✅ Data loading complete');
  } catch (err) {
    console.error('❌ Data loading failed:', err.message);
    throw err;
  }
}

module.exports = loadData;