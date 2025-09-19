import{j as e}from"./iframe-BkB0QVAX.js";import{H as o}from"./Header-9V0htMP5.js";import{P as p}from"./Page-D1l5Qs2k.js";import{H as r}from"./HeaderLabel-CW05nvPz.js";import"./preload-helper-D9Z9MdNV.js";import"./Helmet-CBuMUBOD.js";import"./Box-BYh2ueao.js";import"./styled-BkGenL9r.js";import"./Grid-GzVmgdg9.js";import"./Breadcrumbs-CtBK6Wjc.js";import"./index-DnL3XN75.js";import"./Popover-Kzi_v5IP.js";import"./Modal-BGWqml8P.js";import"./Portal-CniYJQFb.js";import"./List-CL3RsQbd.js";import"./ListContext-1D3zRM57.js";import"./ListItem-uoYhpxef.js";import"./Link-DEl3EO73.js";import"./lodash-CwBbdt2Q.js";import"./index-CG9-iTWl.js";import"./useAnalytics-BaiO7IUZ.js";import"./useApp-BcKqXm1b.js";import"./Page-BFm0CYZX.js";import"./useMediaQuery-DXeV88vM.js";import"./Tooltip-Cw7U8Fon.js";import"./Popper-CoIZ3FWg.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
}`,...t.parameters?.docs?.source}}};const R=["Default"];export{t as Default,R as __namedExportsOrder,N as default};
