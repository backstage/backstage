import{j as t}from"./iframe-Du4yWFmh.js";import{H as i}from"./Header-HR0R4_1G.js";import{P as a}from"./Page-DEs8Yzbx.js";import{H as r}from"./HeaderLabel-B8CXzbaB.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BVTy9Zge.js";import"./Box-CkOOyHi_.js";import"./styled-B5kNIoL_.js";import"./Grid-BAWrmmwT.js";import"./Breadcrumbs-BH2Jl9KZ.js";import"./index-B9sM2jn7.js";import"./Popover-CVFTCziA.js";import"./Modal-CcLAGJZ_.js";import"./Portal-CRhyxH_K.js";import"./List-C8YUr1Px.js";import"./ListContext-CCATEDcQ.js";import"./ListItem-CR_jODVH.js";import"./Link-BchXRwcV.js";import"./lodash-DLuUt6m8.js";import"./index-Br3zvZN_.js";import"./useAnalytics-mdAgoHs9.js";import"./useApp-DvME4Mfb.js";import"./Page-Bghn-Ugx.js";import"./useMediaQuery-CovhEOX9.js";import"./Tooltip-CxJ8vwKd.js";import"./Popper-Bc6CEfjX.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
  const { type } = args;

  return (
    <Page themeId={type}>
      <Header type="home" title="This is a title" subtitle="This is a subtitle">
        {labels}
      </Header>
    </Page>
  );
};
`,...e.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`(args: {
  type: string;
  title: string;
  subtitle: string;
}) => {
  const {
    type
  } = args;
  return <Page themeId={type}>
      <Header {...args}>{labels}</Header>
    </Page>;
}`,...e.parameters?.docs?.source}}};const R=["Default"];export{e as Default,R as __namedExportsOrder,N as default};
