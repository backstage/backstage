import{j as l}from"./jsx-runtime-Cw0GR0a5.js";import{r as s}from"./index-CTjT7uj6.js";import{H as d}from"./HeaderLabel-B_XOA_kq.js";import"./makeStyles-3WuthtJ7.js";import"./defaultTheme-U8IXQtr7.js";import"./Grid-Cd4CaOSn.js";import"./capitalize-CjHL08xv.js";import"./withStyles-Dj_puyu8.js";import"./hoist-non-react-statics.cjs-DzIEFHQI.js";import"./Typography-CUBppVl0.js";import"./Link-Bp-Lt7-P.js";import"./index-Cqve-NHl.js";import"./lodash-CoGan1YB.js";import"./index-DwHHXP4W.js";import"./index-w6SBqnNd.js";import"./ApiRef-CqkoWjZn.js";import"./interopRequireDefault-Y9pwbXtE.js";import"./createSvgIcon-rCELOQ8q.js";import"./createChainedFunction-Da-WpsAN.js";import"./createSvgIcon-CAWH9WqG.js";import"./debounce-DtXjJkxj.js";import"./isMuiElement-B_4ddUuK.js";import"./ownerWindow-C3iVrxHF.js";import"./useIsFocusVisible-BQk2_Vhe.js";import"./useControlled-B47E2WMp.js";import"./unstable_useId-B3Hiq1YI.js";import"./useAnalytics-DVyBXs_0.js";import"./ConfigApi-D1qiBdfc.js";const g={hour:"2-digit",minute:"2-digit"};function c(a,i){const t=new Date,n=window.navigator.language,o=[];if(!a)return o;for(const r of a){let e=r.label;const m={timeZone:r.timeZone,...i??g};try{new Date().toLocaleString(n,m)}catch{console.warn(`The timezone ${m.timeZone} is invalid. Defaulting to GMT`),m.timeZone="GMT",e="GMT"}const p=t.toLocaleTimeString(n,m),u=t.toLocaleTimeString(n,{timeZone:m.timeZone,hour:"2-digit",minute:"2-digit",hour12:!1});o.push({label:e,value:p,dateTime:u})}return o}const f=a=>{const{clockConfigs:i,customTimeFormat:t}=a,n=[],[o,r]=s.useState(n);return s.useEffect(()=>{r(c(i,t));const e=setInterval(()=>{r(c(i,t))},1e3);return()=>{clearInterval(e)}},[i,t]),o.length!==0?l.jsx(l.Fragment,{children:o.map(e=>l.jsx(d,{label:e.label,value:l.jsx("time",{dateTime:e.dateTime,children:e.value})},e.label))}):null};f.__docgenInfo={description:`A component to display a configurable list of clocks for various time zones.

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
