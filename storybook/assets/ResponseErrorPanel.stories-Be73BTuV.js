import{j as t}from"./iframe-C1ohgxPY.js";import{R as s}from"./ResponseErrorPanel-CNlpb1Oh.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-Cu206NQf.js";import"./WarningPanel-Cqk4HdYp.js";import"./ExpandMore-BahcoyIm.js";import"./AccordionDetails-Ci8EIrXK.js";import"./index-B9sM2jn7.js";import"./Collapse-BVJkjsmV.js";import"./MarkdownContent-CG5N0PWp.js";import"./CodeSnippet-CdNwSyzj.js";import"./Box-B9XEklXr.js";import"./styled-DiQntVKI.js";import"./CopyTextButton-Cqy0wuG-.js";import"./useCopyToClipboard-ByZDolH4.js";import"./useMountedState-m4mlNTW7.js";import"./Tooltip-Dpj1LhZh.js";import"./Popper-BcbGe3J0.js";import"./Portal-CA7fRi5Y.js";import"./Grid-ClUEh4fm.js";import"./List-BRbAiMJU.js";import"./ListContext-Ds-TBdUQ.js";import"./ListItem-Ck2-kEA7.js";import"./ListItemText-Bu4Q5VY7.js";import"./Divider-D8U2y_Q5.js";const F={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
