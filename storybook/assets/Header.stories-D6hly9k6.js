import{j as t}from"./iframe-B5eUq3Se.js";import{H as i}from"./Header-BmHAGcQT.js";import{P as a}from"./Page-z4bI1NAw.js";import{H as r}from"./HeaderLabel-BmdFGH__.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CNqrGbvX.js";import"./makeStyles-CutSd0r9.js";import"./Box-Dc6HtbNm.js";import"./styled-CctU0TIs.js";import"./Grid-BE58qVmP.js";import"./Breadcrumbs-xh5i76Zj.js";import"./index-B9sM2jn7.js";import"./Popover-Bud6loLp.js";import"./Modal-BjTDIRku.js";import"./Portal-DpJbamzY.js";import"./List-Cr_JFt2Y.js";import"./ListContext-BhsEYfmX.js";import"./ListItem-Cf7Arzhs.js";import"./Link-D4HWsLnT.js";import"./index-CNwWdbfK.js";import"./lodash-D0fT-qTZ.js";import"./index-Cz1Ci6GP.js";import"./useAnalytics-Bf6-Pwlo.js";import"./useApp-D6Xkw0OG.js";import"./Page-DOgAhImI.js";import"./useMediaQuery-CkM9pT3L.js";import"./Tooltip-D7_OCLcm.js";import"./Popper-DZlzY0sF.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
