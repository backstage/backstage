import{j as t}from"./iframe-DEXNC9RX.js";import{R as s}from"./ResponseErrorPanel-D2M3oc3Z.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-NRnP58h1.js";import"./WarningPanel-C7DL1AdG.js";import"./ExpandMore-Df24YjII.js";import"./AccordionDetails-K4eNqGeL.js";import"./index-B9sM2jn7.js";import"./Collapse-DklbiL-j.js";import"./MarkdownContent-yMYvzVpl.js";import"./CodeSnippet-D4GvPAYc.js";import"./Box-BngrI2dT.js";import"./styled-B4iJQM5t.js";import"./CopyTextButton-DdSDl_l7.js";import"./useCopyToClipboard-DLmeDm8w.js";import"./useMountedState-DIp_Aeij.js";import"./Tooltip-B5JVDv03.js";import"./Popper-Dtp4XQPR.js";import"./Portal-O6zOHTQ9.js";import"./Grid-DwntcsAr.js";import"./List-861P7w9f.js";import"./ListContext-CuQ6sOnh.js";import"./ListItem-BsFeXcoa.js";import"./ListItemText-SZBW9x2i.js";import"./Divider-DNnZbvf9.js";const F={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
