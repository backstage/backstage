import{j as t}from"./iframe-C0ztlCqi.js";import{R as s}from"./ResponseErrorPanel-BlZHMxji.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-BYV5vIqY.js";import"./WarningPanel-DIeTt0sm.js";import"./ExpandMore-DjatSCT2.js";import"./AccordionDetails-Qdo8hGCI.js";import"./index-B9sM2jn7.js";import"./Collapse-BOuwDmTN.js";import"./MarkdownContent-B6mn0xbm.js";import"./CodeSnippet-B5tPiRbT.js";import"./Box-CzQDPnzy.js";import"./styled-CWdZ-Z1U.js";import"./CopyTextButton-CR_eNMPC.js";import"./useCopyToClipboard-Cj1xpuKu.js";import"./useMountedState-CWuBAMfh.js";import"./Tooltip-BUzhfLp0.js";import"./Popper-BpDPZdlA.js";import"./Portal-DgY2uLlM.js";import"./Grid-BJIH9AcQ.js";import"./List-dufFXco6.js";import"./ListContext-CkQIvbtj.js";import"./ListItem-BjSKqJNR.js";import"./ListItemText-C6kGUtI_.js";import"./Divider-CQWOB-Qy.js";const F={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:"(args: ErrorPanelProps) => <ResponseErrorPanel {...args} />",...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:"(args: ErrorPanelProps) => <ResponseErrorPanel {...args} />",...e.parameters?.docs?.source}}};const I=["Default","WithTitle"];export{r as Default,e as WithTitle,I as __namedExportsOrder,F as default};
