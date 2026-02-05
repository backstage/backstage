import{j as e,p as x}from"./iframe-M9O-K8SB.js";import{u as S}from"./useStyles-BRwt6BXn.js";import{c as k}from"./clsx-B-dksMZM.js";import{F as i}from"./Flex-Bz2InqMs.js";import"./preload-helper-PPVm8Dsz.js";import"./useSurface-CJaN3YoD.js";const F={classNames:{root:"bui-Skeleton"}},y={"bui-Skeleton":"_bui-Skeleton_1lzoo_20"},t=h=>{const{classNames:d,cleanedProps:p}=S(F,{width:80,height:24,rounded:!1,...h}),{className:u,width:c,height:l,rounded:m,style:g,...w}=p;return e.jsx("div",{className:k(d.root,y[d.root],u),"data-rounded":m,style:{width:c,height:l,...g},...w})};t.__docgenInfo={description:"@public",methods:[],displayName:"Skeleton",props:{width:{required:!1,tsType:{name:"union",raw:"number | string",elements:[{name:"number"},{name:"string"}]},description:""},height:{required:!1,tsType:{name:"union",raw:"number | string",elements:[{name:"number"},{name:"string"}]},description:""},rounded:{required:!1,tsType:{name:"boolean"},description:""}},composes:["ComponentProps"]};const a=x.meta({title:"Backstage UI/Skeleton",component:t,argTypes:{rounded:{control:"boolean"},width:{control:"number"},height:{control:"number"}},args:{width:80,height:24,rounded:!1}}),n=a.story({args:{}}),o=a.story({args:{rounded:!0,width:48,height:48}}),r=a.story({render:()=>e.jsxs(i,{gap:"4",children:[e.jsx(t,{rounded:!0,width:48,height:48}),e.jsxs(i,{direction:"column",gap:"4",children:[e.jsx(t,{width:200,height:8}),e.jsx(t,{width:200,height:8}),e.jsx(t,{width:200,height:8}),e.jsxs(i,{gap:"4",children:[e.jsx(t,{width:"100%",height:8}),e.jsx(t,{width:"100%",height:8})]})]})]})}),s=a.story({render:()=>e.jsxs(i,{direction:"column",gap:"4",children:[e.jsx(t,{width:400,height:160}),e.jsx(t,{width:400,height:12}),e.jsx(t,{width:240,height:12})]})});n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{code:`const Default = () => <Skeleton width={80} height={24} rounded={false} />;
`,...n.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{code:`const Rounded = () => <Skeleton width={48} height={48} rounded />;
`,...o.input.parameters?.docs?.source}}};r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{code:`const Demo1 = () => (
  <Flex gap="4">
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
);
`,...r.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{code:`const Demo2 = () => (
  <Flex direction="column" gap="4">
    <Skeleton width={400} height={160} />
    <Skeleton width={400} height={12} />
    <Skeleton width={240} height={12} />
  </Flex>
);
`,...s.input.parameters?.docs?.source}}};n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {}
})`,...n.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    rounded: true,
    width: 48,
    height: 48
  }
})`,...o.input.parameters?.docs?.source}}};r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...r.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex direction="column" gap="4">
      <Skeleton width={400} height={160} />
      <Skeleton width={400} height={12} />
      <Skeleton width={240} height={12} />
    </Flex>
})`,...s.input.parameters?.docs?.source}}};const R=["Default","Rounded","Demo1","Demo2"];export{n as Default,r as Demo1,s as Demo2,o as Rounded,R as __namedExportsOrder};
