import{j as t}from"./iframe-B7rMUZLI.js";import{R as s}from"./ResponseErrorPanel-36gA4Y67.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-BbDOaNwq.js";import"./ErrorPanel-59tXLFlm.js";import"./WarningPanel-BGgx6ec1.js";import"./ExpandMore-DzZiZ1ed.js";import"./AccordionDetails-BQq5yz58.js";import"./index-B9sM2jn7.js";import"./Collapse-Dg7I3X8s.js";import"./MarkdownContent-DIsMNpfj.js";import"./CodeSnippet-DRR23uxD.js";import"./Box-DE3k0g2W.js";import"./styled-rHipxG34.js";import"./CopyTextButton-__9njuTe.js";import"./useCopyToClipboard-BFdRLNsJ.js";import"./useMountedState-DOMzvQnC.js";import"./Tooltip-DJ88mzvg.js";import"./Popper-TzRORtoi.js";import"./Portal-Gi_4ezMI.js";import"./Grid-ChmRa1xb.js";import"./List-NlkzeZDP.js";import"./ListContext-2sTnrhYf.js";import"./ListItem-DUvIrbAd.js";import"./ListItemText-C1Ml3ojI.js";import"./Divider-fyxZ8qXv.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
