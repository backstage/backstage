import{j as e,B as c,p as u}from"./iframe-CSz7VfT3.js";import{S as r}from"./Switch-DkftLkF0.js";import{F as s}from"./Flex-BGh7AQqa.js";import{T as l}from"./Text-Cq25VfyC.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-DO510V5r.js";import"./useObjectRef-D_q6rl-C.js";import"./useToggle-BUr7BTUz.js";import"./useFocusRing-Fbq9rG4I.js";import"./openLink-BZZjesw9.js";import"./useFormReset-9iV2nQ5O.js";import"./useFormValidation-BaS-Dz0q.js";import"./usePress-BkOB3jXf.js";import"./textSelection-xDV9V9Np.js";import"./getMetaValue-C_A1bvat.js";import"./useSlot-ChD6VVZR.js";import"./useToggleState-COu_fHYS.js";import"./useControlledState-D9BG_cB_.js";import"./useHover-C4tPk2eu.js";import"./VisuallyHidden-BSkWTXCt.js";const p=u.meta({title:"Backstage UI/Switch",component:r}),a=p.story({args:{label:"Switch"}}),o=p.story({args:{...a.input.args,isDisabled:!0}}),i=p.story({args:{label:"Label"},render:t=>e.jsxs(c,{bg:"neutral",p:"4",children:[e.jsxs(s,{direction:"column",gap:"4",children:[e.jsx(l,{children:"Neutral 1 container"}),e.jsxs(s,{gap:"4",children:[e.jsx(r,{...t}),e.jsx(r,{...t,isSelected:!0})]})]}),e.jsxs(c,{bg:"neutral",p:"4",mt:"4",children:[e.jsxs(s,{direction:"column",gap:"4",children:[e.jsx(l,{children:"Neutral 2 container"}),e.jsxs(s,{gap:"4",children:[e.jsx(r,{...t}),e.jsx(r,{...t,isSelected:!0})]})]}),e.jsx(c,{bg:"neutral",p:"4",mt:"4",children:e.jsxs(s,{direction:"column",gap:"4",children:[e.jsx(l,{children:"Neutral 3 container"}),e.jsxs(s,{gap:"4",children:[e.jsx(r,{...t}),e.jsx(r,{...t,isSelected:!0})]})]})})]})]})}),n=i.extend({args:{isDisabled:!0}});a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
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
