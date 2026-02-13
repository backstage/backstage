import{j as t}from"./iframe-CTfOr1ix.js";import{R as s}from"./ResponseErrorPanel-qS1m8f7r.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-1FwyOuiP.js";import"./ErrorPanel-DBFyoG9y.js";import"./WarningPanel-CEnFu6C_.js";import"./ExpandMore-Cdm4ed0t.js";import"./AccordionDetails-CKyiNgp-.js";import"./index-B9sM2jn7.js";import"./Collapse-SKy0v8ML.js";import"./MarkdownContent-Eyuxnq2G.js";import"./CodeSnippet-DqVn8wbQ.js";import"./Box-CL14vfYs.js";import"./styled-C_6pXOEP.js";import"./CopyTextButton-C9gW30zO.js";import"./useCopyToClipboard-Bl9wB9IS.js";import"./useMountedState-g2Ku3pig.js";import"./Tooltip-bV63MOr0.js";import"./Popper-BxZ3wRuZ.js";import"./Portal-6Q34r_Nq.js";import"./Grid-6mM_q0n-.js";import"./List-Dpi1Ei3o.js";import"./ListContext-BnXKdXJ6.js";import"./ListItem-BHAZbz_b.js";import"./ListItemText-Do1jigG-.js";import"./Divider-CxhoRXjC.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
