import{j as t}from"./iframe-Ca4Oq2uP.js";import{R as s}from"./ResponseErrorPanel-DyBCHto1.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-B9MZJL52.js";import"./WarningPanel-D_gQNl9J.js";import"./ExpandMore-BYyl-nAO.js";import"./AccordionDetails-C-jAEpJA.js";import"./index-B9sM2jn7.js";import"./Collapse-B_fsMJ0G.js";import"./MarkdownContent-CCSCaS3C.js";import"./CodeSnippet-BNIZNbBb.js";import"./Box-C6YthH4K.js";import"./styled-bS2mVuuT.js";import"./CopyTextButton-CxyLRgr5.js";import"./useCopyToClipboard-CrLUyXrt.js";import"./useMountedState-am8g5938.js";import"./Tooltip-DlFbz0wm.js";import"./Popper-D7At4psl.js";import"./Portal-DfnbqdYt.js";import"./Grid-DvRbNd4W.js";import"./List-_jXEyBxC.js";import"./ListContext-DFKFAB0C.js";import"./ListItem-BrncrmWC.js";import"./ListItemText-VT7wc13t.js";import"./Divider-I0xPhLEa.js";const F={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
