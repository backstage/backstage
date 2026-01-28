import{j as t}from"./iframe-Vo5gUnCl.js";import{R as s}from"./ResponseErrorPanel-C0NrlyuG.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-CECY8d1j.js";import"./WarningPanel-3Yi5HVAk.js";import"./ExpandMore-D0AdZzXp.js";import"./AccordionDetails-7QWkCXyJ.js";import"./index-B9sM2jn7.js";import"./Collapse-UgyrRMk3.js";import"./MarkdownContent-C2NiFE4k.js";import"./CodeSnippet-D6VjBC0k.js";import"./Box-DxK1aAZk.js";import"./styled-DKP2AsJk.js";import"./CopyTextButton-3h_uNDP1.js";import"./useCopyToClipboard-D18fnjgX.js";import"./useMountedState-Bh-KE1Jd.js";import"./Tooltip-CrljWSzR.js";import"./Popper-xVSLGgcC.js";import"./Portal-D4JBSn9P.js";import"./Grid-BEftOOde.js";import"./List-DaH1cfBf.js";import"./ListContext-CeAVa15U.js";import"./ListItem-C_bA5RtL.js";import"./ListItemText-DwHyTgsb.js";import"./Divider-CM863GtP.js";const F={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
