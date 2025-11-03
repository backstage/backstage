import{j as e}from"./iframe-BpNetfkk.js";import{H as o}from"./Header-zuP7AwpJ.js";import{P as p}from"./Page-Du3-VsRf.js";import{H as r}from"./HeaderLabel-rmXyKC7V.js";import"./preload-helper-D9Z9MdNV.js";import"./Helmet-DyCSvoDs.js";import"./Box-JPQ-K-XF.js";import"./styled-BVnjfZaP.js";import"./Grid-DGDU_W7d.js";import"./Breadcrumbs-CexNrs2b.js";import"./index-DnL3XN75.js";import"./Popover-C0hTF1EH.js";import"./Modal-CJXuzFvx.js";import"./Portal-D3MaVJdo.js";import"./List-CcdBBh0x.js";import"./ListContext-BkpiPoXc.js";import"./ListItem-BE6uqYrF.js";import"./Link-Bbtl6_jS.js";import"./lodash-CwBbdt2Q.js";import"./index-DgvPNMU4.js";import"./useAnalytics-BKPjjI-y.js";import"./useApp-BAlbHaS5.js";import"./Page-CM8OOJT2.js";import"./useMediaQuery-CGFzaSvS.js";import"./Tooltip-DuxoX6f6.js";import"./Popper-Bfi8Jp6K.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
}`,...t.parameters?.docs?.source}}};const R=["Default"];export{t as Default,R as __namedExportsOrder,N as default};
