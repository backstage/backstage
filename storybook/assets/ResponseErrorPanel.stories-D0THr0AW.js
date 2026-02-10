import{j as t}from"./iframe-CDQkRPtg.js";import{R as s}from"./ResponseErrorPanel-DKY_Obn9.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-BvnDxryc.js";import"./WarningPanel-DP_PPUp-.js";import"./ExpandMore-Bwto4mGt.js";import"./AccordionDetails-Cp5Nx1Lx.js";import"./index-B9sM2jn7.js";import"./Collapse-DIN7Ymif.js";import"./MarkdownContent-aPcN5Cf2.js";import"./CodeSnippet-CRThj8mN.js";import"./Box-CFWJqO9C.js";import"./styled-CcM8fDvt.js";import"./CopyTextButton-D-Xv6vTC.js";import"./useCopyToClipboard-DyF_TS4U.js";import"./useMountedState-C2nQ5XSq.js";import"./Tooltip-BVQgiQsu.js";import"./Popper-fSAvrd0-.js";import"./Portal-uMAxVVb4.js";import"./Grid-CLxLLrBH.js";import"./List-Ciyy1sk9.js";import"./ListContext-C9VfLDtj.js";import"./ListItem-CsL3oSDi.js";import"./ListItemText-DHloRduP.js";import"./Divider-o218nSC0.js";const F={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
