import{j as t}from"./iframe-BY6cr4Gs.js";import{H as i}from"./Header-D7P41vRf.js";import{P as a}from"./Page-OyjVOVUB.js";import{H as r}from"./HeaderLabel-CiYtF7uD.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BJeiNuBD.js";import"./Box-CioLgZLe.js";import"./styled-C2PdKBXZ.js";import"./Grid-CPNST6ei.js";import"./Breadcrumbs-Di5K9jr2.js";import"./index-B9sM2jn7.js";import"./Popover-CSLjBTLK.js";import"./Modal-27M29ymL.js";import"./Portal-RovY2swJ.js";import"./List-BYnFuPKk.js";import"./ListContext-Cv7Ut4-T.js";import"./ListItem-Bc4c47Te.js";import"./Link-Y-vtcYZ5.js";import"./lodash-Y_-RFQgK.js";import"./index-CidjncPb.js";import"./useAnalytics-BgncGw0N.js";import"./useApp-Tcb-kbrm.js";import"./Page-D56aaN-R.js";import"./useMediaQuery-BQ9F9Qxa.js";import"./Tooltip-BeI5iaz3.js";import"./Popper-DBVT3TNi.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
