import{j as e,B as c,p as u}from"./iframe-BKMB85pu.js";import{S as r}from"./Switch-B5PFrnEP.js";import{F as s}from"./Flex-QbSvYD_g.js";import{T as l}from"./Text-HfhzKVIY.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-Nyu7VTFu.js";import"./useObjectRef-CqnWYM4T.js";import"./useToggle-DG2PHA9X.js";import"./useFocusRing-jnagQyYL.js";import"./useFormReset-CvckHHjx.js";import"./useFormValidation-B-ExQgbu.js";import"./usePress-BpVHvCO3.js";import"./textSelection-Cj_b9rbF.js";import"./getMetaValue-TGQihhTK.js";import"./useSlot-DNsx0cSr.js";import"./useToggleState-DIBlFAqc.js";import"./useControlledState-D3rG0KvC.js";import"./useHover-BaAG1-q2.js";import"./VisuallyHidden-DlBkD_uH.js";const p=u.meta({title:"Backstage UI/Switch",component:r}),a=p.story({args:{label:"Switch"}}),o=p.story({args:{...a.input.args,isDisabled:!0}}),i=p.story({args:{label:"Label"},render:t=>e.jsxs(c,{bg:"neutral",p:"4",children:[e.jsxs(s,{direction:"column",gap:"4",children:[e.jsx(l,{children:"Neutral 1 container"}),e.jsxs(s,{gap:"4",children:[e.jsx(r,{...t}),e.jsx(r,{...t,isSelected:!0})]})]}),e.jsxs(c,{bg:"neutral",p:"4",mt:"4",children:[e.jsxs(s,{direction:"column",gap:"4",children:[e.jsx(l,{children:"Neutral 2 container"}),e.jsxs(s,{gap:"4",children:[e.jsx(r,{...t}),e.jsx(r,{...t,isSelected:!0})]})]}),e.jsx(c,{bg:"neutral",p:"4",mt:"4",children:e.jsxs(s,{direction:"column",gap:"4",children:[e.jsx(l,{children:"Neutral 3 container"}),e.jsxs(s,{gap:"4",children:[e.jsx(r,{...t}),e.jsx(r,{...t,isSelected:!0})]})]})})]})]})}),n=i.extend({args:{isDisabled:!0}});a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Switch'
  }
})`,...a.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    isDisabled: true
  }
})`,...o.input.parameters?.docs?.source}}};i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Label'
  },
  render: args => <Box bg="neutral" p="4">
      <Flex direction="column" gap="4">
        <Text>Neutral 1 container</Text>
        <Flex gap="4">
          <Switch {...args} />
          <Switch {...args} isSelected />
        </Flex>
      </Flex>
      <Box bg="neutral" p="4" mt="4">
        <Flex direction="column" gap="4">
          <Text>Neutral 2 container</Text>
          <Flex gap="4">
            <Switch {...args} />
            <Switch {...args} isSelected />
          </Flex>
        </Flex>
        <Box bg="neutral" p="4" mt="4">
          <Flex direction="column" gap="4">
            <Text>Neutral 3 container</Text>
            <Flex gap="4">
              <Switch {...args} />
              <Switch {...args} isSelected />
            </Flex>
          </Flex>
        </Box>
      </Box>
    </Box>
})`,...i.input.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`AutoBg.extend({
  args: {
    isDisabled: true
  }
})`,...n.parameters?.docs?.source}}};const _=["Default","Disabled","AutoBg","AutoBgDisabled"];export{i as AutoBg,n as AutoBgDisabled,a as Default,o as Disabled,_ as __namedExportsOrder};
