import{j as t}from"./iframe-DVtcQ4_z.js";import{R as s}from"./ResponseErrorPanel-CXSjn-d3.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-BTyMCoIE.js";import"./WarningPanel-DWnW9ndp.js";import"./ExpandMore-BZTl6lHp.js";import"./AccordionDetails-20s0m78U.js";import"./index-B9sM2jn7.js";import"./Collapse-BTPpLLfL.js";import"./MarkdownContent-C-D6oakD.js";import"./CodeSnippet-CJietKeS.js";import"./Box-D_1MPpAq.js";import"./styled-2Y3L2rTs.js";import"./CopyTextButton-DhwWsCh2.js";import"./useCopyToClipboard-ImQlBzLn.js";import"./useMountedState-rAyQYyeH.js";import"./Tooltip-dh41oCcd.js";import"./Popper-DhFFD-7P.js";import"./Portal-kTp41skA.js";import"./Grid-CRH4wMFl.js";import"./List-DxsGYjB2.js";import"./ListContext-Br6vO3Y2.js";import"./ListItem-C0fXON46.js";import"./ListItemText-CpGTJDVb.js";import"./Divider-BmAsVb_O.js";const F={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
