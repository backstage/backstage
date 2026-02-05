import{r as m,j as s}from"./iframe-M9O-K8SB.js";import{H as p}from"./HeaderLabel-Dj7RUNcf.js";import"./preload-helper-PPVm8Dsz.js";import"./Grid-DxciBpqo.js";import"./Link-Btc0GL0z.js";import"./lodash-Czox7iJy.js";import"./index-CuiKZooy.js";import"./useAnalytics-8ya555GT.js";import"./useApp-Citse85p.js";const g={hour:"2-digit",minute:"2-digit"};function c(l,o){const t=new Date,i=window.navigator.language,n=[];if(!l)return n;for(const r of l){let e=r.label;const a={timeZone:r.timeZone,...o??g};try{new Date().toLocaleString(i,a)}catch{console.warn(`The timezone ${a.timeZone} is invalid. Defaulting to GMT`),a.timeZone="GMT",e="GMT"}const u=t.toLocaleTimeString(i,a),d=t.toLocaleTimeString(i,{timeZone:a.timeZone,hour:"2-digit",minute:"2-digit",hour12:!1});n.push({label:e,value:u,dateTime:d})}return n}const f=l=>{const{clockConfigs:o,customTimeFormat:t}=l,i=[],[n,r]=m.useState(i);return m.useEffect(()=>{r(c(o,t));const e=setInterval(()=>{r(c(o,t))},1e3);return()=>{clearInterval(e)}},[o,t]),n.length!==0?s.jsx(s.Fragment,{children:n.map(e=>s.jsx(p,{label:e.label,value:s.jsx("time",{dateTime:e.dateTime,children:e.value})},e.label))}):null};f.__docgenInfo={description:`A component to display a configurable list of clocks for various time zones.

@example
Here's a simple example:
\`\`\`
// This will give you a clock for the time zone that Stockholm is in
// you can add more than one but keep in mind space may be limited
const clockConfigs: ClockConfig[] = [
 {
   label: 'STO',
   timeZone: 'Europe/Stockholm',
 },
];

// Setting hour12 to false will make all the clocks show in the 24hr format
const timeFormat: Intl.DateTimeFormatOptions = {
 hour: '2-digit',
 minute: '2-digit',
 hour12: false,
};

// Here is the component in use:
<HeaderWorldClock
 clockConfigs={clockConfigs}
 customTimeFormat={timeFormat}
/>
\`\`\`

@public`,methods:[],displayName:"HeaderWorldClock",props:{clockConfigs:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  label: string;
  timeZone: string;
}`,signature:{properties:[{key:"label",value:{name:"string",required:!0}},{key:"timeZone",value:{name:"string",required:!0}}]}}],raw:"ClockConfig[]"},description:""},customTimeFormat:{required:!1,tsType:{name:"Intl.DateTimeFormatOptions"},description:""}}};export{f as HeaderWorldClock};
