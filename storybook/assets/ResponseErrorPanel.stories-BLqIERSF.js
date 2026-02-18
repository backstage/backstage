import{j as t}from"./iframe-C97aGyUm.js";import{R as s}from"./ResponseErrorPanel-BY4ksVyl.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-BH_X-duW.js";import"./ErrorPanel-27WlqtRg.js";import"./WarningPanel-vJ5ed0Y4.js";import"./ExpandMore-DQnFi8wU.js";import"./AccordionDetails-RttftoEk.js";import"./index-B9sM2jn7.js";import"./Collapse-DCaCKP1G.js";import"./MarkdownContent-CHjXC1sw.js";import"./CodeSnippet-BHzVYurR.js";import"./Box-Df-ATJWc.js";import"./styled-BJz5j31a.js";import"./CopyTextButton-B2KMIwjA.js";import"./useCopyToClipboard-DupPQQh1.js";import"./useMountedState-DKTKiVGI.js";import"./Tooltip-BGk1OQyx.js";import"./Popper-B9Uqg6K1.js";import"./Portal-CFNjbNqg.js";import"./Grid-B4D-XE5H.js";import"./List-BpxYOW0_.js";import"./ListContext-CrpBZA7K.js";import"./ListItem-wmZ5BRVq.js";import"./ListItemText-DUwIkaVM.js";import"./Divider-DR_-bkrG.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
