import {nodefs,readTextContent, writeChanged} from 'ptk/nodebundle.cjs'
await nodefs
const out=[];
const startpat='敬礼薄伽梵、应供、正等正觉';
const endpat='下一页'
const processfile=(content,fn)=>{
    const at=content.indexOf(startpat);
    if (!~at) throw 'invalid file '+fn
    
    const at2=content.lastIndexOf(endpat);
    if (!~at2) throw 'invalid file '+fn

    content=content.slice(at+startpat.length,at2).replace(/<[^>]+>/g,'').replace(/\n　+\n/g,'')
    .replace(/\&nbsp;/g,'')
    .replace(/\n +/g,'\n')
    .replace(/\n　+/g,'\n')
    // .replace(/\n上一页/g,'')
    .replace(/\n+/g,'\n');
    out.push(content);

}
for (let i=1;i<=151;i++) {
    const fn='raw/bazhou/ncmlwwj-'+i.toString().padStart(2,'0')+'.html';
    const content=readTextContent(fn);
    processfile(content,fn)
}

writeChanged('bazhou.txt',out.join('\n'),true);