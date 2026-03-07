import{j as t}from"./iframe-CSFr66Yj.js";import{R as s}from"./ResponseErrorPanel-CxvWz03l.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-uVnrWAVB.js";import"./ErrorPanel-BBFDgu-U.js";import"./WarningPanel-0pAFG3t5.js";import"./ExpandMore-CYdmrhn0.js";import"./AccordionDetails-gWBQL4CY.js";import"./index-B9sM2jn7.js";import"./Collapse-CACY-YW1.js";import"./MarkdownContent-C-fsNcdE.js";import"./CodeSnippet-C27VEnjc.js";import"./Box-Cb3Gr3iO.js";import"./styled-CmsioGDa.js";import"./CopyTextButton-DxxeYMWB.js";import"./useCopyToClipboard-BD8xRBtk.js";import"./useMountedState-BLBZO_0R.js";import"./Tooltip-DNXEZsSN.js";import"./Popper-P787cLfX.js";import"./Portal-B40i3148.js";import"./Grid-ClhOBUNV.js";import"./List-CTsa5Vil.js";import"./ListContext-hUquPiBr.js";import"./ListItem--clkBOsd.js";import"./ListItemText-D6Yo_WD1.js";import"./Divider-CcxNX2dS.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
