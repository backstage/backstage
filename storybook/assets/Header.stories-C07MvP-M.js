import{j as t}from"./iframe-BAAMxX04.js";import{H as i}from"./Header-D9ESdkvB.js";import{P as a}from"./Page-xHjcPD-1.js";import{H as r}from"./HeaderLabel-DRbfspER.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-D_DPcA9y.js";import"./makeStyles-Gcd-M5aY.js";import"./Box-DWmyZ5Ze.js";import"./styled-x10YRlqs.js";import"./Grid-bsc20U2v.js";import"./Breadcrumbs-BRJrMvfB.js";import"./index-B9sM2jn7.js";import"./Popover-Dneg8xTB.js";import"./Modal-D0ZnfcKK.js";import"./Portal-DE326cIY.js";import"./List-CWixwH1G.js";import"./ListContext-COr9ityP.js";import"./ListItem-BX7a0Z-y.js";import"./Link-CvA_RcHM.js";import"./index-Ch5Cm9Ah.js";import"./lodash-BcT4sL41.js";import"./index-DV_MCKd1.js";import"./useAnalytics-BSrF4G5O.js";import"./useApp-CvcYQqjl.js";import"./Page-CICe79lv.js";import"./useMediaQuery-Ccy9ZB3_.js";import"./Tooltip-Cow5tudN.js";import"./Popper-DxqnTNur.js";const S={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
