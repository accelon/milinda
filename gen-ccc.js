import {nodefs,readTextContent, writeChanged} from 'ptk/nodebundle.cjs'
await nodefs
const out=[];
const outpali=[];
const outfootnote=[]
const startpat='<div class="nikaya">'
const midpat='<div id="east">'
const footnotepat='<span class="sutra_name">註解</span>'
const endpat='</div>'
const processfile=(content,fn,idx)=>{
    let footnote='';
    const at=content.indexOf(startpat);
    if (!~at) throw 'missing start '+fn
    const at3=content.indexOf(midpat);
    if (!~at3) throw 'missing mid '+fn

    let at2=content.lastIndexOf(endpat);
    if (!~at2) throw 'missing end '+fn

    const at4=content.indexOf(footnotepat);
    if (~at4) {
        footnote+=content.slice(at4);
        at2=at4
    }

    const palicontent=content.slice(at3,at2)
    .replace(/<[^>]+>/g,'');
    
    const chicontent=content.slice(at+startpat.length,at3)
    .replace(/<a onMouseover="note\(this,(\d+)\);">([^<]+)<\/a>/g,(m,fn,t)=>{
        return '^ff'+fn+'('+t+')';
    })
    .replace(/<a onMouseover="local\(this,(\d+)\);">([^<]+)<\/a>/g,(m,fn,t)=>{
        return '^f'+fn+'('+t+')';
    })
    .replace(/<[^>]+>/g,'')
    .replace(/\n+/g,'\n')


    footnote=footnote.replace(/\&nbsp;/g,' ')

    out.push('SECTION'+idx+'\n'+chicontent);
    outpali.push('SECTION'+idx+'\n'+palicontent);
    outfootnote.push('SECTION'+idx+'\n'+footnote
        .replace(/<span id="note(\d+)">/g,(m,m1)=>'^f'+m1+'\t' )
        .replace(/<[^>]+>/g,'')
        .replace(/\n+/g,'\n')
    );
}
for (let i=1;i<=36;i++) {
    const fn='raw/ccc/Mi'+i.toString()+'.htm';
    const content=readTextContent(fn);
    processfile(content,fn,i)
}

writeChanged('ccc.off',out.join('\n'),true);
writeChanged('ccc-pali.off',outpali.join('\n'),true);
writeChanged('ccc-footnote.txt',outfootnote.join('\n'),true);