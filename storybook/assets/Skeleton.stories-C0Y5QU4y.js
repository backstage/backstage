import{ap as w,am as x,j as e,p as S}from"./iframe-y42y8Oej.js";import{F as i}from"./Flex-Dh2pvJMs.js";import"./preload-helper-PPVm8Dsz.js";const k={"bui-Skeleton":"_bui-Skeleton_1osxv_20"},f=w()({styles:k,classNames:{root:"bui-Skeleton"},propDefs:{width:{default:80},height:{default:24},rounded:{dataAttribute:!0,default:!1},className:{},style:{}}}),t=d=>{const{ownProps:h,restProps:p,dataAttributes:u}=x(f,d),{classes:c,width:l,height:m,style:g}=h;return e.jsx("div",{className:c.root,...u,style:{width:l,height:m,...g},...p})};t.__docgenInfo={description:"@public",methods:[],displayName:"Skeleton",props:{width:{required:!1,tsType:{name:"union",raw:"number | string",elements:[{name:"number"},{name:"string"}]},description:""},height:{required:!1,tsType:{name:"union",raw:"number | string",elements:[{name:"number"},{name:"string"}]},description:""},rounded:{required:!1,tsType:{name:"boolean"},description:""},className:{required:!1,tsType:{name:"string"},description:""},style:{required:!1,tsType:{name:"ReactCSSProperties",raw:"React.CSSProperties"},description:""}},composes:["Omit"]};const a=S.meta({title:"Backstage UI/Skeleton",component:t,argTypes:{rounded:{control:"boolean"},width:{control:"number"},height:{control:"number"}},args:{width:80,height:24,rounded:!1}}),n=a.story({args:{}}),r=a.story({args:{rounded:!0,width:48,height:48}}),s=a.story({render:()=>e.jsxs(i,{gap:"4",children:[e.jsx(t,{rounded:!0,width:48,height:48}),e.jsxs(i,{direction:"column",gap:"4",children:[e.jsx(t,{width:200,height:8}),e.jsx(t,{width:200,height:8}),e.jsx(t,{width:200,height:8}),e.jsxs(i,{gap:"4",children:[e.jsx(t,{width:"100%",height:8}),e.jsx(t,{width:"100%",height:8})]})]})]})}),o=a.story({render:()=>e.jsxs(i,{direction:"column",gap:"4",children:[e.jsx(t,{width:400,height:160}),e.jsx(t,{width:400,height:12}),e.jsx(t,{width:240,height:12})]})});n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{code:`const Default = () => <Skeleton width={80} height={24} rounded={false} />;
`,...n.input.parameters?.docs?.source}}};r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{code:`const Rounded = () => <Skeleton width={48} height={48} rounded />;
`,...r.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{code:`const Demo1 = () => (
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
`,...s.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{code:`const Demo2 = () => (
  <Flex direction="column" gap="4">
    <Skeleton width={400} height={160} />
    <Skeleton width={400} height={12} />
    <Skeleton width={240} height={12} />
  </Flex>
);
`,...o.input.parameters?.docs?.source}}};n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {}
})`,...n.input.parameters?.docs?.source}}};r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    rounded: true,
    width: 48,
    height: 48
  }
})`,...r.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...s.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex direction="column" gap="4">
      <Skeleton width={400} height={160} />
      <Skeleton width={400} height={12} />
      <Skeleton width={240} height={12} />
    </Flex>
})`,...o.input.parameters?.docs?.source}}};const b=["Default","Rounded","Demo1","Demo2"];export{n as Default,s as Demo1,o as Demo2,r as Rounded,b as __namedExportsOrder};
