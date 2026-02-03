import{j as t}from"./iframe-BRAtl1PG.js";import{R as s}from"./ResponseErrorPanel-DuOdK0XL.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-YK6XTPJI.js";import"./WarningPanel-Dgi0x69_.js";import"./ExpandMore-DRdYJoQu.js";import"./AccordionDetails-DIaxBLag.js";import"./index-B9sM2jn7.js";import"./Collapse-_zQA2_Pp.js";import"./MarkdownContent-BIfRKm7t.js";import"./CodeSnippet-BYUXS9v0.js";import"./Box-D7EfII4J.js";import"./styled-D-CRs93U.js";import"./CopyTextButton-BPfRPWdE.js";import"./useCopyToClipboard-BuklA7P5.js";import"./useMountedState-PBRhdOpD.js";import"./Tooltip-CPq4vOtC.js";import"./Popper-b-3H8dnH.js";import"./Portal-CmmcMNPo.js";import"./Grid-Cneg6dXd.js";import"./List-DW5i0QCT.js";import"./ListContext-DnBkigGS.js";import"./ListItem-DGTqNMMt.js";import"./ListItemText-BSrDcH8Z.js";import"./Divider-BFDiZlO8.js";const F={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
