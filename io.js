const fs = require("fs");
const { PNG } = require("pngjs/browser");
const tinycolor = require("tinycolor2");

function readJson(fn) {
  const raw = fs.readFileSync(fn);
  return JSON.parse(raw);
}

function writeJson(fn, o) {
  fs.writeFileSync(fn, JSON.stringify(o));
}

function writePng(cmap, pngFilePath) {
  var png = new PNG({ width: 256, height: 16 });
  for (var x = 0; x < png.width; x++) {
    const color = new tinycolor(cmap[x]);
    for (var y = 0; y < png.height; y++) {
      var idx = (png.width * y + x) << 2;
      png.data[idx] = color._r;
      png.data[idx + 1] = color._g;
      png.data[idx + 2] = color._b;
      png.data[idx + 3] = 255;
    }
  }

  const options = {};
  var buffer = PNG.sync.write(png, options);
  fs.writeFileSync(pngFilePath, buffer);
}

module.exports = { writePng, readJson, writeJson };
