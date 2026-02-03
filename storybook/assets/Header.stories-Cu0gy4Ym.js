import{j as t}from"./iframe-DCoYcZLi.js";import{H as i}from"./Header-srgrq_nX.js";import{P as a}from"./Page-BbtOE5vg.js";import{H as r}from"./HeaderLabel-ZrAgdaoj.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-DQU-KE98.js";import"./Box-DX2D8BTJ.js";import"./styled-h2gldWYB.js";import"./Grid-D58TNpxw.js";import"./Breadcrumbs-XYivTcx-.js";import"./index-B9sM2jn7.js";import"./Popover-D-wzkU98.js";import"./Modal-CPACyKe7.js";import"./Portal-CFcI6CIt.js";import"./List-BdybXaA2.js";import"./ListContext-DkVKA3j4.js";import"./ListItem-DlFYWpXw.js";import"./Link-BB_0S9nF.js";import"./lodash-Czox7iJy.js";import"./index-CZ9gZJRb.js";import"./useAnalytics-DTSsXZrs.js";import"./useApp-B6U5E67n.js";import"./Page-D_P_LqWs.js";import"./useMediaQuery-CRNXQ6HN.js";import"./Tooltip-B4Ob7Xca.js";import"./Popper-DRIxTtO6.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
