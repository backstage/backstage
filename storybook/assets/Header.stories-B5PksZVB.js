import{j as t}from"./iframe-DhudO7cT.js";import{H as i}from"./Header-8ngg_W8m.js";import{P as a}from"./Page-CJUF4V64.js";import{H as r}from"./HeaderLabel-B1gh4AdZ.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BYocGkLa.js";import"./makeStyles-DirKP-uM.js";import"./Box-Dfq4Rk_q.js";import"./styled-Bb0qtC6P.js";import"./Grid-jH0iynLg.js";import"./Breadcrumbs-DA0Hv7rC.js";import"./index-B9sM2jn7.js";import"./Popover-Co_U8rXS.js";import"./Modal-D-bP3iV-.js";import"./Portal-DHDPWTL1.js";import"./List-CETIUmeh.js";import"./ListContext-DXxn2Iso.js";import"./ListItem--o6-pCQj.js";import"./Link-CqfoUZfB.js";import"./index-T8FjcnlS.js";import"./lodash-D50Mv8ds.js";import"./index-CBf-CADU.js";import"./useAnalytics-CJ0Sk0Lg.js";import"./useApp-rE8BYLs2.js";import"./Page-DUZYRgQc.js";import"./useMediaQuery-DxDp67PO.js";import"./Tooltip-DGvAz1hB.js";import"./Popper-ByURgkss.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
