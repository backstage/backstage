import{j as t}from"./iframe-DvAQ9TL9.js";import{R as s}from"./ResponseErrorPanel-Bxe7Hr62.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-DIoIr_Gz.js";import"./ErrorPanel-HBqbnSUL.js";import"./WarningPanel-Bxcykx1i.js";import"./ExpandMore-DvoBn6N_.js";import"./AccordionDetails-DY-ZFezw.js";import"./index-B9sM2jn7.js";import"./Collapse-B8ccB9dL.js";import"./MarkdownContent-FsJ6V0Ex.js";import"./CodeSnippet-Cw8HO4Ms.js";import"./Box-DF8-c6JA.js";import"./styled-CoguSFmS.js";import"./CopyTextButton-BY3AYvWV.js";import"./useCopyToClipboard-CJ3bK8Wv.js";import"./useMountedState-CA4Rdt3V.js";import"./Tooltip-Do0H6o91.js";import"./Popper-DAdC7LWr.js";import"./Portal-CZWMCv81.js";import"./Grid-R-6Q3RAr.js";import"./List-JM-19v_p.js";import"./ListContext-C55nEgJD.js";import"./ListItem-C50yNROG.js";import"./ListItemText-BK-T--XP.js";import"./Divider-Evup8xdO.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
