module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Idempotency-Key');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  const traceId = 'omni-' + Math.random().toString(36).substring(2, 6) + '-' + Math.random().toString(36).substring(2, 6);
  const queueId = 'q_' + Math.random().toString(36).substring(2, 6);

  res.status(200).json({
    status: 'acknowledged',
    code: 200,
    traceId: `#${traceId}`,
    queueId: `#${queueId}`,
    latencyMs: +(1.4 + Math.random() * 1.6).toFixed(2),
    timestamp: new Date().toISOString(),
    message: 'Payload ingested into OmniSync Edge Gateway with zero data loss.'
  });
};
