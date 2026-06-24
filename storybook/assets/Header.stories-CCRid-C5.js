import{bR as e}from"./iframe-DhttR-Z-.js";import{H as o}from"./Header-DwOrwOFT.js";import{P as p}from"./Page-CrJUcnA6.js";import{H as r}from"./HeaderLabel-Bykm9EIC.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-GOTkpw9G.js";import"./Box-CUxFOM_T.js";import"./styled-jJXBC4kr.js";import"./Grid-VkbE96t3.js";import"./makeStyles-C_GO-7Nl.js";import"./Breadcrumbs-Cd_nrqDQ.js";import"./index-B9sM2jn7.js";import"./Popover-DHFEClMd.js";import"./Modal-LyNkSPwz.js";import"./Portal-CqcvHw1l.js";import"./List-DzoxYXEY.js";import"./ListContext-DPsuXuco.js";import"./ListItem-C_3NeckJ.js";import"./Link-CmpVD7EF.js";import"./index-B5_svkds.js";import"./lodash-B8DiURsi.js";import"./useAnalytics-Cg4YSIs1.js";import"./useApp-CHw-3fg9.js";import"./Page-BiQVpj3Q.js";import"./useMediaQuery-By5vZ5F1.js";import"./Tooltip-CLkcFFIX.js";import"./Popper-CM66lfCc.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
}`,...t.parameters?.docs?.source}}};const S=["Default"];export{t as Default,S as __namedExportsOrder,N as default};
