import{j as t}from"./iframe-oBxK6qra.js";import{H as i}from"./Header-DghSdvvf.js";import{P as a}from"./Page-nKdA8jRK.js";import{H as r}from"./HeaderLabel-OZp3AeLG.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-ByWogMkY.js";import"./makeStyles-B3IkJU93.js";import"./Box-DfiY0lfn.js";import"./styled-CUSqWafa.js";import"./Grid-B7p-OhlU.js";import"./Breadcrumbs-D4H1N41J.js";import"./index-B9sM2jn7.js";import"./Popover-rtX2qvNk.js";import"./Modal-BNme6v5r.js";import"./Portal-inACr_9c.js";import"./List-Sd8wYk3i.js";import"./ListContext-BbbmxUrC.js";import"./ListItem-DtIi3ktM.js";import"./Link-DTE78IDp.js";import"./index-cGfInv2G.js";import"./lodash-C4zl_2vh.js";import"./index-DgkS_dxy.js";import"./useAnalytics-CBg6STS1.js";import"./useApp-JFSQIXad.js";import"./Page-7DYfll8K.js";import"./useMediaQuery-DOYaIRFf.js";import"./Tooltip-BmsdhjHf.js";import"./Popper-CGGPeLTJ.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
