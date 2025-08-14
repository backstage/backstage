import{j as l}from"./jsx-runtime-hv06LKfz.js";import{r as s}from"./index-D8-PC79C.js";import{H as d}from"./HeaderLabel-DQbyVxBE.js";import"./makeStyles-CJp8qHqH.js";import"./defaultTheme-NkpNA350.js";import"./Grid-8Ap4jsYG.js";import"./capitalize-fS9uM6tv.js";import"./withStyles-BsQ9H3bp.js";import"./hoist-non-react-statics.cjs-DtcWCWp5.js";import"./Typography-NhBf-tfS.js";import"./Link-m8k68nLc.js";import"./index-DlxYA1zJ.js";import"./lodash-D1GzKnrP.js";import"./index-DXvUqTe6.js";import"./index-BITTEREo.js";import"./index-B7KODvs-.js";import"./typeof-ZI2KZN5z.js";import"./createSvgIcon-Bpme_iea.js";import"./createChainedFunction-Da-WpsAN.js";import"./createSvgIcon-D-gz-Nq7.js";import"./debounce-DtXjJkxj.js";import"./isMuiElement-DKhW5xVU.js";import"./ownerWindow-CjzjL4wv.js";import"./useIsFocusVisible-BFy7UoKA.js";import"./useControlled-CliGfT3L.js";import"./unstable_useId-DQJte0g1.js";import"./useApp-BOX1l_wP.js";import"./ApiRef-ByCJBjX1.js";import"./useAnalytics-Q-nz63z2.js";import"./ConfigApi-ij0WO1-Y.js";const g={hour:"2-digit",minute:"2-digit"};function c(a,i){const t=new Date,n=window.navigator.language,o=[];if(!a)return o;for(const r of a){let e=r.label;const m={timeZone:r.timeZone,...i??g};try{new Date().toLocaleString(n,m)}catch{console.warn(`The timezone ${m.timeZone} is invalid. Defaulting to GMT`),m.timeZone="GMT",e="GMT"}const p=t.toLocaleTimeString(n,m),u=t.toLocaleTimeString(n,{timeZone:m.timeZone,hour:"2-digit",minute:"2-digit",hour12:!1});o.push({label:e,value:p,dateTime:u})}return o}const f=a=>{const{clockConfigs:i,customTimeFormat:t}=a,n=[],[o,r]=s.useState(n);return s.useEffect(()=>{r(c(i,t));const e=setInterval(()=>{r(c(i,t))},1e3);return()=>{clearInterval(e)}},[i,t]),o.length!==0?l.jsx(l.Fragment,{children:o.map(e=>l.jsx(d,{label:e.label,value:l.jsx("time",{dateTime:e.dateTime,children:e.value})},e.label))}):null};f.__docgenInfo={description:`A component to display a configurable list of clocks for various time zones.

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
