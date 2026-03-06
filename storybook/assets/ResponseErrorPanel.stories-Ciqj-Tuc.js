import{j as t}from"./iframe-y42y8Oej.js";import{R as s}from"./ResponseErrorPanel-hBXI5IJ7.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-DJdTRUmQ.js";import"./ErrorPanel-Vmv2e2jh.js";import"./WarningPanel-B8f7_bz_.js";import"./ExpandMore-BHDyeZqq.js";import"./AccordionDetails-7Fb7C26_.js";import"./index-B9sM2jn7.js";import"./Collapse-DFtdJCo5.js";import"./MarkdownContent-C_ct0HRg.js";import"./CodeSnippet-ErvL8mI9.js";import"./Box-C7hZLEtJ.js";import"./styled-CM7DeKVT.js";import"./CopyTextButton-CYnCjE6P.js";import"./useCopyToClipboard-CjN5pxJ0.js";import"./useMountedState-DUaJLf6X.js";import"./Tooltip-BNLu37bx.js";import"./Popper-BWCVR11Y.js";import"./Portal-mSXpCt2p.js";import"./Grid-CqRlAN7B.js";import"./List-DO_c5BbT.js";import"./ListContext-Cbd93-g4.js";import"./ListItem-C9CmSeWD.js";import"./ListItemText-bJqslP2h.js";import"./Divider-BhEceQA0.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
