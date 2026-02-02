import{j as t}from"./iframe-Bz1IoDwg.js";import{H as i}from"./Header-D7pUko5L.js";import{P as a}from"./Page-DVvJenS1.js";import{H as r}from"./HeaderLabel-BGVWBcOo.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-yDbrC5NT.js";import"./Box-B4X1pSLD.js";import"./styled-nJYZvWBJ.js";import"./Grid-DSK0Sob8.js";import"./Breadcrumbs-tcITBtSl.js";import"./index-B9sM2jn7.js";import"./Popover-BW8B5BX3.js";import"./Modal-Bl681vyA.js";import"./Portal-nnGdoBnk.js";import"./List-BuBw1TsS.js";import"./ListContext-BU0MJFdF.js";import"./ListItem-DwPXYlNl.js";import"./Link-BTTdXJ1E.js";import"./lodash-Czox7iJy.js";import"./index-CrqMr4SR.js";import"./useAnalytics-CTEKxLAM.js";import"./useApp-PKPW6CfH.js";import"./Page-8675TV-l.js";import"./useMediaQuery-C7p5dCds.js";import"./Tooltip-Dnn6Xi1p.js";import"./Popper-vOyuMRKf.js";const N={title:"Layout/Header",component:i,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},p=t.jsxs(t.Fragment,{children:[t.jsx(r,{label:"Owner",value:"players"}),t.jsx(r,{label:"Lifecycle",value:"Production"}),t.jsx(r,{label:"Tier",value:"Level 1"})]}),e=s=>{const{type:o}=s;return t.jsx(a,{themeId:o,children:t.jsx(i,{...s,children:p})})};e.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};e.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
