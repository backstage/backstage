import{j as t}from"./iframe-DLGvYYIN.js";import{R as s}from"./ResponseErrorPanel-C6kNXrsL.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-DEKhmeuV.js";import"./ErrorPanel-CCp-gDH1.js";import"./WarningPanel-DzCt2AAr.js";import"./ExpandMore-D2nnNZ12.js";import"./AccordionDetails-BVxqyaM9.js";import"./index-B9sM2jn7.js";import"./Collapse-85_XAqA3.js";import"./MarkdownContent-TiUp9hsk.js";import"./CodeSnippet-DVSSjMBb.js";import"./Box-Voe0tXZA.js";import"./styled-B66Ywjg2.js";import"./CopyTextButton-C7sFvBkJ.js";import"./useCopyToClipboard-Steo6KBL.js";import"./useMountedState-Cv7_7HCx.js";import"./Tooltip-Btq9c1g-.js";import"./Popper-DYpINPHQ.js";import"./Portal-BesUmCRU.js";import"./Grid-DpqtaqiR.js";import"./List-CgTpYNOF.js";import"./ListContext-BtT7WJ3i.js";import"./ListItem-BaUyqq3j.js";import"./ListItemText-BKrHb2yE.js";import"./Divider-DrWoyr0H.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
