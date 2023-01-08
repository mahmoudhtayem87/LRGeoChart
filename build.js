const fs = require('fs-extra');
const concat = require('concat');
(async function build() {
  const files = [
    './dist/lrgeo-chart/runtime.js',
    './dist/lrgeo-chart/polyfills.js',
    './dist/lrgeo-chart/main.js'
  ];
  await fs.ensureDir('lrgeochart-build');
  await fs.removeSync('lrgeochart-build/lrgeo-chart.js');
  await concat(files, 'lrgeochart-build/lrgeo-chart.js');

  await fs.copy('./src/app/app.component.css', 'lrgeochart-build/styles.css');
})();
