import{j as t}from"./iframe-BBTbmRF3.js";import{R as s}from"./ResponseErrorPanel-Dhn6RZp5.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-BPqnV28r.js";import"./ErrorPanel-C_yw0DMG.js";import"./WarningPanel-EUHTMGmd.js";import"./ExpandMore-DN4woXWK.js";import"./AccordionDetails-CLOLleIs.js";import"./index-B9sM2jn7.js";import"./Collapse-DmTiXi65.js";import"./MarkdownContent-Cn2mK-dU.js";import"./CodeSnippet-DUB0oVp5.js";import"./Box-DFn50L67.js";import"./styled-Cxigd6bq.js";import"./CopyTextButton-CAs-B4cE.js";import"./useCopyToClipboard-BWVjd4W6.js";import"./useMountedState-BCYhz7B5.js";import"./Tooltip-CdzZ4H0f.js";import"./Popper-BgTVAObk.js";import"./Portal-2y-oZ47a.js";import"./Grid-CuXpcFIC.js";import"./List-CUBDdxMb.js";import"./ListContext-B4Kfs7vL.js";import"./ListItem-gGS09kMG.js";import"./ListItemText-DFAT17VC.js";import"./Divider-BYkXUStE.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
