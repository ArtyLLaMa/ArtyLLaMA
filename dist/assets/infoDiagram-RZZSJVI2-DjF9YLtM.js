import{_ as e,l as s,F as n,k as i,G as p}from"./index-BJNGhUTg.js";import{p as g}from"./gitGraph-YCYPL57B-DWbCZrnF.js";import"./_baseUniq-BbyDTv99.js";import"./_basePickBy-DS2uv1HN.js";import"./clone-CB_l4ztu.js";var v={parse:e(async r=>{const a=await g("info",r);s.debug(a)},"parse")},d={version:p},m=e(()=>d.version,"getVersion"),c={getVersion:m},l=e((r,a,o)=>{s.debug(`rendering info diagram
`+r);const t=n(a);i(t,100,400,!0),t.append("g").append("text").attr("x",100).attr("y",40).attr("class","version").attr("font-size",32).style("text-anchor","middle").text(`v${o}`)},"draw"),f={draw:l},F={parser:v,db:c,renderer:f};export{F as diagram};
