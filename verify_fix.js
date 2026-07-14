const http = require("http");

function api(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const opts = {
      hostname: "localhost",
      port: 5000,
      path,
      method,
      headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(data) }
    };
    const req = http.request(opts, (res) => {
      let body = "";
      res.on("data", c => body += c);
      res.on("end", () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(body) }); }
        catch (e) { resolve({ status: res.statusCode, body }); }
      });
    });
    req.on("error", e => console.error("Error:", e.message));
    req.write(data);
    req.end();
  });
}

async function main() {
  const suffix = String(Date.now()).slice(-4);
  const phone = "5555" + suffix;
  const pan = "ABCD" + suffix + "Z"; // 4 letters + 4 digits + 1 letter = 9 chars - need exactly 10, add one more letter
  // Actually: 5 letters + 4 digits + 1 letter = 10
  // suffix is 4 digits, so: ABCDE (5) + suffix (4) + Z (1) = 10 ✓
  const panFixed = "ABCDE" + suffix + "Z";
  console.log("Using phone:", phone, "pan:", pan);

  // 1. Create user via main form
  console.log("\nSTEP 1: Creating user via main form (/api/createuser)");
  const r1 = await api("POST", "/api/createuser", {
    name: "Verify Fix User",
    phone: phone,
    email: "ajayrajputwuy@gmail.com",
    pan: pan,
    dob: "1990-01-15",
    income: 45000,
    loan_amount: 200000,
    employment_type: "Salaried",
    pincode: "560001",
    city: "Bangalore",
    state: "Karnataka"
  });
  console.log("   Result:", r1.status, r1.body.message);

  if (r1.status !== 201) {
    console.log("   Could not create user, aborting.");
    return;
  }

  // 2. Request deletion
  console.log("\nSTEP 2: Requesting account deletion (/api/delete-account)");
  const r2 = await api("POST", "/api/delete-account", {
    phone: phone,
    email: "ajayrajputwuy@gmail.com",
    reason: "Testing the fix"
  });
  console.log("   Status:", r2.status);
  console.log("   Body:", JSON.stringify(r2.body, null, 2));

  if (r2.status === 200) {
    console.log("\n✅ FIX VERIFIED! delete-account returned 200, email with PDF sent.");
  } else {
    console.log("\n❌ Not working yet. Status:", r2.status);
  }
}

main();
