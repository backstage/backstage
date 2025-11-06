import{j as e}from"./iframe-D4YkWMPd.js";import{H as o}from"./Header-BfNJj4m-.js";import{P as p}from"./Page-DwgQN_UR.js";import{H as r}from"./HeaderLabel-DERKFUQ8.js";import"./preload-helper-D9Z9MdNV.js";import"./Helmet-Y12WVmhv.js";import"./Box-CrXhOgBb.js";import"./styled-dYo-GhGI.js";import"./Grid-3dbGowTG.js";import"./Breadcrumbs-D3dArTkI.js";import"./index-DnL3XN75.js";import"./Popover-Dw74DHDI.js";import"./Modal-BPzxcCH2.js";import"./Portal-GmGr81qv.js";import"./List-DbiJVjlG.js";import"./ListContext-C8PRUhDY.js";import"./ListItem-C4617hHA.js";import"./Link-Cg_HU4j2.js";import"./lodash-CwBbdt2Q.js";import"./index-Cb5ApCX3.js";import"./useAnalytics--ii2Xnv1.js";import"./useApp-BYOY4yJv.js";import"./Page-CCRPxgYC.js";import"./useMediaQuery-A7vHSOhn.js";import"./Tooltip-BBJrGxop.js";import"./Popper-BtazmgWL.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
