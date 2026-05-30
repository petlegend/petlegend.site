import { useState, useEffect, Fragment } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";

const PRODS = ['사료','간식','용품','의약품','기타'];
const CATS  = ['수입','수출','국내'];
const RTS   = ['수입','수출','국내','관리'];
const MNS   = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
const CC    = { '수입':'#2563eb','수출':'#059669','국내':'#e07d10','관리':'#7c3aed' };
const NV    = '#1e3a5f';

const S = {
  async g(k,d){ try{ const r=await window.storage.get(k); return r?JSON.parse(r.value):d; }catch{ return d; } },
  async s(k,v){ try{ await window.storage.set(k,JSON.stringify(v)); }catch{} }
};

function w2m(ws){
  const [y,w]=ws.split('-W').map(Number);
  const d=new Date(y,0,4);
  d.setDate(d.getDate()-((d.getDay()+6)%7)+(w-1)*7);
  return d.getMonth()+1;
}
function wlbl(ws){
  const [y,w]=ws.split('-W').map(Number);
  const d=new Date(y,0,4);
  d.setDate(d.getDate()-((d.getDay()+6)%7)+(w-1)*7);
  const e=new Date(d); e.setDate(d.getDate()+4);
  return `${d.getMonth()+1}/${d.getDate()} ~ ${e.getMonth()+1}/${e.getDate()}`;
}
function fm(n){
  if(!n && n!==0) return '-';
  if(n===0) return '0';
  const a=Math.abs(n);
  if(a>=1e8)  return (n/1e8).toFixed(1)+'억';
  if(a>=1e7)  return Math.round(n/1e7)+'천만';
  if(a>=1e4)  return Math.round(n/1e4)+'만';
  return Math.round(n).toLocaleString();
}
function rt(a,p){ return p>0 ? Math.round(a/p*100)+'%' : '-'; }
function sm(a,f='actual'){ return a.reduce((s,e)=>s+(e[f]||0),0); }

function PB({pct,c}){
  return(
    <div style={{background:'#f1f5f9',borderRadius:4,height:7,width:'100%',overflow:'hidden'}}>
      <div style={{background:pct>=100?'#059669':(c||NV),width:Math.min(pct||0,100)+'%',height:'100%',borderRadius:4,transition:'width .7s ease'}}/>
    </div>
  );
}

export default function App(){
  const [tab,setTab]=useState('input');
  const [sales,setSales]=useState([]);
  const [reps,setReps]=useState([]);
  const [ap,setAp]=useState({});
  const [ok,setOk]=useState(false);
  const [msg,setMsg]=useState('');

  const [wk,setWk]=useState('2026-W21');
  const [per,setPer]=useState('');
  const [cat,setCat]=useState('수입');
  const [pi,setPi]=useState(PRODS.reduce((a,p)=>({...a,[p]:{pl:'',ac:''}}),{}));
  const [ri,setRi]=useState(RTS.reduce((a,t)=>({...a,[t]:{tw:'',nw:''}}),{}));
  const [apIn,setApIn]=useState(CATS.reduce((a,c)=>({...a,[c]:''}),{}));

  useEffect(()=>{
    (async()=>{
      const [s,r,p]=await Promise.all([S.g('pl_s',[]),S.g('pl_r',[]),S.g('pl_p',{})]);
      setSales(s); setReps(r); setAp(p);
      setApIn(CATS.reduce((a,c)=>({...a,[c]:p[c]?String(p[c]):''}),{}));
      setOk(true);
    })();
  },[]);

  useEffect(()=>{
    const es=sales.filter(e=>e.wk===wk&&e.cat===cat&&e.per===per);
    const np=PRODS.reduce((a,p)=>({...a,[p]:{pl:'',ac:''}}),{});
    es.forEach(e=>{ if(np[e.prod]) np[e.prod]={pl:e.plan?String(e.plan):'',ac:e.actual?String(e.actual):''}; });
    setPi(np);
  },[wk,cat,per,sales]);

  useEffect(()=>{
    const wr=reps.filter(r=>r.wk===wk);
    const nt=RTS.reduce((a,t)=>({...a,[t]:{tw:'',nw:''}}),{});
    wr.forEach(r=>{ if(nt[r.type]) nt[r.type]={tw:r.tw||'',nw:r.nw||''}; });
    setRi(nt);
  },[wk,reps]);

  const ntf=m=>{ setMsg(m); setTimeout(()=>setMsg(''),2500); };

  const saveSales=async()=>{
    const mo=w2m(wk),yr=parseInt(wk.split('-W')[0]),es=[];
    PRODS.forEach(p=>{
      const i=pi[p];
      if(i.pl||i.ac) es.push({id:`${wk}__${per}__${cat}__${p}`,wk,year:yr,month:mo,per,cat,prod:p,plan:parseFloat(i.pl)||0,actual:parseFloat(i.ac)||0,at:new Date().toISOString()});
    });
    const u=[...sales];
    es.forEach(e=>{ const i=u.findIndex(x=>x.id===e.id); if(i>=0) u[i]=e; else u.push(e); });
    setSales(u); await S.s('pl_s',u); ntf('✓ 매출 데이터 저장 완료');
  };

  const saveReps=async()=>{
    const mo=w2m(wk),yr=parseInt(wk.split('-W')[0]);
    const nr=RTS.filter(t=>ri[t].tw||ri[t].nw).map(t=>({id:`${wk}__${t}`,wk,year:yr,month:mo,type:t,tw:ri[t].tw,nw:ri[t].nw,at:new Date().toISOString()}));
    const u=[...reps];
    nr.forEach(r=>{ const i=u.findIndex(x=>x.id===r.id); if(i>=0) u[i]=r; else u.push(r); });
    setReps(u); await S.s('pl_r',u); ntf('✓ 업무보고 저장 완료');
  };

  const saveAp=async()=>{
    const p=CATS.reduce((a,c)=>({...a,[c]:parseFloat(apIn[c])||0}),{});
    setAp(p); await S.s('pl_p',p); ntf('✓ 연간계획 저장 완료');
  };

  // Dashboard
  const cy=parseInt(wk.split('-W')[0]), cm=w2m(wk);
  const ws=sales.filter(e=>e.wk===wk);
  const ms=sales.filter(e=>e.year===cy&&e.month===cm);
  const as=sales.filter(e=>e.year===cy);
  const wA=sm(ws), wP=sm(ws,'plan');
  const mA=sm(ms), mP=sm(ms,'plan');
  const aA=sm(as), aPt=CATS.reduce((s,c)=>s+(ap[c]||0),0);

  const ctd=CATS.map(c=>({
    cat:c,
    wP:sm(ws.filter(e=>e.cat===c),'plan'), wA:sm(ws.filter(e=>e.cat===c)),
    mP:sm(ms.filter(e=>e.cat===c),'plan'), mA:sm(ms.filter(e=>e.cat===c)),
    aP:ap[c]||0, aA:sm(as.filter(e=>e.cat===c))
  }));

  const pcd=PRODS.map(p=>({ name:p, 계획:sm(ms.filter(e=>e.prod===p),'plan'), 실적:sm(ms.filter(e=>e.prod===p)) }));
  const trd=MNS.map((name,i)=>{ const d=sales.filter(e=>e.year===cy&&e.month===i+1); const r={name}; CATS.forEach(c=>{ r[c]=sm(d.filter(e=>e.cat===c)); }); return r; });
  const wpt=PRODS.map(p=>{ const r={prod:p}; CATS.forEach(c=>{ const d=ws.filter(e=>e.cat===c&&e.prod===p); r[c+'p']=sm(d,'plan'); r[c+'a']=sm(d); }); r.tp=CATS.reduce((s,c)=>s+(r[c+'p']||0),0); r.ta=CATS.reduce((s,c)=>s+(r[c+'a']||0),0); return r; });

  // Styles
  const st={
    pg: {fontFamily:"'Noto Sans KR','Apple SD Gothic Neo',sans-serif",background:'#f1f5f9',minHeight:'100vh'},
    hd: {background:NV,color:'#fff',padding:'12px 20px',display:'flex',justifyContent:'space-between',alignItems:'center'},
    nv: {background:'#fff',display:'flex',borderBottom:'1px solid #e2e8f0',flexWrap:'wrap'},
    nb: a=>({padding:'10px 16px',border:'none',background:'none',cursor:'pointer',fontSize:'13px',fontWeight:a?600:400,color:a?NV:'#64748b',borderBottom:a?`2px solid ${NV}`:'2px solid transparent',whiteSpace:'nowrap'}),
    bd: {padding:'16px',maxWidth:'880px',margin:'0 auto'},
    cd: {background:'#fff',borderRadius:10,padding:'16px 18px',marginBottom:14,border:'0.5px solid #e2e8f0'},
    ct: {fontSize:14,fontWeight:600,color:NV,marginBottom:10,display:'flex',alignItems:'center',gap:6},
    lb: {fontSize:12,color:'#64748b',fontWeight:500,marginBottom:3},
    ip: {padding:'7px 10px',border:'1px solid #e2e8f0',borderRadius:6,fontSize:13,width:'100%',boxSizing:'border-box'},
    bt: {padding:'8px 18px',background:NV,color:'#fff',border:'none',borderRadius:6,cursor:'pointer',fontSize:13,fontWeight:500},
    bto: {padding:'8px 16px',background:'#fff',color:NV,border:`1px solid ${NV}`,borderRadius:6,cursor:'pointer',fontSize:13},
    th: {padding:'6px 8px',textAlign:'center',background:'#f8fafc',color:'#374151',fontWeight:600,fontSize:11,borderBottom:'1px solid #e2e8f0',whiteSpace:'nowrap'},
    thl:{padding:'6px 8px',textAlign:'left',background:'#f8fafc',color:'#374151',fontWeight:600,fontSize:11,borderBottom:'1px solid #e2e8f0'},
    td: {padding:'6px 8px',textAlign:'center',borderBottom:'0.5px solid #f3f4f6',fontSize:12},
    tdl:{padding:'6px 8px',textAlign:'left',borderBottom:'0.5px solid #f3f4f6',fontSize:12,fontWeight:500},
    kg: {display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(128px,1fr))',gap:10,marginBottom:14},
    kc: c=>({background:'#fff',border:'0.5px solid #e2e8f0',borderRadius:10,padding:'12px 14px',borderTop:`3px solid ${c||NV}`}),
    kl: {fontSize:11,color:'#94a3b8',fontWeight:500,marginBottom:3},
    kv: {fontSize:20,fontWeight:700,color:'#1e293b'},
    ks: {fontSize:11,color:'#64748b',marginTop:2},
    ta: {padding:'8px 10px',border:'1px solid #e2e8f0',borderRadius:6,fontSize:12,resize:'vertical',width:'100%',minHeight:72,boxSizing:'border-box',fontFamily:'inherit'},
    bg: c=>({display:'inline-block',padding:'2px 9px',borderRadius:10,fontSize:11,fontWeight:600,background:(c||NV)+'22',color:c||NV}),
    g2: {display:'grid',gridTemplateColumns:'1fr 1fr',gap:12},
  };

  const rateColor = r => r>=100?'#059669':r>=80?'#d97706':'#ef4444';

  if(!ok) return <div style={{padding:40,textAlign:'center',color:'#64748b',fontFamily:'sans-serif'}}>⏳ 데이터 로딩 중...</div>;

  return(
  <div style={st.pg}>

    {/* ── Header ── */}
    <div style={st.hd}>
      <div>
        <div style={{fontSize:17,fontWeight:700,letterSpacing:'-0.5px'}}>🐾 (주)펫레전드 위클리 리포트</div>
        <div style={{fontSize:11,color:'rgba(255,255,255,0.45)',marginTop:1}}>Pet Legend Weekly Report System</div>
      </div>
      <div style={{textAlign:'right'}}>
        <div style={{fontSize:12,background:'rgba(255,255,255,0.15)',borderRadius:6,padding:'4px 14px'}}>{wk} &nbsp;·&nbsp; {wlbl(wk)}</div>
        {msg && <div style={{fontSize:11,color:'#4ade80',marginTop:3}}>{msg}</div>}
      </div>
    </div>

    {/* ── Nav ── */}
    <div style={st.nv}>
      {[{id:'input',l:'📝 주간 입력'},{id:'dashboard',l:'📊 매출 대시보드'},{id:'report',l:'📋 업무 보고'},{id:'data',l:'⚙️ 데이터 관리'}].map(t=>(
        <button key={t.id} style={st.nb(tab===t.id)} onClick={()=>setTab(t.id)}>{t.l}</button>
      ))}
    </div>

    <div style={st.bd}>

      {/* ═══════════════════════════ INPUT TAB ═══════════════════════════ */}
      {tab==='input' && <>
        {/* 기준설정 */}
        <div style={st.cd}>
          <div style={st.ct}>📅 보고 기준 설정</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
            <div>
              <div style={st.lb}>주차 선택</div>
              <input type="week" value={wk} onChange={e=>setWk(e.target.value)} style={st.ip}/>
              <div style={{fontSize:11,color:'#94a3b8',marginTop:2}}>{wlbl(wk)}</div>
            </div>
            <div>
              <div style={st.lb}>담당자</div>
              <input value={per} onChange={e=>setPer(e.target.value)} placeholder="이름 입력" style={st.ip}/>
            </div>
            <div>
              <div style={st.lb}>업무 구분</div>
              <div style={{display:'flex',gap:6}}>
                {CATS.map(c=>(
                  <button key={c} onClick={()=>setCat(c)} style={{flex:1,padding:'7px 0',border:`1px solid ${cat===c?CC[c]:'#e2e8f0'}`,borderRadius:6,cursor:'pointer',fontSize:13,fontWeight:cat===c?600:400,background:cat===c?CC[c]+'18':'#fff',color:cat===c?CC[c]:'#374151'}}>{c}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 매출입력 */}
        <div style={st.cd}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
            <div style={st.ct}>💰 매출 실적 입력 &nbsp;<span style={st.bg(CC[cat])}>{cat}</span></div>
            <div style={{fontSize:11,color:'#94a3b8'}}>단위: 원</div>
          </div>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr>
              <th style={{...st.thl,width:'22%'}}>제품</th>
              <th style={st.th}>계획 (원)</th>
              <th style={st.th}>실적 (원)</th>
              <th style={st.th}>달성율</th>
            </tr></thead>
            <tbody>
              {PRODS.map(p=>{
                const v=pi[p]; const pv=parseFloat(v.pl)||0, av=parseFloat(v.ac)||0; const r=pv>0?Math.round(av/pv*100):0;
                return <tr key={p}>
                  <td style={st.tdl}>{p}</td>
                  <td style={st.td}><input value={v.pl} onChange={e=>setPi(prev=>({...prev,[p]:{...prev[p],pl:e.target.value}}))} placeholder="0" style={{...st.ip,textAlign:'right'}} type="number"/></td>
                  <td style={st.td}><input value={v.ac} onChange={e=>setPi(prev=>({...prev,[p]:{...prev[p],ac:e.target.value}}))} placeholder="0" style={{...st.ip,textAlign:'right'}} type="number"/></td>
                  <td style={{...st.td,minWidth:75}}>
                    {pv>0 && <><div style={{fontSize:12,fontWeight:600,color:rateColor(r),marginBottom:3}}>{r}%</div><PB pct={r} c={CC[cat]}/></>}
                  </td>
                </tr>;
              })}
              <tr style={{background:'#f8fafc'}}>
                <td style={{...st.tdl,fontWeight:700,color:NV}}>합계</td>
                <td style={{...st.td,fontWeight:600}}>{PRODS.reduce((s,p)=>s+(parseFloat(pi[p].pl)||0),0).toLocaleString()}</td>
                <td style={{...st.td,fontWeight:600}}>{PRODS.reduce((s,p)=>s+(parseFloat(pi[p].ac)||0),0).toLocaleString()}</td>
                <td style={st.td}>{(()=>{
                  const tp=PRODS.reduce((s,p)=>s+(parseFloat(pi[p].pl)||0),0);
                  const ta=PRODS.reduce((s,p)=>s+(parseFloat(pi[p].ac)||0),0);
                  const r=tp>0?Math.round(ta/tp*100):0;
                  return tp>0?<span style={{color:rateColor(r),fontWeight:700}}>{r}%</span>:'-';
                })()}</td>
              </tr>
            </tbody>
          </table>
          <div style={{marginTop:10,textAlign:'right'}}>
            <button style={st.bt} onClick={saveSales}>💾 매출 데이터 저장</button>
          </div>
        </div>

        {/* 업무보고 입력 */}
        <div style={st.cd}>
          <div style={st.ct}>📝 업무 보고 입력</div>
          {RTS.map((t,i)=>(
            <div key={t} style={{marginBottom:14,paddingBottom:14,borderBottom:i<RTS.length-1?'0.5px solid #f3f4f6':'none'}}>
              <div style={{marginBottom:8}}>
                <span style={{...st.bg(CC[t]||'#7c3aed'),fontSize:13,padding:'3px 14px'}}>{t} 업무보고</span>
              </div>
              <div style={st.g2}>
                <div>
                  <div style={{...st.lb,color:'#2563eb',marginBottom:4}}>🔷 금주 결과</div>
                  <textarea value={ri[t].tw} onChange={e=>setRi(prev=>({...prev,[t]:{...prev[t],tw:e.target.value}}))} placeholder={`${t} 금주 주요 결과 입력`} style={st.ta}/>
                </div>
                <div>
                  <div style={{...st.lb,color:'#d97706',marginBottom:4}}>🔶 차주 목표</div>
                  <textarea value={ri[t].nw} onChange={e=>setRi(prev=>({...prev,[t]:{...prev[t],nw:e.target.value}}))} placeholder={`${t} 차주 목표 입력`} style={{...st.ta,background:'#fffbf0'}}/>
                </div>
              </div>
            </div>
          ))}
          <div style={{textAlign:'right'}}>
            <button style={st.bt} onClick={saveReps}>💾 업무보고 저장</button>
          </div>
        </div>
      </>}

      {/* ═══════════════════════════ DASHBOARD TAB ═══════════════════════════ */}
      {tab==='dashboard' && <>

        {/* KPI Cards */}
        <div style={st.kg}>
          {[
            {l:'금주 실적', v:fm(wA), s:`계획 ${fm(wP)}`, c:NV},
            {l:'금주 달성율', v:rt(wA,wP), s:wP>0?`${fm(Math.abs(wA-wP))} ${wA>=wP?'초과':'미달'}`:'계획없음', c:'#2563eb'},
            {l:`${cm}월 누적실적`, v:fm(mA), s:`계획 ${fm(mP)}`, c:'#059669'},
            {l:'월간 달성율', v:rt(mA,mP), s:`${cm}월 기준`, c:'#d97706'},
            {l:'연간 누적실적', v:fm(aA), s:`계획 ${fm(aPt)}`, c:'#7c3aed'},
            {l:'연간 진척율', v:rt(aA,aPt), s:`${cy}년 기준`, c:'#db2777'},
          ].map((k,i)=>(
            <div key={i} style={st.kc(k.c)}>
              <div style={st.kl}>{k.l}</div>
              <div style={st.kv}>{k.v}</div>
              <div style={st.ks}>{k.s}</div>
            </div>
          ))}
        </div>

        {/* 업무구분별 계획대비 */}
        <div style={st.cd}>
          <div style={st.ct}>📊 업무구분별 계획 대비 실적 (수입 → 수출 → 국내)</div>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',minWidth:600}}>
              <thead>
                <tr>
                  <th style={st.thl} rowSpan={2}>구분</th>
                  <th style={{...st.th,background:'#eff6ff'}} colSpan={3}>주간</th>
                  <th style={{...st.th,background:'#f0fdf4'}} colSpan={3}>{cm}월 누적</th>
                  <th style={{...st.th,background:'#faf5ff'}} colSpan={3}>연간</th>
                </tr>
                <tr>
                  {['계획','실적','달성율','계획','실적','달성율','계획','실적','달성율'].map((h,i)=>(
                    <th key={i} style={st.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ctd.map(r=>{
                  const wr=r.wP>0?Math.round(r.wA/r.wP*100):null;
                  const mr=r.mP>0?Math.round(r.mA/r.mP*100):null;
                  const ar=r.aP>0?Math.round(r.aA/r.aP*100):null;
                  return <tr key={r.cat}>
                    <td style={st.tdl}><span style={st.bg(CC[r.cat])}>{r.cat}</span></td>
                    <td style={{...st.td,color:'#94a3b8'}}>{fm(r.wP)}</td>
                    <td style={{...st.td,fontWeight:600}}>{fm(r.wA)}</td>
                    <td style={{...st.td,color:wr!=null?rateColor(wr):'#94a3b8',fontWeight:500}}>{rt(r.wA,r.wP)}</td>
                    <td style={{...st.td,color:'#94a3b8'}}>{fm(r.mP)}</td>
                    <td style={{...st.td,fontWeight:600}}>{fm(r.mA)}</td>
                    <td style={{...st.td,color:mr!=null?rateColor(mr):'#94a3b8',fontWeight:500}}>{rt(r.mA,r.mP)}</td>
                    <td style={{...st.td,color:'#94a3b8'}}>{fm(r.aP)}</td>
                    <td style={{...st.td,fontWeight:600}}>{fm(r.aA)}</td>
                    <td style={{...st.td,minWidth:80}}>
                      <div style={{color:ar!=null?rateColor(ar):'#94a3b8',fontWeight:500,marginBottom:3}}>{rt(r.aA,r.aP)}</div>
                      {r.aP>0 && <PB pct={ar} c={CC[r.cat]}/>}
                    </td>
                  </tr>;
                })}
                <tr style={{background:'#f8fafc'}}>
                  <td style={{...st.tdl,fontWeight:700,color:NV}}>합계</td>
                  {[['wP','wA'],['mP','mA']].map(([pk,ak],gi)=>(
                    <Fragment key={gi}>
                      <td style={{...st.td,color:'#94a3b8',fontWeight:600}}>{fm(ctd.reduce((s,r)=>s+r[pk],0))}</td>
                      <td style={{...st.td,fontWeight:700}}>{fm(ctd.reduce((s,r)=>s+r[ak],0))}</td>
                      <td style={st.td}>{rt(ctd.reduce((s,r)=>s+r[ak],0),ctd.reduce((s,r)=>s+r[pk],0))}</td>
                    </Fragment>
                  ))}
                  <td style={{...st.td,color:'#94a3b8',fontWeight:600}}>{fm(CATS.reduce((s,c)=>s+(ap[c]||0),0))}</td>
                  <td style={{...st.td,fontWeight:700}}>{fm(ctd.reduce((s,r)=>s+r.aA,0))}</td>
                  <td style={st.td}>{rt(ctd.reduce((s,r)=>s+r.aA,0),CATS.reduce((s,c)=>s+(ap[c]||0),0))}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Charts row */}
        <div style={st.g2}>
          <div style={st.cd}>
            <div style={st.ct}>📦 제품별 월간 실적 ({cm}월)</div>
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={pcd} margin={{top:5,right:8,left:0,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/>
                <XAxis dataKey="name" tick={{fontSize:10}}/>
                <YAxis tickFormatter={fm} tick={{fontSize:9}} width={48}/>
                <Tooltip formatter={(v,n)=>[v.toLocaleString()+'원',n]}/>
                <Legend wrapperStyle={{fontSize:11}}/>
                <Bar dataKey="계획" fill="#cbd5e1" radius={[3,3,0,0]}/>
                <Bar dataKey="실적" fill={NV} radius={[3,3,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={st.cd}>
            <div style={st.ct}>🎯 연간 목표 진척도 ({cy}년)</div>
            {CATS.map(c=>{
              const a=as.filter(e=>e.cat===c).reduce((s,e)=>s+e.actual,0);
              const p=ap[c]||0; const r=p>0?Math.round(a/p*100):0;
              return <div key={c} style={{marginBottom:14}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                  <span style={{fontSize:13,fontWeight:600,color:CC[c]}}>{c}</span>
                  <span style={{fontSize:11,color:'#64748b'}}>{fm(a)} / {fm(p)} &nbsp;<strong style={{color:p>0?rateColor(r):'#94a3b8'}}>{p>0?r+'%':'-'}</strong></span>
                </div>
                <PB pct={r} c={CC[c]}/>
              </div>;
            })}
            <div style={{borderTop:'0.5px solid #f3f4f6',paddingTop:10,marginTop:4}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                <span style={{fontSize:13,fontWeight:600,color:NV}}>전체 합계</span>
                <span style={{fontSize:11,color:'#64748b'}}>{fm(aA)} / {fm(aPt)} &nbsp;<strong style={{color:aPt>0?rateColor(Math.round(aA/aPt*100)):'#94a3b8'}}>{aPt>0?Math.round(aA/aPt*100)+'%':'-'}</strong></span>
              </div>
              <PB pct={aPt>0?Math.round(aA/aPt*100):0} c={NV}/>
            </div>
          </div>
        </div>

        {/* Monthly trend */}
        <div style={st.cd}>
          <div style={st.ct}>📈 월간 매출 추이 ({cy}년 · 업무구분별)</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trd} margin={{top:5,right:15,left:0,bottom:5}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/>
              <XAxis dataKey="name" tick={{fontSize:10}}/>
              <YAxis tickFormatter={fm} tick={{fontSize:9}} width={50}/>
              <Tooltip formatter={(v,n)=>[v.toLocaleString()+'원',n]}/>
              <Legend wrapperStyle={{fontSize:12}}/>
              {CATS.map(c=><Line key={c} type="monotone" dataKey={c} stroke={CC[c]} strokeWidth={2} dot={{r:3}}/>)}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly product table */}
        <div style={st.cd}>
          <div style={st.ct}>🗓 제품별 주간 실적 상세 ({wk} / {wlbl(wk)})</div>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',minWidth:580}}>
              <thead>
                <tr>
                  <th style={st.thl} rowSpan={2}>제품</th>
                  {CATS.map(c=><th key={c} style={{...st.th,color:CC[c]}} colSpan={2}>{c}</th>)}
                  <th style={st.th} colSpan={2}>합계</th>
                </tr>
                <tr>
                  {[...CATS,'합계'].map(c=>(
                    <Fragment key={c}>
                      <th style={st.th}>계획</th>
                      <th style={st.th}>실적</th>
                    </Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {wpt.map(r=>(
                  <tr key={r.prod}>
                    <td style={st.tdl}>{r.prod}</td>
                    {CATS.map(c=>(
                      <Fragment key={c}>
                        <td style={{...st.td,color:'#94a3b8'}}>{fm(r[c+'p'])}</td>
                        <td style={{...st.td,fontWeight:500}}>{fm(r[c+'a'])}</td>
                      </Fragment>
                    ))}
                    <td style={{...st.td,color:'#94a3b8'}}>{fm(r.tp)}</td>
                    <td style={{...st.td,fontWeight:700}}>{fm(r.ta)}</td>
                  </tr>
                ))}
                <tr style={{background:'#f8fafc'}}>
                  <td style={{...st.tdl,fontWeight:700,color:NV}}>합계</td>
                  {CATS.map(c=>(
                    <Fragment key={c}>
                      <td style={{...st.td,color:'#94a3b8',fontWeight:600}}>{fm(wpt.reduce((s,r)=>s+(r[c+'p']||0),0))}</td>
                      <td style={{...st.td,fontWeight:700}}>{fm(wpt.reduce((s,r)=>s+(r[c+'a']||0),0))}</td>
                    </Fragment>
                  ))}
                  <td style={{...st.td,color:'#94a3b8',fontWeight:600}}>{fm(wpt.reduce((s,r)=>s+r.tp,0))}</td>
                  <td style={{...st.td,fontWeight:700}}>{fm(wpt.reduce((s,r)=>s+r.ta,0))}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </>}

      {/* ═══════════════════════════ REPORT TAB ═══════════════════════════ */}
      {tab==='report' && <>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <div style={{fontSize:13,color:'#64748b',display:'flex',alignItems:'center',gap:8}}>
            주차 선택:
            <input type="week" value={wk} onChange={e=>setWk(e.target.value)} style={{...st.ip,width:'auto',display:'inline',padding:'5px 8px'}}/>
            <span style={{color:'#94a3b8',fontSize:12}}>{wlbl(wk)}</span>
          </div>
        </div>
        {RTS.map(t=>{
          const rep=reps.find(r=>r.wk===wk&&r.type===t);
          const cl=CC[t]||'#7c3aed';
          return <div key={t} style={{...st.cd,borderLeft:`4px solid ${cl}`,paddingLeft:14,marginBottom:12}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
              <span style={{...st.bg(cl),fontSize:13,padding:'3px 14px'}}>{t} 업무보고</span>
              {rep?.at && <span style={{fontSize:10,color:'#cbd5e1',marginLeft:'auto'}}>수정: {new Date(rep.at).toLocaleString('ko-KR',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'})}</span>}
            </div>
            <div style={st.g2}>
              <div>
                <div style={{fontSize:12,fontWeight:600,color:'#2563eb',marginBottom:5}}>🔷 금주 결과</div>
                <div style={{background:'#f0f9ff',borderRadius:8,padding:'10px 14px',fontSize:13,lineHeight:1.7,minHeight:84,color:rep?.tw?'#1e293b':'#94a3b8',whiteSpace:'pre-wrap'}}>{rep?.tw||'(미입력)'}</div>
              </div>
              <div>
                <div style={{fontSize:12,fontWeight:600,color:'#d97706',marginBottom:5}}>🔶 차주 목표</div>
                <div style={{background:'#fffbeb',borderRadius:8,padding:'10px 14px',fontSize:13,lineHeight:1.7,minHeight:84,color:rep?.nw?'#1e293b':'#94a3b8',whiteSpace:'pre-wrap'}}>{rep?.nw||'(미입력)'}</div>
              </div>
            </div>
          </div>;
        })}
        <div style={{textAlign:'center',marginTop:6}}>
          <button style={{...st.bto,fontSize:12}} onClick={()=>setTab('input')}>✏️ 입력 탭에서 업무보고 수정하기</button>
        </div>
      </>}

      {/* ═══════════════════════════ DATA TAB ═══════════════════════════ */}
      {tab==='data' && <>
        {/* 연간계획 */}
        <div style={st.cd}>
          <div style={st.ct}>🎯 연간 계획 설정 ({cy}년)</div>
          <div style={{fontSize:12,color:'#64748b',marginBottom:10}}>업무구분별 연간 매출 목표를 입력하세요. 대시보드의 진척율 계산에 사용됩니다.</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:12}}>
            {CATS.map(c=>(
              <div key={c}>
                <div style={{...st.lb,color:CC[c],fontWeight:600}}>{c} 연간계획 (원)</div>
                <input value={apIn[c]} onChange={e=>setApIn(prev=>({...prev,[c]:e.target.value}))} placeholder="연간계획 금액 입력" style={{...st.ip,borderLeft:`3px solid ${CC[c]}`}} type="number"/>
                {ap[c]>0 && <div style={{fontSize:11,color:'#64748b',marginTop:2}}>저장됨: {fm(ap[c])}원</div>}
              </div>
            ))}
          </div>
          <button style={st.bt} onClick={saveAp}>연간계획 저장</button>
        </div>

        {/* 통계 */}
        <div style={st.cd}>
          <div style={st.ct}>📁 저장 데이터 현황</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:10,marginBottom:16}}>
            {[
              {l:'매출 레코드',v:sales.length+'건',s:'총 입력 건수'},
              {l:'업무보고',v:reps.length+'건',s:'총 보고 건수'},
              {l:'수집 주차수',v:[...new Set(sales.map(e=>e.wk))].length+'주',s:'데이터 기간'},
              {l:'담당자 수',v:[...new Set(sales.map(e=>e.per).filter(Boolean))].length+'명',s:'입력 인원'},
            ].map((k,i)=>(
              <div key={i} style={st.kc(NV)}>
                <div style={st.kl}>{k.l}</div>
                <div style={{...st.kv,fontSize:18}}>{k.v}</div>
                <div style={st.ks}>{k.s}</div>
              </div>
            ))}
          </div>

          <div style={{fontSize:13,fontWeight:600,color:'#374151',marginBottom:8}}>최근 입력 데이터 (최대 20건)</div>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',minWidth:500}}>
              <thead><tr>
                {['주차','월','담당자','구분','제품','계획','실적','달성율','입력일'].map(h=><th key={h} style={st.th}>{h}</th>)}
              </tr></thead>
              <tbody>
                {[...sales].sort((a,b)=>new Date(b.at||0)-new Date(a.at||0)).slice(0,20).map(e=>{
                  const r=e.plan>0?Math.round(e.actual/e.plan*100):0;
                  return <tr key={e.id}>
                    <td style={st.td}>{e.wk}</td>
                    <td style={st.td}>{e.month}월</td>
                    <td style={st.td}>{e.per||'-'}</td>
                    <td style={st.td}><span style={st.bg(CC[e.cat])}>{e.cat}</span></td>
                    <td style={st.td}>{e.prod}</td>
                    <td style={{...st.td,color:'#94a3b8'}}>{fm(e.plan)}</td>
                    <td style={{...st.td,fontWeight:600}}>{fm(e.actual)}</td>
                    <td style={{...st.td,color:e.plan>0?rateColor(r):'#94a3b8',fontWeight:500}}>{e.plan>0?r+'%':'-'}</td>
                    <td style={{...st.td,fontSize:10,color:'#94a3b8'}}>{e.at?new Date(e.at).toLocaleDateString('ko-KR'):'-'}</td>
                  </tr>;
                })}
                {sales.length===0 && <tr><td colSpan={9} style={{...st.td,color:'#94a3b8',padding:24,textAlign:'center'}}>입력된 데이터가 없습니다</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        {/* 초기화 */}
        <div style={{...st.cd,borderTop:'2px solid #fee2e2'}}>
          <div style={{...st.ct,color:'#ef4444'}}>⚠️ 데이터 초기화</div>
          <div style={{fontSize:12,color:'#64748b',marginBottom:10}}>삭제된 데이터는 복구할 수 없습니다. 신중하게 사용하세요.</div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            <button style={{...st.bto,borderColor:'#ef4444',color:'#ef4444'}} onClick={async()=>{ if(confirm('매출 데이터를 모두 삭제하시겠습니까?')){ setSales([]); await S.s('pl_s',[]); ntf('✓ 매출 데이터 초기화 완료'); } }}>매출 데이터 초기화</button>
            <button style={{...st.bto,borderColor:'#ef4444',color:'#ef4444'}} onClick={async()=>{ if(confirm('업무보고를 모두 삭제하시겠습니까?')){ setReps([]); await S.s('pl_r',[]); ntf('✓ 업무보고 초기화 완료'); } }}>업무보고 초기화</button>
            <button style={{...st.bto,borderColor:'#ef4444',color:'#ef4444'}} onClick={async()=>{ if(confirm('모든 데이터를 초기화하시겠습니까?')){ setSales([]); setReps([]); setAp({}); setApIn(CATS.reduce((a,c)=>({...a,[c]:''}),{})); await S.s('pl_s',[]); await S.s('pl_r',[]); await S.s('pl_p',{}); ntf('✓ 전체 데이터 초기화 완료'); } }}>전체 초기화</button>
          </div>
        </div>
      </>}

    </div>
  </div>
  );
}
