import{j as t}from"./iframe-D7hFsAHh.js";import{R as s}from"./ResponseErrorPanel-CPtvEkTP.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-REZtkXZm.js";import"./WarningPanel-BXBOJrST.js";import"./ExpandMore-e5K7_2D4.js";import"./AccordionDetails-Bs_9tEgl.js";import"./index-B9sM2jn7.js";import"./Collapse-CX1fKFyZ.js";import"./MarkdownContent-lDWK0lAQ.js";import"./CodeSnippet-DfGrFjGG.js";import"./Box-D-wD6_7y.js";import"./styled-CbYuIyxW.js";import"./CopyTextButton-NjimjsMr.js";import"./useCopyToClipboard-CaZKc_Tm.js";import"./useMountedState-jyZ6jmpg.js";import"./Tooltip-5tHvVIiB.js";import"./Popper-DQ1szM6i.js";import"./Portal-8ZiP_Sqy.js";import"./Grid-BBTPNutj.js";import"./List-CIMPRI7k.js";import"./ListContext-D0CqRlfT.js";import"./ListItem-CLTebMeN.js";import"./ListItemText-Ben4oQC7.js";import"./Divider-DMcnu_lF.js";const F={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
