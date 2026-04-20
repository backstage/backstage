import{j as e}from"./iframe-Cz6SWQVH.js";import{H as o}from"./Header-BivtL6nP.js";import{P as p}from"./Page-BU0MR0M7.js";import{H as r}from"./HeaderLabel-a1ZsTKJO.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CmGWmLtC.js";import"./Box-BfOwOGWn.js";import"./styled-CHQDB4JG.js";import"./Grid-vJ4N4mtA.js";import"./makeStyles-DkpM-pcx.js";import"./Breadcrumbs-8xKRQxuW.js";import"./index-B9sM2jn7.js";import"./Popover-CLTNTp2m.js";import"./Modal-CRoJIq51.js";import"./Portal-Cwv6n3co.js";import"./List-CPTtSvEh.js";import"./ListContext-BZcjIfXN.js";import"./ListItem-Co51ld_D.js";import"./Link-rJUKOl72.js";import"./index-COEqbYNs.js";import"./lodash-BYoV5fke.js";import"./useAnalytics-D119RZa6.js";import"./useApp-DGYXI2Z1.js";import"./Page-LaAhjTtb.js";import"./useMediaQuery-CeQPnuqh.js";import"./Tooltip-DEuFBR78.js";import"./Popper-CWL0dBRv.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
}`,...t.parameters?.docs?.source}}};const S=["Default"];export{t as Default,S as __namedExportsOrder,R as default};
