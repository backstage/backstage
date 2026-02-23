import{j as t}from"./iframe-CT0kqbtx.js";import{H as i}from"./Header-CYcqwgDV.js";import{P as a}from"./Page-OoS3Y5NE.js";import{H as r}from"./HeaderLabel-viy_WDp8.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-B3G2HPfR.js";import"./makeStyles-DcVFc7tY.js";import"./Box-D9dg6CgS.js";import"./styled-BLkpW3Mf.js";import"./Grid-BDVcufVA.js";import"./Breadcrumbs-MaidkXPz.js";import"./index-B9sM2jn7.js";import"./Popover-DV6slOQA.js";import"./Modal-Il3Pl7UL.js";import"./Portal-BtLj93zy.js";import"./List-CI6msm6Y.js";import"./ListContext-CFe7K_lB.js";import"./ListItem-C8Yqw-7T.js";import"./Link-BfoO4-Ib.js";import"./index-yu5cIKNC.js";import"./lodash-BBZYXrTl.js";import"./index-BogYrcCc.js";import"./useAnalytics-Cwz45vQ0.js";import"./useApp-B6I2yL-o.js";import"./Page-DnI5PQWA.js";import"./useMediaQuery-CHEVb_cA.js";import"./Tooltip-w_fvyE_G.js";import"./Popper-DfZHcMCo.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
