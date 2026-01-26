import{j as t}from"./iframe-BUNFJ-LL.js";import{H as i}from"./Header-B_g5K3vl.js";import{P as a}from"./Page-cSVZbdlw.js";import{H as r}from"./HeaderLabel-Cx8AcAcv.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-Dvy4DeqH.js";import"./Box-E56LyC2U.js";import"./styled-BK7FZU9O.js";import"./Grid-DBxLs0pG.js";import"./Breadcrumbs-CHaaTi2C.js";import"./index-B9sM2jn7.js";import"./Popover-Dheh4pDu.js";import"./Modal-Cwa9uuB3.js";import"./Portal-j32zjom2.js";import"./List-TXTv7s6H.js";import"./ListContext-DDohaQJk.js";import"./ListItem-DqtCuPtR.js";import"./Link-9uhrDkOF.js";import"./lodash-Czox7iJy.js";import"./index-SSMRT9Bs.js";import"./useAnalytics-BrGJTKfU.js";import"./useApp-DBsIRrNl.js";import"./Page-DjRKu_HT.js";import"./useMediaQuery-DBcwnV0_.js";import"./Tooltip-Cy4UhZnY.js";import"./Popper-Bi7zPSXU.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
