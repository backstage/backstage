import{j as t}from"./iframe-CmF8XmXW.js";import{R as s}from"./ResponseErrorPanel-Bw7C81dv.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-Ibhc4-lx.js";import"./ErrorPanel-DwPayJ2R.js";import"./WarningPanel-_AyfI691.js";import"./ExpandMore-BnNCizO_.js";import"./AccordionDetails-BYaC3E9d.js";import"./index-B9sM2jn7.js";import"./Collapse-BS0HCykQ.js";import"./MarkdownContent-B0jZk0lY.js";import"./CodeSnippet-Bxnp2WGp.js";import"./Box-D2-qDd5p.js";import"./styled-Cq2u0_JF.js";import"./CopyTextButton-xmjJbH78.js";import"./useCopyToClipboard-BzKQk1qC.js";import"./useMountedState-R5vPNZNY.js";import"./Tooltip-DhgmU7T0.js";import"./Popper-CVpB9i3l.js";import"./Portal-DLYTgwQk.js";import"./Grid-DKauYoce.js";import"./List-D_AhGxTu.js";import"./ListContext-CMFfQs0i.js";import"./ListItem-BaOpUjbT.js";import"./ListItemText-CrhfGm7Z.js";import"./Divider-BTYI3J8W.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
