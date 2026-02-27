import{j as t}from"./iframe-DBRGxMDW.js";import{R as s}from"./ResponseErrorPanel-COjmtLQZ.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-ByaqqE0C.js";import"./ErrorPanel-B6C3U4LZ.js";import"./WarningPanel-BMIQ5GyE.js";import"./ExpandMore-BJVel_cX.js";import"./AccordionDetails-B05jq2YI.js";import"./index-B9sM2jn7.js";import"./Collapse-DdFfCEeX.js";import"./MarkdownContent-CzuJJ67p.js";import"./CodeSnippet-CAZt93aq.js";import"./Box-CntJUP1x.js";import"./styled-BtxC7hTc.js";import"./CopyTextButton-ClL_MRRy.js";import"./useCopyToClipboard-CSzcS2W-.js";import"./useMountedState-B06bP6zn.js";import"./Tooltip-DE5RCm9h.js";import"./Popper-BGeENWN1.js";import"./Portal-DK6syPsc.js";import"./Grid-DUgNNeQ8.js";import"./List-Dwh_b94U.js";import"./ListContext-GpQvqqGL.js";import"./ListItem-DtNY3IdH.js";import"./ListItemText-5EBnSTxE.js";import"./Divider-C3R9iOnK.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
