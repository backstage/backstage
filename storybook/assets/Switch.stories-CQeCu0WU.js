import{j as e,B as c,p as u}from"./iframe-DvObL_em.js";import{S as r}from"./Switch-CwFUwD7K.js";import{F as s}from"./Flex-DqYXVpWH.js";import{T as l}from"./Text-BaU24DSn.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-BE29XZkF.js";import"./useObjectRef-DwzLjeGu.js";import"./useToggle-DBQaZCjn.js";import"./useFocusRing-piHZ0Lw1.js";import"./openLink-Ba7f2eDn.js";import"./useFormReset-BXzPmcpf.js";import"./useFormValidation-B7os7M_X.js";import"./usePress-YbeHGM9M.js";import"./textSelection-C86JgNxW.js";import"./getMetaValue-aV81Iu2D.js";import"./useSlot-CDFdmBTI.js";import"./useToggleState-D5cE_7cJ.js";import"./useControlledState-DTrBQisE.js";import"./useHover-BBinV-uq.js";import"./VisuallyHidden-D7cx75l9.js";const p=u.meta({title:"Backstage UI/Switch",component:r}),a=p.story({args:{label:"Switch"}}),o=p.story({args:{...a.input.args,isDisabled:!0}}),i=p.story({args:{label:"Label"},render:t=>e.jsxs(c,{bg:"neutral",p:"4",children:[e.jsxs(s,{direction:"column",gap:"4",children:[e.jsx(l,{children:"Neutral 1 container"}),e.jsxs(s,{gap:"4",children:[e.jsx(r,{...t}),e.jsx(r,{...t,isSelected:!0})]})]}),e.jsxs(c,{bg:"neutral",p:"4",mt:"4",children:[e.jsxs(s,{direction:"column",gap:"4",children:[e.jsx(l,{children:"Neutral 2 container"}),e.jsxs(s,{gap:"4",children:[e.jsx(r,{...t}),e.jsx(r,{...t,isSelected:!0})]})]}),e.jsx(c,{bg:"neutral",p:"4",mt:"4",children:e.jsxs(s,{direction:"column",gap:"4",children:[e.jsx(l,{children:"Neutral 3 container"}),e.jsxs(s,{gap:"4",children:[e.jsx(r,{...t}),e.jsx(r,{...t,isSelected:!0})]})]})})]})]})}),n=i.extend({args:{isDisabled:!0}});a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...n.parameters?.docs?.source}}};const k=["Default","Disabled","AutoBg","AutoBgDisabled"];export{i as AutoBg,n as AutoBgDisabled,a as Default,o as Disabled,k as __namedExportsOrder};
