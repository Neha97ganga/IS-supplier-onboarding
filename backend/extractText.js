const fs = require("fs");
const pdfParse = require("pdf-parse");   // ✅ correct

async function extractTextFromFile(filePath) {
  if (filePath.endsWith(".pdf")) {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);   // ✅ call correctly
    return pdfData.text;
  }

  if (filePath.endsWith(".txt")) {
    return fs.readFileSync(filePath, "utf8");
  }

  throw new Error("Unsupported file type. Only PDF or TXT allowed.");
}

module.exports = { extractTextFromFile };
