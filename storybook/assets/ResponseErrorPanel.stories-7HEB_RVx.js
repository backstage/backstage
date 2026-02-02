import{j as t}from"./iframe-Bz1IoDwg.js";import{R as s}from"./ResponseErrorPanel-yUG-nvMh.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-BtAfCzwR.js";import"./WarningPanel-Bny1Wix5.js";import"./ExpandMore-Dlvt5b42.js";import"./AccordionDetails-qNBrrRUw.js";import"./index-B9sM2jn7.js";import"./Collapse-C7ZfnDjZ.js";import"./MarkdownContent-DPlVt8XM.js";import"./CodeSnippet-BhvDpqOl.js";import"./Box-B4X1pSLD.js";import"./styled-nJYZvWBJ.js";import"./CopyTextButton-B02pGVBs.js";import"./useCopyToClipboard-lsM1yAtv.js";import"./useMountedState-CBRaKuhZ.js";import"./Tooltip-Dnn6Xi1p.js";import"./Popper-vOyuMRKf.js";import"./Portal-nnGdoBnk.js";import"./Grid-DSK0Sob8.js";import"./List-BuBw1TsS.js";import"./ListContext-BU0MJFdF.js";import"./ListItem-DwPXYlNl.js";import"./ListItemText-uP05tp0v.js";import"./Divider-D1ZXem9_.js";const F={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
