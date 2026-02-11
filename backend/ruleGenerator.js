require("dotenv").config();
const OpenAI = require("openai");
const { extractTextFromFile } = require("./extractText");
const db = require("./db");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");


const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL
});

async function generateRulesFromSampleDoc(filePath, documentType) {
  console.log("📄 Extracting text from:", filePath);

  let text;
  try {
    text = await extractTextFromFile(filePath);
  } catch (err) {
    console.error("❌ PDF extraction failed:", err.message);
    throw new Error("PDF text extraction failed");
  }

  console.log("📄 Extracted text length:", text?.length);

  if (!text || text.trim().length < 50) {
    throw new Error("PDF contains no readable text (scanned or empty)");
  }

  let response;
  try {
    response = await client.chat.completions.create({
      model: "openai/gpt-oss-safeguard-20b",
      temperature: 0,
      messages: [
        {
          role: "system",
          content: "You are a compliance rule extraction engine."
        },
        {
          role: "user",
          content: `
Return ONLY valid JSON.

Schema:
{
  "document_type": "${documentType}",
  "required_checks": [
    {
      "check_id": "string",
      "description": "string",
      "severity": "critical | major | minor"
    }
  ]
}

DOCUMENT TEXT:
${text}
`
        }
      ]
    });
  } catch (err) {
    console.error("❌ LLM API failed:", err.message);
    throw new Error("LLM API call failed");
  }

  let raw = response.choices[0].message.content;
  console.log("🧠 LLM raw output:", raw);

  // ---------- CLEAN LLM OUTPUT ----------
  raw = raw.replace(/```json/g, "").replace(/```/g, "").trim();

  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("No JSON object found in LLM response");
  }

  const jsonString = raw.substring(start, end + 1);

  let rules;
  try {
    rules = JSON.parse(jsonString);
  } catch (err) {
    console.error("❌ JSON parse failed. Raw output:");
    console.log(raw);
    throw new Error("LLM did not return valid JSON");
  }

  // ---------- SAVE RULES TO DB ----------
  for (const r of rules.required_checks) {
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO rules (document_type, check_id, description, severity)
         VALUES (?, ?, ?, ?)`,
        [rules.document_type, r.check_id, r.description, r.severity],
        (err) => (err ? reject(err) : resolve())
      );
    });
  }

  console.log("📦 Rules saved to DB");

  return rules;
}
// ---------- GENERATE SYNTHETIC SUPPLIER ----------
async function generateSyntheticSupplier() {
  const response = await client.chat.completions.create({
    model: "openai/gpt-oss-safeguard-20b",
    temperature: 0.8,
    messages: [
      {
        role: "system",
        content: "You generate realistic fake supplier onboarding data."
      },
      {
        role: "user",
        content: `
Generate a fake supplier profile in JSON.

Schema:
{
  "supplier_name": "string",
  "category": "Raw Material | Packaging Materials | Logistics"
}

Return ONLY JSON.
`
      }
    ]
  });

  let raw = response.choices[0].message.content;

  // Clean markdown
  raw = raw.replace(/```json/g, "").replace(/```/g, "").trim();

  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("Invalid JSON from LLM");
  }

  const jsonString = raw.substring(start, end + 1);

  return JSON.parse(jsonString);
}
// Required documents per supplier category (YOUR REAL SET)
const REQUIRED_DOCS = {
  "Raw Materials (Ingredients/Spices)": [
    "Business Registration Certificate",
    "GST Registration Certificate",
    "FSSAI License",
    "Quality Audit Report",
    "Certificate of Analysis (COA)",
    "ESG Declaration"
  ],

  "Packaging Materials (Food-Grade)": [
    "Business Registration Certificate",
    "GST Registration Certificate",
    "Food-Grade Compliance Certificate",
    "Quality Audit Report",
    "ESG Declaration"
  ],

  "Logistics": [
    "Business Registration Certificate",
    "GST Registration Certificate",
    "FSSAI License",
    "Transport License",
    "Insurance Certificate",
    "Refrigerated Vehicle Capability Certificate",
    "Temperature Monitoring / Calibration Certificate"
  ]
};
// ---------- GENERATE PDF DOCUMENTS FOR SUPPLIER ----------
async function generateSupplierDocuments(supplierName, category) {
  const docs = REQUIRED_DOCS[category] || [];

  const folder = path.join(__dirname, "..", "data", "generated");
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

  let files = [];

  for (const docType of docs) {
    const safeSupplier = supplierName.replace(/\s+/g, "_");
    const safeDoc = docType
  .replace(/[()]/g, "")     // remove brackets
  .replace(/[\/\\]/g, "_")  // replace / and \ with _
  .replace(/\s+/g, "_");    // spaces -> _


    const fileName = `${safeSupplier}_${safeDoc}.pdf`;
    const filePath = path.join(folder, fileName);

    const pdf = new PDFDocument();
    const stream = fs.createWriteStream(filePath);

    pdf.pipe(stream);
    pdf.fontSize(16).text(docType, { align: "center" });
    pdf.moveDown();
    pdf.fontSize(11).text(`Synthetic ${docType} for ${supplierName}`);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`);
    pdf.end();

    await new Promise((resolve) => stream.on("finish", resolve));

    files.push(filePath);
  }

  return files;
}


module.exports = {
  generateRulesFromSampleDoc,
  generateSyntheticSupplier,
  generateSupplierDocuments   // 👈 ADD THIS
};

