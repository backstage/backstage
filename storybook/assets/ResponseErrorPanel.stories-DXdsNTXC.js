import{j as t}from"./iframe-DDK8UA9d.js";import{R as s}from"./ResponseErrorPanel-DIbnsc6H.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-BQD939bd.js";import"./WarningPanel-DXNyXfzl.js";import"./ExpandMore-BnojTJh7.js";import"./AccordionDetails-BmHvpTHX.js";import"./index-B9sM2jn7.js";import"./Collapse-Bm6nVpbB.js";import"./MarkdownContent-CG88u8fu.js";import"./CodeSnippet-DWhhZEwi.js";import"./Box-DhjbYf3r.js";import"./styled-DMKPGzcT.js";import"./CopyTextButton-Chq4JcN0.js";import"./useCopyToClipboard-DbGzp7uW.js";import"./useMountedState-Dd9a9K3Q.js";import"./Tooltip-Cy4RFEYG.js";import"./Popper-BHoeK-6N.js";import"./Portal-DcnhuCwR.js";import"./Grid-D0K-a10_.js";import"./List-DFzXqQTw.js";import"./ListContext-Gb2XOrAs.js";import"./ListItem-DLPNurIO.js";import"./ListItemText-C4llEuCJ.js";import"./Divider-b4tOLF1T.js";const F={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
