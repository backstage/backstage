import{j as t}from"./iframe-CG856I7g.js";import{R as s}from"./ResponseErrorPanel-CntGf4F_.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-DZ1ApYdQ.js";import"./WarningPanel-CDDj3MLB.js";import"./ExpandMore-DTKTum2k.js";import"./AccordionDetails-CmfQvp7G.js";import"./index-B9sM2jn7.js";import"./Collapse-vpACe9Y2.js";import"./MarkdownContent-BwSLPwTP.js";import"./CodeSnippet-CUezJ-Mg.js";import"./Box-DirFOCIJ.js";import"./styled-8AOit3ty.js";import"./CopyTextButton-B_1HfWK0.js";import"./useCopyToClipboard-CUxcez1F.js";import"./useMountedState-Bvsb1ptg.js";import"./Tooltip-DTkgI76M.js";import"./Popper-BTDu7j3q.js";import"./Portal-Bhu3uB1L.js";import"./Grid-CG84KQIV.js";import"./List-BTwiC7G-.js";import"./ListContext-BzsI-cEV.js";import"./ListItem-BWUkcOJl.js";import"./ListItemText-QtFV-4wl.js";import"./Divider-gH4LD_Ra.js";const F={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
