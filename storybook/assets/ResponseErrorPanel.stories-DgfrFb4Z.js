import{j as t}from"./iframe-B5eUq3Se.js";import{R as s}from"./ResponseErrorPanel-org46fpQ.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-CutSd0r9.js";import"./ErrorPanel-4U_LahUX.js";import"./WarningPanel-DMjY7bER.js";import"./ExpandMore-C0apesZO.js";import"./AccordionDetails-C18KfYNK.js";import"./index-B9sM2jn7.js";import"./Collapse-BH0sj3lj.js";import"./MarkdownContent-C-dh1sK0.js";import"./CodeSnippet-BmhEvva_.js";import"./Box-Dc6HtbNm.js";import"./styled-CctU0TIs.js";import"./CopyTextButton-DGFhLiSC.js";import"./useCopyToClipboard-DbbNH5jP.js";import"./useMountedState-ByxWK81W.js";import"./Tooltip-D7_OCLcm.js";import"./Popper-DZlzY0sF.js";import"./Portal-DpJbamzY.js";import"./Grid-BE58qVmP.js";import"./List-Cr_JFt2Y.js";import"./ListContext-BhsEYfmX.js";import"./ListItem-Cf7Arzhs.js";import"./ListItemText-WVljPJU4.js";import"./Divider-_E91SnDF.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
