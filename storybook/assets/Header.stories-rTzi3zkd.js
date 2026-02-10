import{j as t}from"./iframe-BDvXWqMv.js";import{H as i}from"./Header-BP3DM7kL.js";import{P as a}from"./Page-X5o4nDAe.js";import{H as r}from"./HeaderLabel-CZCk5-sx.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BMHjedH-.js";import"./Box-BU77o5ge.js";import"./styled-Dje9scF9.js";import"./Grid-SEE3Vji4.js";import"./Breadcrumbs-C5TD_YHH.js";import"./index-B9sM2jn7.js";import"./Popover-D_XQo6qj.js";import"./Modal-aUjOD6G2.js";import"./Portal-Bxsqc2Ff.js";import"./List-BCScUoZK.js";import"./ListContext-BMD4k7rh.js";import"./ListItem-DtJ6NXng.js";import"./Link-OHorDb2O.js";import"./lodash-DTh7qDqK.js";import"./index-CuoyrUh2.js";import"./useAnalytics-Bhj43Yb4.js";import"./useApp-XW1Y_59p.js";import"./Page-M-J3ByLn.js";import"./useMediaQuery-BQ4ZmzNz.js";import"./Tooltip-La5U8gro.js";import"./Popper-CBqxIWf4.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
