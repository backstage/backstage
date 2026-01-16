import{j as t}from"./iframe-C6d4amxQ.js";import{R as s}from"./ResponseErrorPanel-DnithY1L.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-C4TycXbx.js";import"./WarningPanel-C-jRLCTC.js";import"./ExpandMore--4wftT15.js";import"./AccordionDetails-BgOvrYOY.js";import"./index-B9sM2jn7.js";import"./Collapse-Di3lEKwf.js";import"./MarkdownContent-BYJW4Slr.js";import"./CodeSnippet-3cP_Pubp.js";import"./Box-yXRZ3Xp2.js";import"./styled-BGGy5Grm.js";import"./CopyTextButton-CE5xtLZ0.js";import"./useCopyToClipboard-CH_VlaT9.js";import"./useMountedState-C6W4VPdE.js";import"./Tooltip-5RhOkenH.js";import"./Popper-aoUur9H0.js";import"./Portal-B6ENv45o.js";import"./Grid-WtUylni-.js";import"./List-qMmGjvCV.js";import"./ListContext-Baa1QRS6.js";import"./ListItem-CUGV6Izn.js";import"./ListItemText-DmvyJhay.js";import"./Divider-BlWYsQ2U.js";const F={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
