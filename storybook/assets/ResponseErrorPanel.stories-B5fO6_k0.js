import{j as t}from"./iframe-DbI6eD9d.js";import{R as s}from"./ResponseErrorPanel-D8-NS-6t.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-DlUDd-32.js";import"./WarningPanel-M9-9T0mj.js";import"./ExpandMore-CGV1QMso.js";import"./AccordionDetails-BibEu-2M.js";import"./index-B9sM2jn7.js";import"./Collapse-DuLdQbrv.js";import"./MarkdownContent-BnX0THa8.js";import"./CodeSnippet-Cbn7wM4l.js";import"./Box-B_5N4RtH.js";import"./styled-Ca3T9n7C.js";import"./CopyTextButton-B5-s-8U_.js";import"./useCopyToClipboard-DYI1pKNQ.js";import"./useMountedState-x9skCR0V.js";import"./Tooltip-Bq7wKed5.js";import"./Popper-9ImL6E1W.js";import"./Portal-1epzlOBv.js";import"./Grid-Bk30WVxK.js";import"./List-B28Z8F3S.js";import"./ListContext-D83WNTGA.js";import"./ListItem-BiTyGeEf.js";import"./ListItemText-Cbx6sNjJ.js";import"./Divider-CO6unGqT.js";const F={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
