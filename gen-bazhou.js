import {nodefs,readTextContent, writeChanged} from 'ptk/nodebundle.cjs'
await nodefs
const out=[];
const outfootnote=[];
const startpat='敬礼薄伽梵、应供、正等正觉';
const endpat='下一页'
const footnotepat='注释：';

const tidy=s=>{
    return s.replace(/<[^>]+>/g,'').replace(/\n　+\n/g,'')
    .replace(/\&nbsp;/g,'')
    .replace(/\n +/g,'\n')
    .replace(/\n　+/g,'\n')
    // .replace(/\n上一页/g,'')
    .replace(/\n上一页\n/g,'')
    .replace(/\n+/g,'\n')
}
const processfile=(content,fn,idx)=>{
    const at=content.indexOf(startpat);
    if (!~at) throw 'invalid file '+fn
    
    let at2=content.lastIndexOf(endpat);
    if (!~at2) throw 'invalid file '+fn

    const at3=content.indexOf(footnotepat);

    if (~at3) {
        let footnotes=content.slice(at3+footnotepat.length,at2);
        outfootnote.push('^pg'+idx+'\n'+tidy(footnotes))
        at2=at3;
    }

    content=tidy(content.slice(at+startpat.length,at2))
    out.push('^pg'+idx+'\n'+content);

}
for (let i=1;i<=151;i++) {
    const fn='raw/bazhou/ncmlwwj-'+i.toString().padStart(2,'0')+'.html';
    const content=readTextContent(fn);
    processfile(content,fn,i)
}

writeChanged('bazhou.off',out.join('\n'),true);
writeChanged('bazhou-footnote.txt',outfootnote.join('\n'),true);