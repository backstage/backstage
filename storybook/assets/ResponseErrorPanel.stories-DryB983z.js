import{j as t}from"./iframe-DPEQU9sg.js";import{R as s}from"./ResponseErrorPanel-BG9foovc.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-Bv595yjm.js";import"./WarningPanel-C_F8xUzg.js";import"./ExpandMore-D_QIxzGY.js";import"./AccordionDetails-0XhIBkyu.js";import"./index-B9sM2jn7.js";import"./Collapse-ggEsDBaY.js";import"./MarkdownContent-D28GpyhI.js";import"./CodeSnippet-DGpkezw4.js";import"./Box-DFPXS1uh.js";import"./styled-_ZhQ2JBl.js";import"./CopyTextButton-CyVbES63.js";import"./useCopyToClipboard-D4G45ymZ.js";import"./useMountedState-BqkaBMSv.js";import"./Tooltip-1rkaBdpM.js";import"./Popper-BxGyCUHY.js";import"./Portal-AonZoDqn.js";import"./Grid-V2KC8DrR.js";import"./List-DquDfnLJ.js";import"./ListContext-DyGfW3pa.js";import"./ListItem-C3tAmyko.js";import"./ListItemText-xJVltyzR.js";import"./Divider-DubjQnze.js";const F={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
