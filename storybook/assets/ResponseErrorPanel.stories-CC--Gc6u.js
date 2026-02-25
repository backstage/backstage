import{j as t}from"./iframe-DEPu6gb6.js";import{R as s}from"./ResponseErrorPanel-DVTrHvst.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-DmiRwbC-.js";import"./ErrorPanel-BO35ifSK.js";import"./WarningPanel-DjGA9j0N.js";import"./ExpandMore-f018RETT.js";import"./AccordionDetails-nYq3MGOf.js";import"./index-B9sM2jn7.js";import"./Collapse-D43uTXl1.js";import"./MarkdownContent-CfLmRDT4.js";import"./CodeSnippet-D5Rf0fbG.js";import"./Box-CRmT1Uep.js";import"./styled-C8JkirxD.js";import"./CopyTextButton-vIn0FPCw.js";import"./useCopyToClipboard-CHGvdCFh.js";import"./useMountedState-Bp82S8Hy.js";import"./Tooltip-Du9bg8BH.js";import"./Popper-V2uzkjHi.js";import"./Portal-CQdgPEoH.js";import"./Grid-B4jZTMCZ.js";import"./List-6W-tA5Er.js";import"./ListContext-YZAoD3r_.js";import"./ListItem-Bp_YBU-O.js";import"./ListItemText-3-mp0clE.js";import"./Divider-Ce0hzK3j.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
