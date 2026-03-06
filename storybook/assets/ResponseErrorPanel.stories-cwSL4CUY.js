import{j as t}from"./iframe-CMBqt-A6.js";import{R as s}from"./ResponseErrorPanel-D2OKnIoT.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-OaxjZhE6.js";import"./ErrorPanel-C5HXJk0K.js";import"./WarningPanel-CEui-57e.js";import"./ExpandMore-B4086Chn.js";import"./AccordionDetails-Kjq35WDg.js";import"./index-B9sM2jn7.js";import"./Collapse-DtqZnYot.js";import"./MarkdownContent-DrWROi1h.js";import"./CodeSnippet-Bh6b92eX.js";import"./Box-iylMMNr_.js";import"./styled-B4IYquMA.js";import"./CopyTextButton-XVvMse43.js";import"./useCopyToClipboard-DY93RZDc.js";import"./useMountedState-BbRSrrDa.js";import"./Tooltip-B1ugzKqz.js";import"./Popper-BlEuC4wp.js";import"./Portal-CNrrtJUq.js";import"./Grid-DdcqWz44.js";import"./List-B_Ga0lkw.js";import"./ListContext-CNfMiW9V.js";import"./ListItem-Cz-H-GSR.js";import"./ListItemText-BrZaJgkP.js";import"./Divider-CbTnPJqO.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
