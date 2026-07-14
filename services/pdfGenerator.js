const PDFDocument = require("pdfkit");

/**
 * Build a key-value row array from a data object using a field mapping.
 * Skips fields with null/undefined/empty values and internal fields.
 */
function buildRows(data, fieldMap) {
  const rows = [];
  for (const [key, label] of Object.entries(fieldMap)) {
    const val = data[key];
    if (val === null || val === undefined || val === "") continue;
    if (key.startsWith("_") || key === "id" || key === "__v") continue;
    const display = val instanceof Date ? val.toLocaleDateString("en-IN") : String(val);
    rows.push({ label, value: display });
  }
  return rows;
}

/**
 * Draw a table-like list with label : value pairs.
 */
function drawTable(doc, rows, startY) {
  let y = startY;
  const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const labelX = doc.page.margins.left;
  const valueX = labelX + 160;

  for (const row of rows) {
    // Check page break
    if (y > doc.page.height - doc.page.margins.bottom - 60) {
      doc.addPage();
      y = doc.page.margins.top;
    }

    // Alternating row background
    if (rows.indexOf(row) % 2 === 0) {
      doc.rect(labelX, y - 4, pageWidth, 22).fillColor("#f5f5f5").fill();
      doc.fillColor("#222");
    }

    doc.font("Helvetica-Bold").fontSize(10).fillColor("#333")
       .text(row.label, labelX + 6, y, { width: 150, lineBreak: false });
    doc.font("Helvetica").fontSize(10).fillColor("#222")
       .text(row.value, valueX + 6, y, { width: pageWidth - 170, lineBreak: true });
    y += 22;
  }
  return y;
}

/**
 * Generate a PDF buffer containing the user's loan application details.
 * @param {string} loanType - e.g. "Personal Loan", "Business Loan"
 * @param {object} data - Mongoose document (call .toObject() first) or plain object
 * @param {object} fieldMap - { dbFieldName: "Human Label", ... }
 * @returns {Promise<Buffer>}
 */
function generatePDF(loanType, data, fieldMap) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        margin: 50,
        size: "A4",
        info: {
          Title: `KeshvaCredit - ${loanType} Application`,
          Author: "KeshvaCredit",
        },
      });
      const buffers = [];
      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);

      // ── Border ──
      doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60).strokeColor("#222").lineWidth(2).stroke();

      // ── Header ──
      doc.fontSize(26).font("Helvetica-Bold").fillColor("#222")
         .text("KeshvaCredit", doc.page.margins.left, 60, { align: "center" });
      doc.fontSize(13).font("Helvetica").fillColor("#555")
         .text("Loan Application Summary", { align: "center" });
      doc.moveDown(1.5);

      // Horizontal divider
      doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor("#222").lineWidth(1.2).stroke();
      doc.moveDown(0.8);

      // Meta info
      const metaY = doc.y;
      doc.fontSize(10).font("Helvetica").fillColor("#444");
      doc.text(`Loan Type: ${loanType}`, 50, metaY);
      doc.text(`Application ID: ${data._id || "N/A"}`, 50, metaY + 15);
      doc.text(`Submitted: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`, 50, metaY + 30);
      doc.moveDown(2);

      // Separator
      const sepY = doc.y + 6;
      doc.moveTo(50, sepY).lineTo(545, sepY).strokeColor("#ccc").stroke();
      doc.moveDown(1.5);

      // ── Details Table ──
      const rows = buildRows(data, fieldMap);
      if (rows.length > 0) {
        doc.fontSize(12).font("Helvetica-Bold").fillColor("#222")
           .text("Application Details", 50, doc.y);
        doc.moveDown(0.5);
        drawTable(doc, rows, doc.y + 4);
      }

      // ── Footer ──
      const bottomY = doc.page.height - doc.page.margins.bottom - 20;
      doc.fontSize(8).font("Helvetica").fillColor("#999")
         .text(
           "KeshvaCredit — This is a system-generated document.",
           50,
           bottomY,
           { align: "center", width: 500 }
         );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { generatePDF };
