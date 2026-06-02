import{bR as e,c7 as a}from"./iframe-DogXi1kP.js";import{S as t}from"./Skeleton-OxlxzLgT.js";import{F as s}from"./Flex-Bi-SKTgz.js";import"./preload-helper-PPVm8Dsz.js";const h=a.meta({title:"Backstage UI/Skeleton",component:t,argTypes:{rounded:{control:"boolean"},width:{control:"number"},height:{control:"number"}},args:{width:80,height:24,rounded:!1}}),r=h.story({args:{}}),n=h.story({args:{rounded:!0,width:48,height:48}}),o=h.story({render:()=>e.jsxs(s,{gap:"4",children:[e.jsx(t,{rounded:!0,width:48,height:48}),e.jsxs(s,{direction:"column",gap:"4",children:[e.jsx(t,{width:200,height:8}),e.jsx(t,{width:200,height:8}),e.jsx(t,{width:200,height:8}),e.jsxs(s,{gap:"4",children:[e.jsx(t,{width:"100%",height:8}),e.jsx(t,{width:"100%",height:8})]})]})]})}),i=h.story({render:()=>e.jsxs(s,{direction:"column",gap:"4",children:[e.jsx(t,{width:400,height:160}),e.jsx(t,{width:400,height:12}),e.jsx(t,{width:240,height:12})]})});r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {}
})`,...r.input.parameters?.docs?.source}}};n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    rounded: true,
    width: 48,
    height: 48
  }
})`,...n.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...o.input.parameters?.docs?.source}}};i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex direction="column" gap="4">
      <Skeleton width={400} height={160} />
      <Skeleton width={400} height={12} />
      <Skeleton width={240} height={12} />
    </Flex>
})`,...i.input.parameters?.docs?.source}}};const m=["Default","Rounded","Demo1","Demo2"];export{r as Default,o as Demo1,i as Demo2,n as Rounded,m as __namedExportsOrder};
