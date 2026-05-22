const CVNSSConverter = require('./cvnss40_converter_pro_v4_trace.js');
const cases = [
  ['cqn','tuyết','cvss','tydb'], ['cqn','nguyễn','cvss','wylg'],
  ['cqn','long','cvss','logp'], ['cqn','lỗ','cvss','log'],
  ['cvss','logp','cqn','long'], ['cvss','log','cqn','lỗ'],
  ['cvss','qyz','cqn','quỷ'], ['cqn','thúy','cvss','thyj']
];
let ok = 0;
for (const [mode,input,field,expected] of cases){
  const actual = CVNSSConverter.convert(input, mode)[field];
  const pass = actual === expected; if (pass) ok++;
  console.log(`${pass ? 'PASS' : 'FAIL'} ${mode} ${input} -> ${field}: ${actual} expected ${expected}`);
}
const e = CVNSSConverter.explainWord('long','cqn');
console.log('explainWord lanes:', e.lanes.length);
const t = CVNSSConverter.trace('long lỗ xoay','cqn');
console.log('trace word tokens:', t.filter(x => x.lanes && x.lanes.length).length);
console.log(`${ok}/${cases.length} conversion tests passed`);
if (ok !== cases.length || e.lanes.length !== 4) process.exitCode = 1;
