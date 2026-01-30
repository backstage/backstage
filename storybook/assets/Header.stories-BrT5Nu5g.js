import{j as t}from"./iframe-BdfNw3Ub.js";import{H as i}from"./Header-CR9zg6_j.js";import{P as a}from"./Page-Cf8JKGBQ.js";import{H as r}from"./HeaderLabel-CydYPqN4.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-fj0mK_zP.js";import"./Box-Ck7a0B2s.js";import"./styled-BblI00As.js";import"./Grid-ClCC6X0d.js";import"./Breadcrumbs-Bxi7PQSe.js";import"./index-B9sM2jn7.js";import"./Popover-CGynt5_q.js";import"./Modal-DSvl6f6m.js";import"./Portal-CuRfOwRS.js";import"./List-Be-141Yt.js";import"./ListContext-C0BE_woo.js";import"./ListItem-eROPvDGl.js";import"./Link-CYv59bNI.js";import"./lodash-Czox7iJy.js";import"./index-DGTjwYkT.js";import"./useAnalytics-CIau1Q_f.js";import"./useApp-CClJ7qR8.js";import"./Page-yyZsxk-d.js";import"./useMediaQuery-D9fRC3z6.js";import"./Tooltip-LFPLy9FS.js";import"./Popper-CW4DzWu0.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
