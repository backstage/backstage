import{j as t}from"./iframe-DfW0k9e4.js";import{R as s}from"./ResponseErrorPanel-2IJNkJME.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-BMIN-fu2.js";import"./WarningPanel-BP-y6z0y.js";import"./ExpandMore-DgZ6UNBD.js";import"./AccordionDetails-B314eioH.js";import"./index-B9sM2jn7.js";import"./Collapse-kvPWdbht.js";import"./MarkdownContent-DX3OAbaQ.js";import"./CodeSnippet--VZdTbP8.js";import"./Box-D0zAdjf6.js";import"./styled-CReYHJ7K.js";import"./CopyTextButton-BDBeSRds.js";import"./useCopyToClipboard-DOwrP97-.js";import"./useMountedState-qW-VDUVJ.js";import"./Tooltip-DzakseTW.js";import"./Popper-B4DyDbOp.js";import"./Portal-D7dEWwg8.js";import"./Grid-DOkM8E58.js";import"./List-B3BEM4nz.js";import"./ListContext-hwCl85Z0.js";import"./ListItem-Bw1vw_JI.js";import"./ListItemText-IHJkJ5se.js";import"./Divider-CYGCiMiq.js";const F={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
