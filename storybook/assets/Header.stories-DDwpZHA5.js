import{j as t}from"./iframe-DfW0k9e4.js";import{H as i}from"./Header-C5Kcdqzn.js";import{P as a}from"./Page-BMgGwctg.js";import{H as r}from"./HeaderLabel-Dc7-2_vO.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-J0EiLON_.js";import"./Box-D0zAdjf6.js";import"./styled-CReYHJ7K.js";import"./Grid-DOkM8E58.js";import"./Breadcrumbs-ChWsv7AX.js";import"./index-B9sM2jn7.js";import"./Popover-DTsWRma1.js";import"./Modal-B6gsZuYb.js";import"./Portal-D7dEWwg8.js";import"./List-B3BEM4nz.js";import"./ListContext-hwCl85Z0.js";import"./ListItem-Bw1vw_JI.js";import"./Link-BloAuSmB.js";import"./lodash-DLuUt6m8.js";import"./index-Gw3tDiAb.js";import"./useAnalytics-BnjriHJi.js";import"./useApp-BXmyl95T.js";import"./Page-BhP-FqYw.js";import"./useMediaQuery-DXFUOQHP.js";import"./Tooltip-DzakseTW.js";import"./Popper-B4DyDbOp.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
