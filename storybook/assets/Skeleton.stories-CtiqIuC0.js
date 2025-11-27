import{j as e}from"./iframe-B6vHPHUS.js";import{u as x}from"./useStyles-C-y3xpyB.js";import{c as w}from"./clsx-B-dksMZM.js";import{F as i}from"./Flex-CUF93du8.js";import"./preload-helper-D9Z9MdNV.js";const S={classNames:{root:"bui-Skeleton"}},k={"bui-Skeleton":"_bui-Skeleton_1lzoo_20"},t=d=>{const{classNames:a,cleanedProps:h}=x(S,{width:80,height:24,rounded:!1,...d}),{className:c,width:l,height:m,rounded:u,style:g,...p}=h;return e.jsx("div",{className:w(a.root,k[a.root],c),"data-rounded":u,style:{width:l,height:m,...g},...p})};t.__docgenInfo={description:"@public",methods:[],displayName:"Skeleton",props:{width:{required:!1,tsType:{name:"union",raw:"number | string",elements:[{name:"number"},{name:"string"}]},description:""},height:{required:!1,tsType:{name:"union",raw:"number | string",elements:[{name:"number"},{name:"string"}]},description:""},rounded:{required:!1,tsType:{name:"boolean"},description:""}},composes:["ComponentProps"]};const D={title:"Backstage UI/Skeleton",component:t,argTypes:{rounded:{control:"boolean"},width:{control:"number"},height:{control:"number"}},args:{width:80,height:24,rounded:!1}},r={args:{}},n={args:{rounded:!0,width:48,height:48}},o={render:()=>e.jsxs(i,{gap:"4",children:[e.jsx(t,{rounded:!0,width:48,height:48}),e.jsxs(i,{direction:"column",gap:"4",children:[e.jsx(t,{width:200,height:8}),e.jsx(t,{width:200,height:8}),e.jsx(t,{width:200,height:8}),e.jsxs(i,{gap:"4",children:[e.jsx(t,{width:"100%",height:8}),e.jsx(t,{width:"100%",height:8})]})]})]})},s={render:()=>e.jsxs(i,{direction:"column",gap:"4",children:[e.jsx(t,{width:400,height:160}),e.jsx(t,{width:400,height:12}),e.jsx(t,{width:240,height:12})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {}
}`,...r.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    rounded: true,
    width: 48,
    height: 48
  }
}`,...n.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <Flex gap="4">
      <Skeleton rounded width={48} height={48} />
      <Flex direction="column" gap="4">
        <Skeleton width={200} height={8} />
        <Skeleton width={200} height={8} />
        <Skeleton width={200} height={8} />
        <Flex gap="4">
          <Skeleton width="100%" height={8} />
          <Skeleton width="100%" height={8} />
        </Flex>
      </Flex>
    </Flex>
}`,...o.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <Flex direction="column" gap="4">
      <Skeleton width={400} height={160} />
      <Skeleton width={400} height={12} />
      <Skeleton width={240} height={12} />
    </Flex>
}`,...s.parameters?.docs?.source}}};const _=["Default","Rounded","Demo1","Demo2"];export{r as Default,o as Demo1,s as Demo2,n as Rounded,_ as __namedExportsOrder,D as default};
