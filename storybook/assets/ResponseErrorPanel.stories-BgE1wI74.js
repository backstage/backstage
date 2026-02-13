import{j as t}from"./iframe-DfpqVrvR.js";import{R as s}from"./ResponseErrorPanel-DVuxKWQn.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-D6lZMQOZ.js";import"./ErrorPanel-SmgUlzmO.js";import"./WarningPanel-Bz9AhhLa.js";import"./ExpandMore-DNWj65uy.js";import"./AccordionDetails-CME4g-Zl.js";import"./index-B9sM2jn7.js";import"./Collapse-TeKBW-e6.js";import"./MarkdownContent-C7xGHzif.js";import"./CodeSnippet-nqnm0QRt.js";import"./Box-CBRqSsQo.js";import"./styled-Di8tq9jL.js";import"./CopyTextButton-CALliBhJ.js";import"./useCopyToClipboard-eV5LqnxG.js";import"./useMountedState-BTmbzoDb.js";import"./Tooltip-CSZ3KiFw.js";import"./Popper-BR9KmGwy.js";import"./Portal-DJgbgmP8.js";import"./Grid-DytBiILQ.js";import"./List-BZpx7np8.js";import"./ListContext-rrXMk-NT.js";import"./ListItem-vYcWevWl.js";import"./ListItemText-DxxiQXUs.js";import"./Divider-8A6u6vq7.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
