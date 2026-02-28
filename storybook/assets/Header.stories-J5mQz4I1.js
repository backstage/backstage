import{j as t}from"./iframe-DBRGxMDW.js";import{H as i}from"./Header-CZqZxmPz.js";import{P as a}from"./Page-DetZ2H8X.js";import{H as r}from"./HeaderLabel-BHbdAuFJ.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CrC4HSuy.js";import"./makeStyles-ByaqqE0C.js";import"./Box-CntJUP1x.js";import"./styled-BtxC7hTc.js";import"./Grid-DUgNNeQ8.js";import"./Breadcrumbs-D7Gld00W.js";import"./index-B9sM2jn7.js";import"./Popover-Dy1amroM.js";import"./Modal-rv70b7ym.js";import"./Portal-DK6syPsc.js";import"./List-Dwh_b94U.js";import"./ListContext-GpQvqqGL.js";import"./ListItem-DtNY3IdH.js";import"./Link-YCp9P7xP.js";import"./index-DeG_piPF.js";import"./lodash-WiBjX-DP.js";import"./index-DxdJ_Qst.js";import"./useAnalytics-D5q7uOOi.js";import"./useApp-CcMjJuGU.js";import"./Page-DwaTr6ZR.js";import"./useMediaQuery-DL1CJlMV.js";import"./Tooltip-DE5RCm9h.js";import"./Popper-BGeENWN1.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
