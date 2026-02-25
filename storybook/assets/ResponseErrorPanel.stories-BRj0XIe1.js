import{j as t}from"./iframe-DTfizrde.js";import{R as s}from"./ResponseErrorPanel-DkJP8JzK.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-cQYMssxT.js";import"./ErrorPanel-NjJBAg1B.js";import"./WarningPanel-BErq6ILN.js";import"./ExpandMore-Zq7wFUjN.js";import"./AccordionDetails-TZdQkQtk.js";import"./index-B9sM2jn7.js";import"./Collapse-BjWqbLIw.js";import"./MarkdownContent-D-gdOFlV.js";import"./CodeSnippet-DYevjl4R.js";import"./Box-BJ9QCDuL.js";import"./styled-D7CkLDDF.js";import"./CopyTextButton-DEG2xp6B.js";import"./useCopyToClipboard-BsKLzoDq.js";import"./useMountedState-ucond-iA.js";import"./Tooltip-CiR2CeYH.js";import"./Popper-CDKiD4XM.js";import"./Portal-DWz9hzP1.js";import"./Grid-CiU0LbEc.js";import"./List-D_x_P-c5.js";import"./ListContext-D7hCMl_b.js";import"./ListItem-DW0UN9hL.js";import"./ListItemText-g7zvfuTx.js";import"./Divider-FNJvM-pk.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
