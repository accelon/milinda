/* create text file from bilara-data*/
import { writeChanged,nodefs, filesFromPattern,readTextContent,meta_sc} from 'ptk/nodebundle.cjs'
await nodefs;

const bilara_folder='./bilara-data/root/pli/ms/sutta/kn/mil/'; //download from suttacentral/bilara-data

const files=filesFromPattern("*.json",bilara_folder)
files.sort((a,b)=>{
    const m1=a.match(/mil(\d+)\.?(\d*)\.?(\d*)/);
    const m2=a.match(/mil(\d+)\.?(\d*)\.?(\d*)/);
    const [a1,b1,c1]=[parseInt(m1[1]), parseInt(m1[2])||0, parseInt(m1[3])||0]
    const [a2,b2,c2]=[parseInt(m2[1]), parseInt(m2[2])||0, parseInt(m2[3])||0]
    if (a1==a2) {
        if (b1==b2) {
            return c1-c2;
        } else {
            return b1-b2;
        }
    } else {
        return a1-a2;
    }
})
console.log(files)
const out=[];
const convert=fn=>{
    let toclevel='';
    let prevn='',n='';
    const json=JSON.parse(readTextContent(bilara_folder+fn));
    out.push('^sc'+fn.slice(3,11).replace(/_ro?o?t?-?/,''));
    for (let key in json) {
        const at=key.indexOf(":0");
        if (~at) {
            if (!~key.indexOf(":0.1")) { // skip repeated Milindapañha
                toclevel=key.slice(at+3);
                out.push('^z'+toclevel+' '+json[key]);
            }
        } else {
            const n=key.match(/:(\d)/)[1]
            const id=(n!==prevn)?('^m'+n+' '):'';
            out.push(id+json[key])
            prevn=n;
        }
    }
}
files.forEach(convert);
writeChanged('sc.off',out.join('\n'),true)