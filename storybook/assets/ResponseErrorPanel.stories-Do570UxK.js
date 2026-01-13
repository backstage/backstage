import{j as t}from"./iframe-DFN6SAj3.js";import{R as s}from"./ResponseErrorPanel-DfQj7UUR.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-DGkagluo.js";import"./WarningPanel-CcjMMskt.js";import"./ExpandMore-Baqg86ni.js";import"./AccordionDetails-BCiojWwT.js";import"./index-B9sM2jn7.js";import"./Collapse-Dmxu6_xf.js";import"./MarkdownContent-C7YoEea1.js";import"./CodeSnippet-DP1ZDnW-.js";import"./Box-CrX2Agh3.js";import"./styled-UJWvm5Ja.js";import"./CopyTextButton-bz5fwOjo.js";import"./useCopyToClipboard-S8C7f3cV.js";import"./useMountedState-0rCkRX95.js";import"./Tooltip-B6ATafnk.js";import"./Popper-BPOHrmiw.js";import"./Portal-6-SOUMqq.js";import"./Grid-CnDsPTZJ.js";import"./List-CNrJvNp3.js";import"./ListContext-B6gycCKe.js";import"./ListItem-khPUul4I.js";import"./ListItemText-CEkrmQrS.js";import"./Divider-C4fHH6xB.js";const F={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
