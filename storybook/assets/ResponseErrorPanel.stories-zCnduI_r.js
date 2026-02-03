import{j as t}from"./iframe-CqNqnb74.js";import{R as s}from"./ResponseErrorPanel-PcbzMDq5.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-BYm0Mdkb.js";import"./WarningPanel-BCw9VL3x.js";import"./ExpandMore-CaaJdVfs.js";import"./AccordionDetails-DNjlLobr.js";import"./index-B9sM2jn7.js";import"./Collapse-D1DbSfAq.js";import"./MarkdownContent-CAUU14sj.js";import"./CodeSnippet-DP3MYkIR.js";import"./Box-BOvD5Bg7.js";import"./styled-_PBYdDbi.js";import"./CopyTextButton-DzB5MTRG.js";import"./useCopyToClipboard-D6T0fjGN.js";import"./useMountedState-DTFeLOhk.js";import"./Tooltip-DFfl-fad.js";import"./Popper-C4CcENfH.js";import"./Portal-Czxz0PR0.js";import"./Grid-Caq84KkR.js";import"./List-aEU9IVP1.js";import"./ListContext-D4KOPpIf.js";import"./ListItem-CO20Ch0Y.js";import"./ListItemText-qCutXsPN.js";import"./Divider-zsbty3yZ.js";const F={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
