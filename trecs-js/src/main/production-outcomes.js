const OUTPUT_COUNTERS = ['units', 'tenByThirteens', 'digitalDownloads', 'zipFiles', 'idCards', 'envelopes', 'largeEnvelopes', 'labels', 'addons', 'cards'];

function outputSnapshot(result) {
  return Object.fromEntries([...OUTPUT_COUNTERS, 'deferredComposites'].map((key) => [key, Number(result[key] || 0)]));
}

function orderRenderOutcome(order, before, result, options = {}) {
  const outputs = Object.fromEntries(OUTPUT_COUNTERS.map((key) => [key, Math.max(0, Number(result[key] || 0) - before[key])]).filter(([, count]) => count));
  const issues = ['missingPhotos', 'missingImagePrep', 'unsupportedItems', 'errors'].flatMap((type) =>
    (result[type] || []).filter((item) => Number(item.orderId) === Number(order.id)).map((item) => ({ type, ...item })));
  if (Number(result.deferredComposites || 0) > before.deferredComposites) issues.push({ type: 'deferred_composite' });
  if (outputs.addons) issues.push({ type: 'external_production_required' });
  const productCount = ['units', 'tenByThirteens', 'digitalDownloads', 'idCards', 'cards'].reduce((sum, key) => sum + Number(outputs[key] || 0), 0);
  const completed = options.includeUnits !== false && productCount > 0 && issues.length === 0;
  return { orderId: Number(order.id), ref: order.ref, status: completed ? 'completed' : issues.length ? 'needs_attention' : 'outputs_only', outputs, issues };
}

function completedOrderIds(result) {
  return (result.orderResults || []).filter((order) => order.status === 'completed').map((order) => Number(order.orderId)).filter((id) => Number.isInteger(id) && id > 0);
}

function renderJobStatus(result) {
  if (result.interrupted) return result.interrupted;
  return (result.orderResults || []).some((order) => order.issues.length) ? 'completed_with_errors' : 'completed';
}

module.exports = { outputSnapshot, orderRenderOutcome, completedOrderIds, renderJobStatus };
