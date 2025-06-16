// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require("path");

const REPLACEMENTS = [
  {
    from: /https:\/\/gitlab\.flashphoner\.com\/flashphoner-public\/SFU-SDK-Extended-Samples\/blob\/[^/]+/g,
    to: "https://github.com/flashphoner/MessengerSDKSamples/blob/1.0",
  },
  {
    from: /\[Code \(Lines/gi,
    to: "[Github (Lines"
  }
];

function walk(dir, ext = ".md", filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      walk(filepath, ext, filelist);
    } else if (file.endsWith(ext)) {
      filelist.push(filepath);
    }
  });
  return filelist;
}

function processMdFile(filepath) {
  let content = fs.readFileSync(filepath, "utf8");
  let orig = content;
  REPLACEMENTS.forEach(({ from, to }) => {
    content = content.replace(from, to);
  });
  if (content !== orig) {
    fs.writeFileSync(filepath, content, "utf8");
    console.log("Updated:", filepath);
  }
}

const ROOT = path.resolve(__dirname, "src/components/containers");
const files = walk(ROOT);
files.forEach(processMdFile);
console.log("MD link replacement done.");
