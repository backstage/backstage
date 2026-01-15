import{j as t}from"./iframe-C9MahRWh.js";import{R as s}from"./ResponseErrorPanel-CtiSdvLc.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-Cd_NhFA3.js";import"./WarningPanel-NX0KfHXh.js";import"./ExpandMore-C29ppj5F.js";import"./AccordionDetails-DeCV1Glt.js";import"./index-B9sM2jn7.js";import"./Collapse-COZrbk8h.js";import"./MarkdownContent-D9IOtBE8.js";import"./CodeSnippet-n_l-Y6Rc.js";import"./Box-CYNkyMDT.js";import"./styled-DiHiiZIS.js";import"./CopyTextButton-6HBTp066.js";import"./useCopyToClipboard-CMkmug0-.js";import"./useMountedState-Dn_kttD3.js";import"./Tooltip-BxZhHFnO.js";import"./Popper-BxhcTIEV.js";import"./Portal-CaSAJtdX.js";import"./Grid-Bq14PCTk.js";import"./List-Bf1QAwLS.js";import"./ListContext-C4u9JBBU.js";import"./ListItem-CEqAAvo8.js";import"./ListItemText-ULNmgNfA.js";import"./Divider-BPY2Btf9.js";const F={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
