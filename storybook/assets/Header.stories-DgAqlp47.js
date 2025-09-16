import{j as e}from"./iframe-PR9K1gR4.js";import{H as o}from"./Header-C0OF1CI7.js";import{P as p}from"./Page-Cch3vVF9.js";import{H as r}from"./HeaderLabel-B4Pz0-fn.js";import"./preload-helper-D9Z9MdNV.js";import"./Helmet-BknictYz.js";import"./Box-DE3El2Us.js";import"./styled-BWfK9xAq.js";import"./Grid-BDCj0xnW.js";import"./Breadcrumbs-CQqkvAFW.js";import"./index-DnL3XN75.js";import"./Popover-BP65aWRb.js";import"./Modal-DgU04yZ2.js";import"./Portal-CHANQNTr.js";import"./List-9O5jesKH.js";import"./ListContext-d9I9drbR.js";import"./ListItem-BSmKrE7c.js";import"./Link-8mF5gqTh.js";import"./lodash-CwBbdt2Q.js";import"./index-qP2Hr3Qu.js";import"./useAnalytics-D2YlE8CY.js";import"./useApp-BW5Yca7D.js";import"./Page-B_shoIxi.js";import"./useMediaQuery-Bdoqc4QJ.js";import"./Tooltip-NKLLE1oV.js";import"./Popper-C2P8lryL.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
