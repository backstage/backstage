import{j as t}from"./iframe-DTfizrde.js";import{H as i}from"./Header-DIcuCXto.js";import{P as a}from"./Page-BZlQV5vf.js";import{H as r}from"./HeaderLabel-BMfR_qYn.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BfFvaa5d.js";import"./makeStyles-cQYMssxT.js";import"./Box-BJ9QCDuL.js";import"./styled-D7CkLDDF.js";import"./Grid-CiU0LbEc.js";import"./Breadcrumbs-50Mc5vl8.js";import"./index-B9sM2jn7.js";import"./Popover-QLUC5cRE.js";import"./Modal-UP6JYRoo.js";import"./Portal-DWz9hzP1.js";import"./List-D_x_P-c5.js";import"./ListContext-D7hCMl_b.js";import"./ListItem-DW0UN9hL.js";import"./Link-CGOZa_jE.js";import"./index-DBIKoDFV.js";import"./lodash-CVq2iuuf.js";import"./index-Btvc_mYP.js";import"./useAnalytics-Dnz6KMIA.js";import"./useApp-DWA61M3_.js";import"./Page-BMr_gIIg.js";import"./useMediaQuery-Bxu_kSoa.js";import"./Tooltip-CiR2CeYH.js";import"./Popper-CDKiD4XM.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
}`,...e.parameters?.docs?.source}}};const k=["Default"];export{e as Default,k as __namedExportsOrder,S as default};
