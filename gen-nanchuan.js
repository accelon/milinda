import {readTextContent, nodefs,DOMFromString,meta_cbeta,xpath,walkDOM, writeChanged} from 'ptk/nodebundle.cjs'
await nodefs;
const filelist=[];
for( let i=1;i<=13;i++)  filelist.push('N63/N63n0031_'+(i.toString().padStart(3,'0'))+'.xml');
for( let i=14;i<=25;i++)  filelist.push('N64/N64n0031_'+(i.toString().padStart(3,'0'))+'.xml');

const onOpen={};
const onClose={};
const onText=(t)=>{
    return t;
}
const ctx={
};
const parseTEI=(content,filename,ctx)=>{
    content=meta_cbeta.nullify(content);
    //writeChanged(filename+'-nullify.xml',content,true)
    const el=DOMFromString(content);
    if (!el) {
        console.log('invalide xml');
        return '';
    }
    const charmaps=meta_cbeta.buildCharMap(el); //CB缺字 及unicode/拼形式 對照表
    ctx.charmaps=charmaps;
    ctx.filename=filename;

    const body=xpath(el,'text/body');
    walkDOM(body,ctx,onOpen,onClose,onText);
    const str=ctx.out;
    
    ctx.out='';
    return str;
}

const out=[];
const processfile=(fn)=>{
    const content=readTextContent('/3rd/cbeta/N/'+fn);
    const parsed=parseTEI(content,fn,ctx);
    out.push(parsed)
}

filelist.forEach(processfile)

writeChanged('nanchuan.txt',out.join('\n'),true);