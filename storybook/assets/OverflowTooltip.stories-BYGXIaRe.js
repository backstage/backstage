import{j as r}from"./iframe-r9k78NKI.js";import{O as s}from"./OverflowTooltip-C1KOkKVb.js";import{B as i}from"./Box-CPjilEka.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-CipF_TRV.js";import"./Tooltip-B1Vym-uO.js";import"./Popper-oo_sRFxI.js";import"./Portal-CW8an0o0.js";import"./styled-Cg4IVtII.js";const h={title:"Data Display/OverflowTooltip",component:s,tags:["!manifest"]},a="Lorem Ipsum is simply sample text of the printing and typesetting industry.",e=()=>r.jsx(i,{maxWidth:"200px",children:r.jsx(s,{text:a})}),t=()=>r.jsx(i,{maxWidth:"200px",children:r.jsx(s,{text:a,line:2})}),o=()=>r.jsx(i,{maxWidth:"200px",children:r.jsx(s,{title:"Visit loremipsum.io for more info",text:a,line:2})});e.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"MultiLine"};o.__docgenInfo={description:"",methods:[],displayName:"DifferentTitle"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => (
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
  </Box>`,...o.parameters?.docs?.source}}};const B=["Default","MultiLine","DifferentTitle"];export{e as Default,o as DifferentTitle,t as MultiLine,B as __namedExportsOrder,h as default};
