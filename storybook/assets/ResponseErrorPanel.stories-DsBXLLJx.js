import{j as t}from"./iframe-Dc6SVWG5.js";import{R as s}from"./ResponseErrorPanel-DB3no35-.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-D-ezxJ4v.js";import"./WarningPanel-C3dDiuJG.js";import"./ExpandMore-DbnKJ-3Y.js";import"./AccordionDetails-CK24iBmJ.js";import"./index-B9sM2jn7.js";import"./Collapse-5pSFEBGG.js";import"./MarkdownContent-B1WuysOW.js";import"./CodeSnippet-BullD9eL.js";import"./Box-DORcO5nL.js";import"./styled-Dq5lPzbL.js";import"./CopyTextButton-B-mnnb3d.js";import"./useCopyToClipboard-CBsscp3Q.js";import"./useMountedState-1x78q3TT.js";import"./Tooltip-C8OYhGnh.js";import"./Popper-CJ7TZbcE.js";import"./Portal-COm53pHi.js";import"./Grid-BSXyf9SS.js";import"./List-CqEwDLab.js";import"./ListContext-CQwj8Qg7.js";import"./ListItem-BhueXXFi.js";import"./ListItemText-BD21enaM.js";import"./Divider-B6Rq6sfT.js";const F={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
