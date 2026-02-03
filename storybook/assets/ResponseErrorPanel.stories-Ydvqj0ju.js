import{j as t}from"./iframe-DCoYcZLi.js";import{R as s}from"./ResponseErrorPanel-80X7M4I-.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-D9pajOJW.js";import"./WarningPanel-2R8Y_I4d.js";import"./ExpandMore-BjerwzBY.js";import"./AccordionDetails-D0-Ip2Ry.js";import"./index-B9sM2jn7.js";import"./Collapse-K2usbj1G.js";import"./MarkdownContent-B24-9cF1.js";import"./CodeSnippet-BoQ2ohjZ.js";import"./Box-DX2D8BTJ.js";import"./styled-h2gldWYB.js";import"./CopyTextButton-Crh7sKVk.js";import"./useCopyToClipboard-Ceo0QToL.js";import"./useMountedState-CnGoVtA3.js";import"./Tooltip-B4Ob7Xca.js";import"./Popper-DRIxTtO6.js";import"./Portal-CFcI6CIt.js";import"./Grid-D58TNpxw.js";import"./List-BdybXaA2.js";import"./ListContext-DkVKA3j4.js";import"./ListItem-DlFYWpXw.js";import"./ListItemText-BwT95NDX.js";import"./Divider-Ca-0TjsJ.js";const F={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
