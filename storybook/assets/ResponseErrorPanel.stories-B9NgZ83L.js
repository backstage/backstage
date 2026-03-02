import{j as t}from"./iframe-ONoB0Qo9.js";import{R as s}from"./ResponseErrorPanel-D1qyg2Ow.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-dBjLM41z.js";import"./ErrorPanel-C8drJdDT.js";import"./WarningPanel-CDPPhuIe.js";import"./ExpandMore-CnBP7Bmd.js";import"./AccordionDetails-CWB1Mr1o.js";import"./index-B9sM2jn7.js";import"./Collapse-MLoitTWU.js";import"./MarkdownContent-BPPu5ch5.js";import"./CodeSnippet-CmhUFGv_.js";import"./Box-CTTPvdx5.js";import"./styled-CsufaxdX.js";import"./CopyTextButton-I7wVIits.js";import"./useCopyToClipboard-DhVkbUZU.js";import"./useMountedState-BkZqADEE.js";import"./Tooltip-C7OHiPo1.js";import"./Popper-BX5EB3tO.js";import"./Portal-B76g_OhK.js";import"./Grid-Bsj_4SyV.js";import"./List-BrOrhSy2.js";import"./ListContext-DWK5PcRa.js";import"./ListItem-WR66Sxo3.js";import"./ListItemText-DV1nrzVN.js";import"./Divider-BK-egiUk.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
