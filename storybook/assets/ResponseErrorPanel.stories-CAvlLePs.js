import{j as t}from"./iframe-DsSIhbnH.js";import{R as s}from"./ResponseErrorPanel-Bie8pNSQ.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-BTdK2mva.js";import"./ErrorPanel-CZEIKFQ8.js";import"./WarningPanel-BMSmUhUZ.js";import"./ExpandMore-cDvbVPBi.js";import"./AccordionDetails-snfMz8Qp.js";import"./index-B9sM2jn7.js";import"./Collapse-CHKKtFrf.js";import"./MarkdownContent-Dr9_9m3_.js";import"./CodeSnippet-Dv95AdAh.js";import"./Box-CLIZZYjM.js";import"./styled-B9BbiYac.js";import"./CopyTextButton-CfEMnb5X.js";import"./useCopyToClipboard-DVNa0Xen.js";import"./useMountedState-C6iJ77g7.js";import"./Tooltip-Cs7i-ltk.js";import"./Popper-BoqtvTN5.js";import"./Portal-BImzt5t3.js";import"./Grid-DCNbb8Yd.js";import"./List-CxhAFISx.js";import"./ListContext-B0w45w1v.js";import"./ListItem-CaDFxyiK.js";import"./ListItemText-BTHgyaEj.js";import"./Divider-D86QvihC.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
