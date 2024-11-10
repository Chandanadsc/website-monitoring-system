const https = require("https");

async function checkSSL(url) {
  return new Promise((resolve, reject) => {
    const hostname = new URL(url).hostname;
    const options = {
      hostname,
      port: 443,
      method: "GET",
    };

    const req = https.request(options, (res) => {
      const cert = res.socket.getPeerCertificate();
      const validTo = new Date(cert.valid_to);
      const daysRemaining = Math.ceil(
        (validTo - new Date()) / (1000 * 60 * 60 * 24)
      );

      resolve({
        validTo,
        daysRemaining,
        issuer: cert.issuer.CN,
        isValid: daysRemaining > 0,
      });
    });

    req.on("error", reject);
    req.end();
  });
}

module.exports = { checkSSL };
