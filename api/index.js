module.exports = (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({
    ok: true,
    service: 'CyCom API',
    endpoints: ['/api/paystack/verify']
  }));
};
