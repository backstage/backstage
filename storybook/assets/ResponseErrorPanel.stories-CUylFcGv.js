import{j as t}from"./iframe-BY6cr4Gs.js";import{R as s}from"./ResponseErrorPanel-jJbPaYnV.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-DAslEoWf.js";import"./WarningPanel-CSeK1Ani.js";import"./ExpandMore-3nEtbL-z.js";import"./AccordionDetails-B6u38Rkn.js";import"./index-B9sM2jn7.js";import"./Collapse-hpYL9C9B.js";import"./MarkdownContent-pb-oNpPa.js";import"./CodeSnippet-CfugQICb.js";import"./Box-CioLgZLe.js";import"./styled-C2PdKBXZ.js";import"./CopyTextButton-CGe-CNwz.js";import"./useCopyToClipboard-Cl0_Rkec.js";import"./useMountedState-wBq7rhLl.js";import"./Tooltip-BeI5iaz3.js";import"./Popper-DBVT3TNi.js";import"./Portal-RovY2swJ.js";import"./Grid-CPNST6ei.js";import"./List-BYnFuPKk.js";import"./ListContext-Cv7Ut4-T.js";import"./ListItem-Bc4c47Te.js";import"./ListItemText-DmFJDJ0x.js";import"./Divider-0kZVZRxa.js";const F={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
