import{j as t}from"./iframe-DcAecAau.js";import{H as i}from"./Header-r_tEuBFH.js";import{P as a}from"./Page-C49xGdP-.js";import{H as r}from"./HeaderLabel-DEQYy0oR.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-Cq7lC5bb.js";import"./makeStyles-Cdr7b8Bk.js";import"./Box-DFVASWD2.js";import"./styled-24VWDP1y.js";import"./Grid-DVeyPTP6.js";import"./Breadcrumbs-CJzDQpHI.js";import"./index-B9sM2jn7.js";import"./Popover-8B15LdLG.js";import"./Modal-CU8nMOSv.js";import"./Portal-DUiXLT2Z.js";import"./List-DwRDgM_u.js";import"./ListContext-D1z8ROX7.js";import"./ListItem-Dm4rReYJ.js";import"./Link-CveV8ncC.js";import"./index-B8zE_pAT.js";import"./lodash-EmQGSg9i.js";import"./index-CNtntR7q.js";import"./useAnalytics-DH1T3srq.js";import"./useApp-wY_LWfHh.js";import"./Page-CIQeyu4d.js";import"./useMediaQuery-x-DuVaS-.js";import"./Tooltip--unGCy0g.js";import"./Popper-CfVmlnqD.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
