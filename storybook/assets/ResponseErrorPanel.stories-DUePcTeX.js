import{j as t}from"./iframe-DagLMla0.js";import{R as s}from"./ResponseErrorPanel-BnLrc1P4.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-VKdC8KiN.js";import"./ErrorPanel-VpRUQ9Sx.js";import"./WarningPanel-BIOf-ulA.js";import"./ExpandMore-B8FobaJl.js";import"./AccordionDetails-BcRR1tKu.js";import"./index-B9sM2jn7.js";import"./Collapse-CmcuBxUj.js";import"./MarkdownContent-DNeHSjqa.js";import"./CodeSnippet-BJQ1-T7X.js";import"./Box-C34VUoZ3.js";import"./styled-CaOR_WMz.js";import"./CopyTextButton-DsGjgVvC.js";import"./useCopyToClipboard-yj_91UtI.js";import"./useMountedState-CdgeShYt.js";import"./Tooltip-C5pe82ax.js";import"./Popper-DphrlTbi.js";import"./Portal-D3sdGGII.js";import"./Grid-FBCbfPk_.js";import"./List-CIhN5mci.js";import"./ListContext-Ci5pu3kB.js";import"./ListItem-EqTaubpw.js";import"./ListItemText-BKKXp1hx.js";import"./Divider-BUPVmGFH.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
