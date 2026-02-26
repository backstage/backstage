import{j as t}from"./iframe-DGowiHGf.js";import{R as s}from"./ResponseErrorPanel-Dai1VuMf.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-BB1S9Pq6.js";import"./ErrorPanel-CelOcstS.js";import"./WarningPanel-DI90orEf.js";import"./ExpandMore-D4mtaBX9.js";import"./AccordionDetails-M9tEoS0J.js";import"./index-B9sM2jn7.js";import"./Collapse-CvbY4nyw.js";import"./MarkdownContent-D2WJUTsj.js";import"./CodeSnippet-Di0IjEa6.js";import"./Box-VCK17nNx.js";import"./styled-CW0ZllnF.js";import"./CopyTextButton-DVNEFKMR.js";import"./useCopyToClipboard-BXawMXPt.js";import"./useMountedState-BoYu2riY.js";import"./Tooltip-Lr-cB2mL.js";import"./Popper-OdyRH94b.js";import"./Portal-SyAq80li.js";import"./Grid-DloVQjFg.js";import"./List-BJFCJqLc.js";import"./ListContext-C2un48fJ.js";import"./ListItem-tq9DsB-6.js";import"./ListItemText-Basmz87l.js";import"./Divider-hi0NCk2q.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
  <ResponseErrorPanel
    error={new Error("Error message from error object")}
    defaultExpanded={false}
  />
);
`,...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const WithTitle = () => (
  <ResponseErrorPanel
    error={new Error("test")}
    defaultExpanded={false}
    title="Title prop is passed"
  />
);
`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:"(args: ErrorPanelProps) => <ResponseErrorPanel {...args} />",...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:"(args: ErrorPanelProps) => <ResponseErrorPanel {...args} />",...e.parameters?.docs?.source}}};const N=["Default","WithTitle"];export{r as Default,e as WithTitle,N as __namedExportsOrder,I as default};
