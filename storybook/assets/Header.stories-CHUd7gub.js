import{j as t}from"./iframe-BRAtl1PG.js";import{H as i}from"./Header-Bihq3nL-.js";import{P as a}from"./Page-B_xwFsIO.js";import{H as r}from"./HeaderLabel-B9AxAXe-.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BdQnlgox.js";import"./Box-D7EfII4J.js";import"./styled-D-CRs93U.js";import"./Grid-Cneg6dXd.js";import"./Breadcrumbs-KqF4ReSj.js";import"./index-B9sM2jn7.js";import"./Popover-Da1vwkD2.js";import"./Modal-COPte8PF.js";import"./Portal-CmmcMNPo.js";import"./List-DW5i0QCT.js";import"./ListContext-DnBkigGS.js";import"./ListItem-DGTqNMMt.js";import"./Link-BXsEZtUH.js";import"./lodash-Czox7iJy.js";import"./index-UAXk7FN5.js";import"./useAnalytics-DVsybmfh.js";import"./useApp-Gv1SYk8q.js";import"./Page-D6PshrWD.js";import"./useMediaQuery-COy2-Kh6.js";import"./Tooltip-CPq4vOtC.js";import"./Popper-b-3H8dnH.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
}`,...e.parameters?.docs?.source}}};const R=["Default"];export{e as Default,R as __namedExportsOrder,N as default};
