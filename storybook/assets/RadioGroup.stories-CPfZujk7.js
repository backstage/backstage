import{j as a}from"./iframe-DpqnIERb.js";import{R as i,a as r}from"./RadioGroup-DpjqBVlm.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-B2P2SXf5.js";import"./useObjectRef-DeoBV0YX.js";import"./clsx-B-dksMZM.js";import"./FieldError-Cf0TiAR9.js";import"./Text-CdDC4FMf.js";import"./useLabel-hgpj-65L.js";import"./useLabels-D-JxYPd2.js";import"./useFocusable-D_Izi1La.js";import"./Form-DK8VOFuS.js";import"./Label-DV8PoFCz.js";import"./Hidden-B02KVb8D.js";import"./SelectionIndicator-BcQp1Z9Z.js";import"./useControlledState-Cq_rx2hv.js";import"./useFocusRing-8s93X7c_.js";import"./context-DhayTp-r.js";import"./useFormReset-CezelKG7.js";import"./usePress-BFqvv2RH.js";import"./VisuallyHidden-CkinOV79.js";import"./useStyles-DeGVM3t2.js";import"./FieldLabel-Ei5YD0dC.js";import"./FieldError-CAumUrP3.js";const H={title:"Backstage UI/RadioGroup",component:i},s={args:{label:"What is your favorite pokemon?"},render:e=>a.jsxs(i,{...e,children:[a.jsx(r,{value:"bulbasaur",children:"Bulbasaur"}),a.jsx(r,{value:"charmander",children:"Charmander"}),a.jsx(r,{value:"squirtle",children:"Squirtle"})]})},u={args:{...s.args,orientation:"horizontal"},render:e=>a.jsxs(i,{...e,children:[a.jsx(r,{value:"bulbasaur",children:"Bulbasaur"}),a.jsx(r,{value:"charmander",children:"Charmander"}),a.jsx(r,{value:"squirtle",children:"Squirtle"})]})},l={args:{...s.args,isDisabled:!0},render:e=>a.jsxs(i,{...e,children:[a.jsx(r,{value:"bulbasaur",children:"Bulbasaur"}),a.jsx(r,{value:"charmander",children:"Charmander"}),a.jsx(r,{value:"squirtle",children:"Squirtle"})]})},d={args:{...s.args},render:e=>a.jsxs(i,{...e,children:[a.jsx(r,{value:"bulbasaur",children:"Bulbasaur"}),a.jsx(r,{value:"charmander",isDisabled:!0,children:"Charmander"}),a.jsx(r,{value:"squirtle",children:"Squirtle"})]})},o={args:{...s.args,value:"charmander"},render:e=>a.jsxs(i,{...e,children:[a.jsx(r,{value:"bulbasaur",children:"Bulbasaur"}),a.jsx(r,{value:"charmander",isDisabled:!0,children:"Charmander"}),a.jsx(r,{value:"squirtle",children:"Squirtle"})]})},n={args:{...s.args,name:"pokemon",isInvalid:!0},render:e=>a.jsxs(i,{...e,children:[a.jsx(r,{value:"bulbasaur",children:"Bulbasaur"}),a.jsx(r,{value:"charmander",isDisabled:!0,children:"Charmander"}),a.jsx(r,{value:"squirtle",children:"Squirtle"})]})},t={args:{...s.args,name:"pokemon",defaultValue:"charmander",validationBehavior:"aria",validate:e=>e==="charmander"?"Nice try!":null},render:e=>a.jsxs(i,{...e,children:[a.jsx(r,{value:"bulbasaur",children:"Bulbasaur"}),a.jsx(r,{value:"charmander",children:"Charmander"}),a.jsx(r,{value:"squirtle",children:"Squirtle"})]})},c={args:{...s.args,isReadOnly:!0,defaultValue:"charmander"},render:e=>a.jsxs(i,{...e,children:[a.jsx(r,{value:"bulbasaur",children:"Bulbasaur"}),a.jsx(r,{value:"charmander",children:"Charmander"}),a.jsx(r,{value:"squirtle",children:"Squirtle"})]})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'What is your favorite pokemon?'
  },
  render: args => <RadioGroup {...args}>
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander">Charmander</Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
}`,...s.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    orientation: 'horizontal'
  },
  render: args => <RadioGroup {...args}>
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander">Charmander</Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
}`,...u.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    isDisabled: true
  },
  render: args => <RadioGroup {...args}>
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander">Charmander</Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
}`,...l.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
  },
  render: args => <RadioGroup {...args}>
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander" isDisabled>
        Charmander
      </Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
}`,...d.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    value: 'charmander'
  },
  render: args => <RadioGroup {...args}>
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander" isDisabled>
        Charmander
      </Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
}`,...o.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    name: 'pokemon',
    isInvalid: true
  },
  render: args => <RadioGroup {...args}>
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander" isDisabled>
        Charmander
      </Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
}`,...n.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    name: 'pokemon',
    defaultValue: 'charmander',
    validationBehavior: 'aria',
    validate: value => value === 'charmander' ? 'Nice try!' : null
  },
  render: args => <RadioGroup {...args}>
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander">Charmander</Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
}`,...t.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    isReadOnly: true,
    defaultValue: 'charmander'
  },
  render: args => <RadioGroup {...args}>
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander">Charmander</Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
}`,...c.parameters?.docs?.source}}};const N=["Default","Horizontal","Disabled","DisabledSingle","DisabledAndSelected","Invalid","Validation","ReadOnly"];export{s as Default,l as Disabled,o as DisabledAndSelected,d as DisabledSingle,u as Horizontal,n as Invalid,c as ReadOnly,t as Validation,N as __namedExportsOrder,H as default};
