import{j as t}from"./iframe-BplO06yy.js";import{R as s}from"./ResponseErrorPanel-arbeCczV.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-hxoXH1CF.js";import"./ErrorPanel-O0u1Wz4N.js";import"./WarningPanel-BwTtnGkf.js";import"./ExpandMore-BcJaZxd5.js";import"./AccordionDetails-BKmhvlN_.js";import"./index-B9sM2jn7.js";import"./Collapse-DOaJRWW2.js";import"./MarkdownContent-xJlcnECw.js";import"./CodeSnippet-8K-OWRcS.js";import"./Box-NknjwhwY.js";import"./styled-BRp8APBl.js";import"./CopyTextButton-BXdH_Mex.js";import"./useCopyToClipboard-DkMn04rE.js";import"./useMountedState-CjXeUMpc.js";import"./Tooltip-jADLXplJ.js";import"./Popper-Bzo90_V1.js";import"./Portal-Ax05yPmo.js";import"./Grid-C0SXy4wX.js";import"./List-xC3JEtnt.js";import"./ListContext-TNzuz18n.js";import"./ListItem-CjMmncm8.js";import"./ListItemText-BsX_35MI.js";import"./Divider-DQ_NQG7A.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
