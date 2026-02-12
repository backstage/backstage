import{j as t}from"./iframe-B4O_Vvag.js";import{R as s}from"./ResponseErrorPanel-BEtieaAP.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-cJwDV4Qm.js";import"./ErrorPanel-BPDybmbI.js";import"./WarningPanel-Dbz6BQRg.js";import"./ExpandMore-DONQ1lY5.js";import"./AccordionDetails-DQBgwQHT.js";import"./index-B9sM2jn7.js";import"./Collapse-Uq2x7IVK.js";import"./MarkdownContent-D60dqvO7.js";import"./CodeSnippet-0JgoJIED.js";import"./Box-C04O_gsk.js";import"./styled-PYdNBIQ3.js";import"./CopyTextButton-Cy5Qxtwa.js";import"./useCopyToClipboard-CAw7bZaa.js";import"./useMountedState-DZGFeKc4.js";import"./Tooltip-DIKSL5Jf.js";import"./Popper-BBytZYgc.js";import"./Portal-xwYCxZwo.js";import"./Grid-_k0ZCqMG.js";import"./List-DFytLOeW.js";import"./ListContext-sIVQTiWf.js";import"./ListItem-5COuZZ3k.js";import"./ListItemText-Vzx2Fo7K.js";import"./Divider-DqNecIse.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:"(args: ErrorPanelProps) => <ResponseErrorPanel {...args} />",...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:"(args: ErrorPanelProps) => <ResponseErrorPanel {...args} />",...e.parameters?.docs?.source}}};const N=["Default","WithTitle"];export{r as Default,e as WithTitle,N as __namedExportsOrder,I as default};
