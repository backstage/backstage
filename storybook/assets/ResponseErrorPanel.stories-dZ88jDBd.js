import{j as t}from"./iframe-rmBlqmIJ.js";import{R as s}from"./ResponseErrorPanel-BTJIiMqj.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-C7NHQIjx.js";import"./ErrorPanel-2eNM-jw_.js";import"./WarningPanel-BL_3thw1.js";import"./ExpandMore-C66io_Nr.js";import"./AccordionDetails-DgYJ939e.js";import"./index-B9sM2jn7.js";import"./Collapse-Cw6vn11h.js";import"./MarkdownContent-C07YIJuu.js";import"./CodeSnippet-fjebKIGS.js";import"./Box-BJ8MGsCq.js";import"./styled-C1fNSXy6.js";import"./CopyTextButton-BBjaBtHx.js";import"./useCopyToClipboard-CQdeULTJ.js";import"./useMountedState-ByDL7K8T.js";import"./Tooltip-D6p3Ayxg.js";import"./Popper-B-v3u-hL.js";import"./Portal-Bh1pEuYq.js";import"./Grid-S-q4EpZp.js";import"./List-CmgMtYJn.js";import"./ListContext-Dr4uxIrN.js";import"./ListItem-DDDa0TMv.js";import"./ListItemText-Dl4qJiAI.js";import"./Divider-DnpHdWJy.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
