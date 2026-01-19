import{j as t}from"./iframe-Ck0aXmTM.js";import{R as s}from"./ResponseErrorPanel-CORIeFI6.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-SFTFZur6.js";import"./WarningPanel-BnKvh7bd.js";import"./ExpandMore-XskE5SkY.js";import"./AccordionDetails-Dunbukgx.js";import"./index-B9sM2jn7.js";import"./Collapse-DxAw5EoH.js";import"./MarkdownContent-DTz2Je40.js";import"./CodeSnippet-1zCVoflW.js";import"./Box-DpOIFL5c.js";import"./styled-DLjnXpzN.js";import"./CopyTextButton-C18-3nwc.js";import"./useCopyToClipboard-g3w1_GHx.js";import"./useMountedState-BgEDmEmL.js";import"./Tooltip-Sxlj4qdH.js";import"./Popper-DOPOD1lh.js";import"./Portal-enzQuAv4.js";import"./Grid-DJzZ2-y-.js";import"./List-Ch4xqBdJ.js";import"./ListContext-m5pyxhJx.js";import"./ListItem-BI_yLDsO.js";import"./ListItemText-BN5MiG2A.js";import"./Divider-B0knNu2M.js";const F={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
