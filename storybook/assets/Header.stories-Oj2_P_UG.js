import{j as t}from"./iframe-BCnUaApn.js";import{H as i}from"./Header-D7gBAfCm.js";import{P as a}from"./Page-B41TS__m.js";import{H as r}from"./HeaderLabel-DXK62oc9.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CU0qDghT.js";import"./makeStyles-JxVjC-J_.js";import"./Box-Cd17mACv.js";import"./styled-CI-jgXD3.js";import"./Grid-C3uFc5ER.js";import"./Breadcrumbs-tHVf5OpC.js";import"./index-B9sM2jn7.js";import"./Popover-Bu1QA2KL.js";import"./Modal-DttNqa2Q.js";import"./Portal-CNnOrQPJ.js";import"./List-CQ8sfUf8.js";import"./ListContext-0sSsVP2_.js";import"./ListItem-BwmhHob9.js";import"./Link-DmstRdCS.js";import"./index-D7kONAGS.js";import"./lodash-DBetALU0.js";import"./index-B-tXUl4g.js";import"./useAnalytics-C8tUzO32.js";import"./useApp-Dfh5cMly.js";import"./Page-DeUn_uGf.js";import"./useMediaQuery-B9j3IPMx.js";import"./Tooltip-_2auSyxn.js";import"./Popper-yUMq0QBb.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
