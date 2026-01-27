import{j as r}from"./iframe-DEXNC9RX.js";import{O as s}from"./OverflowTooltip-1xKok79Z.js";import{B as i}from"./Box-BngrI2dT.js";import"./preload-helper-PPVm8Dsz.js";import"./Tooltip-B5JVDv03.js";import"./Popper-Dtp4XQPR.js";import"./Portal-O6zOHTQ9.js";import"./styled-B4iJQM5t.js";const u={title:"Data Display/OverflowTooltip",component:s,tags:["!manifest"]},a="Lorem Ipsum is simply sample text of the printing and typesetting industry.",e=()=>r.jsx(i,{maxWidth:"200px",children:r.jsx(s,{text:a})}),t=()=>r.jsx(i,{maxWidth:"200px",children:r.jsx(s,{text:a,line:2})}),o=()=>r.jsx(i,{maxWidth:"200px",children:r.jsx(s,{title:"Visit loremipsum.io for more info",text:a,line:2})});e.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"MultiLine"};o.__docgenInfo={description:"",methods:[],displayName:"DifferentTitle"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => (
  <Box maxWidth="200px">
    <OverflowTooltip text={text} />
  </Box>
);
`,...e.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{code:`const MultiLine = () => (
  <Box maxWidth="200px">
    <OverflowTooltip text={text} line={2} />
  </Box>
);
`,...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{code:`const DifferentTitle = () => (
  <Box maxWidth="200px">
    <OverflowTooltip
      title="Visit loremipsum.io for more info"
      text={text}
      line={2}
    />
  </Box>
);
`,...o.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => <Box maxWidth="200px">
    <OverflowTooltip text={text} />
  </Box>`,...e.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => <Box maxWidth="200px">
    <OverflowTooltip text={text} line={2} />
  </Box>`,...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => <Box maxWidth="200px">
    <OverflowTooltip title="Visit loremipsum.io for more info" text={text} line={2} />
  </Box>`,...o.parameters?.docs?.source}}};const h=["Default","MultiLine","DifferentTitle"];export{e as Default,o as DifferentTitle,t as MultiLine,h as __namedExportsOrder,u as default};
