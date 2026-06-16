import{bR as e,i as d,c7 as l}from"./iframe-Bm5ba6Eo.js";import{S as t}from"./Skeleton-DYmnfvSB.js";import{F as n}from"./Flex-CJJjo3o-.js";import{T as c}from"./Text-BSflCEKy.js";import"./preload-helper-PPVm8Dsz.js";const r=l.meta({title:"Backstage UI/Skeleton",component:t,argTypes:{rounded:{control:"boolean"},width:{control:"number"},height:{control:"number"}},args:{width:80,height:24,rounded:!1}}),i=r.story({args:{}}),o=r.story({args:{rounded:!0,width:48,height:48}}),h=r.story({render:()=>e.jsxs(n,{gap:"4",children:[e.jsx(t,{rounded:!0,width:48,height:48}),e.jsxs(n,{direction:"column",gap:"4",children:[e.jsx(t,{width:200,height:8}),e.jsx(t,{width:200,height:8}),e.jsx(t,{width:200,height:8}),e.jsxs(n,{gap:"4",children:[e.jsx(t,{width:"100%",height:8}),e.jsx(t,{width:"100%",height:8})]})]})]})}),s=r.story({render:()=>e.jsxs(n,{direction:"column",gap:"4",children:[e.jsx(t,{width:400,height:160}),e.jsx(t,{width:400,height:12}),e.jsx(t,{width:240,height:12})]})}),a=r.story({render:()=>e.jsx(n,{direction:"column",gap:"4",children:e.jsxs(d,{bg:"neutral",p:"4",children:[e.jsx(c,{children:"Neutral 1 container"}),e.jsxs(n,{gap:"2",mt:"2",direction:"column",pb:"4",children:[e.jsx(t,{width:200,height:12}),e.jsx(t,{width:200,height:12}),e.jsx(t,{width:200,height:12})]}),e.jsxs(d,{bg:"neutral",p:"4",children:[e.jsx(c,{children:"Neutral 2 container"}),e.jsxs(n,{gap:"2",mt:"2",direction:"column",pb:"4",children:[e.jsx(t,{width:200,height:12}),e.jsx(t,{width:200,height:12}),e.jsx(t,{width:200,height:12})]}),e.jsxs(d,{bg:"neutral",p:"4",children:[e.jsx(c,{children:"Neutral 3 container"}),e.jsxs(n,{gap:"2",mt:"2",direction:"column",children:[e.jsx(t,{width:200,height:12}),e.jsx(t,{width:200,height:12}),e.jsx(t,{width:200,height:12})]})]})]})]})})});i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {}
})`,...i.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    rounded: true,
    width: 48,
    height: 48
  }
})`,...o.input.parameters?.docs?.source}}};h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...h.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex direction="column" gap="4">
      <Skeleton width={400} height={160} />
      <Skeleton width={400} height={12} />
      <Skeleton width={240} height={12} />
    </Flex>
})`,...s.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex direction="column" gap="4">
      <Box bg="neutral" p="4">
        <Text>Neutral 1 container</Text>
        <Flex gap="2" mt="2" direction="column" pb="4">
          <Skeleton width={200} height={12} />
          <Skeleton width={200} height={12} />
          <Skeleton width={200} height={12} />
        </Flex>
        <Box bg="neutral" p="4">
          <Text>Neutral 2 container</Text>
          <Flex gap="2" mt="2" direction="column" pb="4">
            <Skeleton width={200} height={12} />
            <Skeleton width={200} height={12} />
            <Skeleton width={200} height={12} />
          </Flex>
          <Box bg="neutral" p="4">
            <Text>Neutral 3 container</Text>
            <Flex gap="2" mt="2" direction="column">
              <Skeleton width={200} height={12} />
              <Skeleton width={200} height={12} />
              <Skeleton width={200} height={12} />
            </Flex>
          </Box>
        </Box>
      </Box>
    </Flex>
})`,...a.input.parameters?.docs?.source}}};const w=["Default","Rounded","Demo1","Demo2","BackgroundAwareness"];export{a as BackgroundAwareness,i as Default,h as Demo1,s as Demo2,o as Rounded,w as __namedExportsOrder};
