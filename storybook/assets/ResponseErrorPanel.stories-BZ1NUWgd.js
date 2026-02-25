import{j as t}from"./iframe-DhudO7cT.js";import{R as s}from"./ResponseErrorPanel-jTgGw--z.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-DirKP-uM.js";import"./ErrorPanel-BEeSwh_R.js";import"./WarningPanel-DWteI-lj.js";import"./ExpandMore-Dzyb0v5N.js";import"./AccordionDetails-DA1Ac_9j.js";import"./index-B9sM2jn7.js";import"./Collapse-Si3YYgpF.js";import"./MarkdownContent-BGd3KqzE.js";import"./CodeSnippet-jJNwy4RK.js";import"./Box-Dfq4Rk_q.js";import"./styled-Bb0qtC6P.js";import"./CopyTextButton-j222rm7k.js";import"./useCopyToClipboard-DhzHiaOU.js";import"./useMountedState-Cnm9VAPO.js";import"./Tooltip-DGvAz1hB.js";import"./Popper-ByURgkss.js";import"./Portal-DHDPWTL1.js";import"./Grid-jH0iynLg.js";import"./List-CETIUmeh.js";import"./ListContext-DXxn2Iso.js";import"./ListItem--o6-pCQj.js";import"./ListItemText-BSb4Izlr.js";import"./Divider-RGA0wFT4.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
