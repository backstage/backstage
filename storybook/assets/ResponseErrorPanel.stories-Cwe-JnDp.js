import{j as t}from"./iframe-n0fImp44.js";import{R as s}from"./ResponseErrorPanel--2JrGQiV.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-7xRdzCom.js";import"./ErrorPanel-7b4Q_5Jm.js";import"./WarningPanel-7-PmPQUU.js";import"./ExpandMore-CUT2VH4k.js";import"./AccordionDetails-q931FNIT.js";import"./index-B9sM2jn7.js";import"./Collapse-Ch2A_JUk.js";import"./MarkdownContent-CyNLuAt5.js";import"./CodeSnippet-pQTV2hZK.js";import"./Box-BHviuYFv.js";import"./styled-DPQIJJsa.js";import"./CopyTextButton-DU4Ci22-.js";import"./useCopyToClipboard-DNTW5IKl.js";import"./useMountedState-2Tq8J5yq.js";import"./Tooltip-Ni_hV5_d.js";import"./Popper-D6PulSAE.js";import"./Portal-DaF9Kh8d.js";import"./Grid-XRj5X-dC.js";import"./List-B1pnwKZO.js";import"./ListContext-BL95jnEy.js";import"./ListItem-DO8hDZSO.js";import"./ListItemText-Dmum6zvX.js";import"./Divider-DOkAKXLi.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
