import{j as t}from"./iframe-IlkKTMMY.js";import{R as s}from"./ResponseErrorPanel-I5Mp-wpa.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-BvHv2sy6.js";import"./WarningPanel-Bh6C0KZr.js";import"./ExpandMore-BHR5lqHP.js";import"./AccordionDetails-D3hWIUkC.js";import"./index-B9sM2jn7.js";import"./Collapse-Ih_HTaQA.js";import"./MarkdownContent-CO4vdiSe.js";import"./CodeSnippet-CKzvA7pM.js";import"./Box-Co-CX5dU.js";import"./styled-Bwl9pvyb.js";import"./CopyTextButton-D2vWQiEu.js";import"./useCopyToClipboard-BnrSYYZL.js";import"./useMountedState-WoBaJtOj.js";import"./Tooltip-CtyCqi0f.js";import"./Popper-BekvFLxn.js";import"./Portal-WsTivW4Y.js";import"./Grid-CGYs8N7L.js";import"./List-CWjVqxD3.js";import"./ListContext-CqKUV46p.js";import"./ListItem-SM0MND7k.js";import"./ListItemText-Cme_dSwm.js";import"./Divider-BH0d_S5D.js";const F={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
