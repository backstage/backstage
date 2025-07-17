import{j as l}from"./jsx-runtime-CvpxdxdE.js";import{r as s}from"./index-DSHF18-l.js";import{H as d}from"./HeaderLabel-BorXQGMS.js";import"./makeStyles-yUUo8jj4.js";import"./defaultTheme-DT8oR2d2.js";import"./Grid-BY2EZ_z9.js";import"./capitalize-Bw5a1ocu.js";import"./withStyles-BYtY9EuN.js";import"./hoist-non-react-statics.cjs-DlMN-SZi.js";import"./Typography-C4wK928C.js";import"./Link-DmlXjQke.js";import"./index-jB8bSz_h.js";import"./lodash-D8aMxhkM.js";import"./index-DBvFAGNd.js";import"./index-CEhUYg2U.js";import"./ApiRef-DDVPwL0h.js";import"./interopRequireDefault-Y9pwbXtE.js";import"./createSvgIcon-Cq_PMNt4.js";import"./createChainedFunction-Da-WpsAN.js";import"./createSvgIcon-boREoDcc.js";import"./debounce-DtXjJkxj.js";import"./isMuiElement-fiJl_Gvd.js";import"./ownerWindow-BCxlYCSn.js";import"./useIsFocusVisible-Sgmp0f7s.js";import"./useControlled-i6Pam0ca.js";import"./unstable_useId-BAMTp7ON.js";import"./useAnalytics-BqSe3k6a.js";import"./ConfigApi-1QFqvuIK.js";const g={hour:"2-digit",minute:"2-digit"};function c(a,i){const t=new Date,n=window.navigator.language,o=[];if(!a)return o;for(const r of a){let e=r.label;const m={timeZone:r.timeZone,...i??g};try{new Date().toLocaleString(n,m)}catch{console.warn(`The timezone ${m.timeZone} is invalid. Defaulting to GMT`),m.timeZone="GMT",e="GMT"}const p=t.toLocaleTimeString(n,m),u=t.toLocaleTimeString(n,{timeZone:m.timeZone,hour:"2-digit",minute:"2-digit",hour12:!1});o.push({label:e,value:p,dateTime:u})}return o}const f=a=>{const{clockConfigs:i,customTimeFormat:t}=a,n=[],[o,r]=s.useState(n);return s.useEffect(()=>{r(c(i,t));const e=setInterval(()=>{r(c(i,t))},1e3);return()=>{clearInterval(e)}},[i,t]),o.length!==0?l.jsx(l.Fragment,{children:o.map(e=>l.jsx(d,{label:e.label,value:l.jsx("time",{dateTime:e.dateTime,children:e.value})},e.label))}):null};f.__docgenInfo={description:`A component to display a configurable list of clocks for various time zones.

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
