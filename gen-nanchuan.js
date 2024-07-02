import {readTextContent, nodefs,DOMFromString,meta_cbeta,xpath,walkDOM, writeChanged} from 'ptk/nodebundle.cjs'
await nodefs;
const filelist=[],notes=[];
for( let i=1;i<=13;i++)  filelist.push('N63/N63n0031_'+(i.toString().padStart(3,'0'))+'.xml');
for( let i=14;i<=25;i++)  filelist.push('N64/N64n0031_'+(i.toString().padStart(3,'0'))+'.xml');
const ctx={
    ncount:0,
};
const onOpen={
    "cb:mulu":(tag,ctx)=>{
        if (!ctx.started) return '';
        return '^z'+tag.attrs.level+'['
    },
    milestone:(tag,ctx)=>{//to hide repeated mulu at the beginning.
        ctx.started=true;
    },
    head:(tag,ctx)=>ctx.hide=true,
    note:(tag,ctx)=>{
        //two occurence
    },

    l:()=>{
        return '\n'
    },
    origfoot:(tag,ctx)=>{
        ctx.ncount++
        notes.push([ctx.ncount,tag.attrs.t]);
        return '^f'+ (ctx.ncount);
    },
    "cb:div":()=>{
        return '\n'
    },    
    p:()=>{
        return '\n'
    },    
};
const onClose={
    "cb:mulu":(tag,ctx)=>{
        if (!ctx.started) return '';
        return ']'
    },
    head:(tag,ctx)=>ctx.hide=false,
};
const onText=(t)=>{
    if (!ctx.started)return ''
    return ctx.hide?'':t.trim();
}

const epilog=s=>{
    return s.replace(/\n+/g,'\n').replace(/【CB】，【南傳】默/g,'');//only two note added (not replace to <_note)
}
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
    ctx.started=false;
    const content=readTextContent('/3rd/cbeta/N/'+fn);
    const parsed=parseTEI(content,fn,ctx);

    out.push(epilog(parsed))
}

filelist.forEach(processfile)

writeChanged('nanchuan.off',out.join('\n'),true);
writeChanged('nanchuan_notes.tsv',notes.join('\n'),true)