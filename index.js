const lagGradientrampe = require("./gradientrampe");
const fs = require("fs");
const { PNG } = require("pngjs/browser");
const tinycolor = require("tinycolor2");

const ramp2fn = {};
const url2ramp = {};
let rampCount = 1;

const meta = readJson("metadata_med_undertyper.json");
Object.entries(meta).forEach(([kode, node]) => {
  if (kode !== "meta") makeRampFor(node);
});
fs.writeFileSync("fargeramper.json", JSON.stringify(url2ramp));

Object.entries(url2ramp).forEach(([url, fn]) => {
  console.log(`scp ${fn} grunnkart@hydra:~/tilesdata/${url}/fargerampe.png`);
});

function readJson(fn) {
  const raw = fs.readFileSync(fn);
  return JSON.parse(raw);
}

function makeRampFor(meta) {
  const { opplystKode, barn } = meta;
  const rampe = lagGradientrampe(barn, opplystKode, "diskret");
  if (rampe.length <= 0) return;
  const hash = hashArray(rampe);
  if (!ramp2fn[hash]) {
    ramp2fn[hash] = rampCount + ".png";
    rampCount++;
    write(rampe, ramp2fn[hash]);
  }
  url2ramp[meta.url] = ramp2fn[hash];
}

function write(cmap, pngFilePath) {
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

function hashArray(cmap) {
  return cmap.map(e => e.replace("#", "")).join("");
}
