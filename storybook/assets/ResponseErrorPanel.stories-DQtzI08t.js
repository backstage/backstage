import{j as t}from"./iframe-C7l5P2_I.js";import{R as s}from"./ResponseErrorPanel-DOMe2sqT.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-DO0dhQTG.js";import"./ErrorPanel-8I3SgwC9.js";import"./WarningPanel-BPh4fMZg.js";import"./ExpandMore-CJL170OC.js";import"./AccordionDetails-Ctvsfxbt.js";import"./index-B9sM2jn7.js";import"./Collapse-Ch0HaP0g.js";import"./MarkdownContent-DVR9imM6.js";import"./CodeSnippet-D-XpegSk.js";import"./Box-CnwfTMBK.js";import"./styled-BQ5_1fzN.js";import"./CopyTextButton-DfneHI78.js";import"./useCopyToClipboard-CR8tyuMd.js";import"./useMountedState-C3T3GhQF.js";import"./Tooltip-DXtsjz2q.js";import"./Popper-CuIlqdpq.js";import"./Portal-YwRf0OFq.js";import"./Grid-3Bz-t9Mk.js";import"./List-C_Ju4KCi.js";import"./ListContext-Dobuofun.js";import"./ListItem-DkGdhH3Z.js";import"./ListItemText-BiXUwKFP.js";import"./Divider-5Td0Zzlj.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
