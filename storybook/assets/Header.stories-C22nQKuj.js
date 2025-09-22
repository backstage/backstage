import{j as e}from"./iframe-hvh2aMf9.js";import{H as o}from"./Header-Vx9wx1aA.js";import{P as p}from"./Page-Ch4dW3sI.js";import{H as r}from"./HeaderLabel-CiQyZhI-.js";import"./preload-helper-D9Z9MdNV.js";import"./Helmet-DC2ih9mo.js";import"./Box-BjIjXY28.js";import"./styled-CsVOCgfV.js";import"./Grid-DbJ44Ewx.js";import"./Breadcrumbs-vDCfLaaV.js";import"./index-DnL3XN75.js";import"./Popover-DO-qvFaR.js";import"./Modal-D7enm8Ov.js";import"./Portal-Bb9zcDOK.js";import"./List-74W1l74F.js";import"./ListContext-DMJfGJuk.js";import"./ListItem-CXtueEiL.js";import"./Link-CHVET8I2.js";import"./lodash-CwBbdt2Q.js";import"./index-7QU1_rFp.js";import"./useAnalytics-CVphDHTH.js";import"./useApp-CqXr_4Cz.js";import"./Page-Dc5fsIoj.js";import"./useMediaQuery-B1wWzBj6.js";import"./Tooltip-Y5wSFqY4.js";import"./Popper-CHxzJWK6.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
