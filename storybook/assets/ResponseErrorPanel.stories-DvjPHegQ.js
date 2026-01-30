import{j as t}from"./iframe-BdfNw3Ub.js";import{R as s}from"./ResponseErrorPanel-Mp9n3s9I.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-NKrLmxAy.js";import"./WarningPanel-Bslmfj1Q.js";import"./ExpandMore-dcQwlkUA.js";import"./AccordionDetails-CPLXq-Rf.js";import"./index-B9sM2jn7.js";import"./Collapse-DwRSSlvv.js";import"./MarkdownContent-B84ymYDA.js";import"./CodeSnippet-DtZ5NGdI.js";import"./Box-Ck7a0B2s.js";import"./styled-BblI00As.js";import"./CopyTextButton-DDSW1go4.js";import"./useCopyToClipboard-CQmr7kQ1.js";import"./useMountedState-B5cOerk8.js";import"./Tooltip-LFPLy9FS.js";import"./Popper-CW4DzWu0.js";import"./Portal-CuRfOwRS.js";import"./Grid-ClCC6X0d.js";import"./List-Be-141Yt.js";import"./ListContext-C0BE_woo.js";import"./ListItem-eROPvDGl.js";import"./ListItemText-Cap62zTH.js";import"./Divider--Mq8jTWg.js";const F={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
