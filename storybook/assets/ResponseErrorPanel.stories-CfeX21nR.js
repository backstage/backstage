import{j as t}from"./iframe-BAAMxX04.js";import{R as s}from"./ResponseErrorPanel-Bl3C5O1l.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-Gcd-M5aY.js";import"./ErrorPanel-DHN-LAtf.js";import"./WarningPanel-tIIxtRQY.js";import"./ExpandMore-BwjaEHfr.js";import"./AccordionDetails-DhHZDL5a.js";import"./index-B9sM2jn7.js";import"./Collapse-DxaSsTbo.js";import"./MarkdownContent-DQGrp438.js";import"./CodeSnippet-2B0aeiXb.js";import"./Box-DWmyZ5Ze.js";import"./styled-x10YRlqs.js";import"./CopyTextButton-DBmI-hd9.js";import"./useCopyToClipboard-1oEsETe5.js";import"./useMountedState-BHWFcdPM.js";import"./Tooltip-Cow5tudN.js";import"./Popper-DxqnTNur.js";import"./Portal-DE326cIY.js";import"./Grid-bsc20U2v.js";import"./List-CWixwH1G.js";import"./ListContext-COr9ityP.js";import"./ListItem-BX7a0Z-y.js";import"./ListItemText-CqW6ArUt.js";import"./Divider-DqEFMUKr.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
