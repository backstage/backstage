import{r as s,j as m}from"./iframe-sMBKWU31.js";import{H as d}from"./HeaderLabel-DaWZZ8J-.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-CxRaH0Ei.js";import"./Grid-DA2cDQ0c.js";import"./Link-DV5C9zz1.js";import"./index-Da0ZMUP-.js";import"./lodash-xPEtg8gK.js";import"./index-DWl5mw-m.js";import"./useAnalytics-BN4IS_dq.js";import"./useApp-CzP7aWaG.js";const g={hour:"2-digit",minute:"2-digit"};function c(l,o){const t=new Date,i=window.navigator.language,n=[];if(!l)return n;for(const r of l){let e=r.label;const a={timeZone:r.timeZone,...o??g};try{new Date().toLocaleString(i,a)}catch{console.warn(`The timezone ${a.timeZone} is invalid. Defaulting to GMT`),a.timeZone="GMT",e="GMT"}const u=t.toLocaleTimeString(i,a),p=t.toLocaleTimeString(i,{timeZone:a.timeZone,hour:"2-digit",minute:"2-digit",hour12:!1});n.push({label:e,value:u,dateTime:p})}return n}const f=l=>{const{clockConfigs:o,customTimeFormat:t}=l,i=[],[n,r]=s.useState(i);return s.useEffect(()=>{r(c(o,t));const e=setInterval(()=>{r(c(o,t))},1e3);return()=>{clearInterval(e)}},[o,t]),n.length!==0?m.jsx(m.Fragment,{children:n.map(e=>m.jsx(d,{label:e.label,value:m.jsx("time",{dateTime:e.dateTime,children:e.value})},e.label))}):null};f.__docgenInfo={description:`A component to display a configurable list of clocks for various time zones.

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
