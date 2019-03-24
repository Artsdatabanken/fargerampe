const lagGradientrampe = require("./gradientrampe");
const { readJson, writeJson, writePng } = require("./io");

const ramp2fn = {};
const url2ramp = {};
let rampCount = 1;

const meta = readJson("metadata_med_undertyper.json");
Object.entries(meta).forEach(([kode, node]) => {
  if (kode !== "meta") makeRampFor(node);
});
writeJson("fargeramper.json", url2ramp);

Object.entries(url2ramp).forEach(([url, fn]) => {
  console.log(`scp ${fn} grunnkart@hydra:~/tilesdata/${url}/fargerampe.png`);
});

function makeRampFor(meta) {
  const { opplystKode, barn } = meta;
  const rampe = lagGradientrampe(barn, opplystKode, "diskret");
  if (rampe.length <= 0) return;
  const hash = hashArray(rampe);
  if (!ramp2fn[hash]) {
    ramp2fn[hash] = rampCount + ".png";
    rampCount++;
    writePng(rampe, ramp2fn[hash]);
  }
  url2ramp[meta.url] = ramp2fn[hash];
}

// Lager en lang streng av fargehexkoder for å bare trenge å lage 1 fil for hver unike rampe (YAGNI)
function hashArray(cmap) {
  return cmap.map(e => e.replace("#", "")).join("");
}
