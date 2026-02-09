import{j as t}from"./iframe-CXYsSFqX.js";import{R as s}from"./ResponseErrorPanel-BxgAeJKB.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-3Zd2cLU-.js";import"./WarningPanel-DIYvPX_4.js";import"./ExpandMore-DJZlK5Sd.js";import"./AccordionDetails-CCv3FdOB.js";import"./index-B9sM2jn7.js";import"./Collapse-BITvwjhQ.js";import"./MarkdownContent-Brn2l3Aj.js";import"./CodeSnippet-DkEMDFHo.js";import"./Box-DCh7b65F.js";import"./styled-DYzq_tB8.js";import"./CopyTextButton-DFxCHX8I.js";import"./useCopyToClipboard-BZhXOA9g.js";import"./useMountedState-2cXymIoR.js";import"./Tooltip-DYDrJaUH.js";import"./Popper-BaB5wJeP.js";import"./Portal-y4yvUJUe.js";import"./Grid-CBLufU_i.js";import"./List-CDWQPT5T.js";import"./ListContext-CWoF9LZC.js";import"./ListItem-DLX99J84.js";import"./ListItemText-CvzrIeis.js";import"./Divider-DuenxdSn.js";const F={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
