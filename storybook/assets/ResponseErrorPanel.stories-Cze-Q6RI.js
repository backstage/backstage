import{j as t}from"./iframe-C3xQ7KiW.js";import{R as s}from"./ResponseErrorPanel-CrIhmAXu.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-DBmVe0pu.js";import"./ErrorPanel-C01WicVM.js";import"./WarningPanel-CYlRhppO.js";import"./ExpandMore-DqWbQO0P.js";import"./AccordionDetails-D-n-z2wN.js";import"./index-B9sM2jn7.js";import"./Collapse-ByZrZAzU.js";import"./MarkdownContent-DOPwbL0a.js";import"./CodeSnippet-BTHBpHJq.js";import"./Box-B9jbdd7x.js";import"./styled-O7qqppix.js";import"./CopyTextButton-Daqccpqg.js";import"./useCopyToClipboard-Bc6jKzDS.js";import"./useMountedState-VBi_CyPK.js";import"./Tooltip-BZhLiA6X.js";import"./Popper-Bei7-2Ph.js";import"./Portal-CUj0vCdE.js";import"./Grid-BxodhZCu.js";import"./List-DDcVRd1X.js";import"./ListContext-D0L7xoNS.js";import"./ListItem-SHU5LmI7.js";import"./ListItemText-DvpaBSJ3.js";import"./Divider-DqGlWDd1.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
