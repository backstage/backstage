import{r as s,j as m}from"./iframe-C97aGyUm.js";import{H as d}from"./HeaderLabel-Fkw_MuLg.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-BH_X-duW.js";import"./Grid-B4D-XE5H.js";import"./Link-CtyWu2T9.js";import"./index-J5_UG62z.js";import"./lodash-CjTo-pxC.js";import"./index-D3xivPOe.js";import"./useAnalytics-CPFwZTkm.js";import"./useApp-CJrMf8iL.js";const g={hour:"2-digit",minute:"2-digit"};function c(l,o){const t=new Date,i=window.navigator.language,n=[];if(!l)return n;for(const r of l){let e=r.label;const a={timeZone:r.timeZone,...o??g};try{new Date().toLocaleString(i,a)}catch{console.warn(`The timezone ${a.timeZone} is invalid. Defaulting to GMT`),a.timeZone="GMT",e="GMT"}const u=t.toLocaleTimeString(i,a),p=t.toLocaleTimeString(i,{timeZone:a.timeZone,hour:"2-digit",minute:"2-digit",hour12:!1});n.push({label:e,value:u,dateTime:p})}return n}const f=l=>{const{clockConfigs:o,customTimeFormat:t}=l,i=[],[n,r]=s.useState(i);return s.useEffect(()=>{r(c(o,t));const e=setInterval(()=>{r(c(o,t))},1e3);return()=>{clearInterval(e)}},[o,t]),n.length!==0?m.jsx(m.Fragment,{children:n.map(e=>m.jsx(d,{label:e.label,value:m.jsx("time",{dateTime:e.dateTime,children:e.value})},e.label))}):null};f.__docgenInfo={description:`A component to display a configurable list of clocks for various time zones.

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
