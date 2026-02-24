import{p as m,j as a}from"./iframe-n0fImp44.js";import{R as u,a as r}from"./RadioGroup-B9aaMQPv.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-Bq1vmvg7.js";import"./useObjectRef-B5k3BPhA.js";import"./clsx-B-dksMZM.js";import"./FieldError-DYHLViEp.js";import"./Text-DIojBtpQ.js";import"./useFocusable-B7b3qeb5.js";import"./Form-BGnJqD7B.js";import"./Label-gCeyRKEY.js";import"./Hidden-CH-pWt5S.js";import"./SelectionIndicator-B5OavJut.js";import"./useControlledState-BucjZUQj.js";import"./useFocusRing-COQbbX-o.js";import"./useField-CEdnleri.js";import"./useLabel-BvFyeQ9k.js";import"./useLabels-BBhJvysw.js";import"./context-BjCyfsTr.js";import"./useFormReset-Dx3UpLX9.js";import"./usePress-CRHkgW3I.js";import"./VisuallyHidden-BVkTRPDk.js";import"./useStyles-DhAOMvc1.js";import"./FieldLabel-CPL6GDCB.js";import"./FieldError-By4V08T8.js";const c=m.meta({title:"Backstage UI/RadioGroup",component:u}),i=c.story({args:{label:"What is your favorite pokemon?"},render:e=>a.jsxs(u,{...e,children:[a.jsx(r,{value:"bulbasaur",children:"Bulbasaur"}),a.jsx(r,{value:"charmander",children:"Charmander"}),a.jsx(r,{value:"squirtle",children:"Squirtle"})]})}),o=c.story({args:{...i.input.args,orientation:"horizontal"},render:e=>a.jsxs(u,{...e,children:[a.jsx(r,{value:"bulbasaur",children:"Bulbasaur"}),a.jsx(r,{value:"charmander",children:"Charmander"}),a.jsx(r,{value:"squirtle",children:"Squirtle"})]})}),s=c.story({args:{...i.input.args,isDisabled:!0},render:e=>a.jsxs(u,{...e,children:[a.jsx(r,{value:"bulbasaur",children:"Bulbasaur"}),a.jsx(r,{value:"charmander",children:"Charmander"}),a.jsx(r,{value:"squirtle",children:"Squirtle"})]})}),n=c.story({args:{...i.input.args},render:e=>a.jsxs(u,{...e,children:[a.jsx(r,{value:"bulbasaur",children:"Bulbasaur"}),a.jsx(r,{value:"charmander",isDisabled:!0,children:"Charmander"}),a.jsx(r,{value:"squirtle",children:"Squirtle"})]})}),d=c.story({args:{...i.input.args,value:"charmander"},render:e=>a.jsxs(u,{...e,children:[a.jsx(r,{value:"bulbasaur",children:"Bulbasaur"}),a.jsx(r,{value:"charmander",isDisabled:!0,children:"Charmander"}),a.jsx(r,{value:"squirtle",children:"Squirtle"})]})}),t=c.story({args:{...i.input.args,name:"pokemon",isInvalid:!0},render:e=>a.jsxs(u,{...e,children:[a.jsx(r,{value:"bulbasaur",children:"Bulbasaur"}),a.jsx(r,{value:"charmander",isDisabled:!0,children:"Charmander"}),a.jsx(r,{value:"squirtle",children:"Squirtle"})]})}),l=c.story({args:{...i.input.args,name:"pokemon",defaultValue:"charmander",validationBehavior:"aria",validate:e=>e==="charmander"?"Nice try!":null},render:e=>a.jsxs(u,{...e,children:[a.jsx(r,{value:"bulbasaur",children:"Bulbasaur"}),a.jsx(r,{value:"charmander",children:"Charmander"}),a.jsx(r,{value:"squirtle",children:"Squirtle"})]})}),p=c.story({args:{...i.input.args,isReadOnly:!0,defaultValue:"charmander"},render:e=>a.jsxs(u,{...e,children:[a.jsx(r,{value:"bulbasaur",children:"Bulbasaur"}),a.jsx(r,{value:"charmander",children:"Charmander"}),a.jsx(r,{value:"squirtle",children:"Squirtle"})]})});i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{code:`const Default = () => (
  <RadioGroup label="What is your favorite pokemon?">
    <Radio value="bulbasaur">Bulbasaur</Radio>
    <Radio value="charmander">Charmander</Radio>
    <Radio value="squirtle">Squirtle</Radio>
  </RadioGroup>
);
`,...i.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{code:`const Horizontal = () => (
  <RadioGroup orientation="horizontal">
    <Radio value="bulbasaur">Bulbasaur</Radio>
    <Radio value="charmander">Charmander</Radio>
    <Radio value="squirtle">Squirtle</Radio>
  </RadioGroup>
);
`,...o.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{code:`const Disabled = () => (
  <RadioGroup isDisabled>
    <Radio value="bulbasaur">Bulbasaur</Radio>
    <Radio value="charmander">Charmander</Radio>
    <Radio value="squirtle">Squirtle</Radio>
  </RadioGroup>
);
`,...s.input.parameters?.docs?.source}}};n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{code:`const DisabledSingle = () => (
  <RadioGroup>
    <Radio value="bulbasaur">Bulbasaur</Radio>
    <Radio value="charmander" isDisabled>
      Charmander
    </Radio>
    <Radio value="squirtle">Squirtle</Radio>
  </RadioGroup>
);
`,...n.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{code:`const DisabledAndSelected = () => (
  <RadioGroup value="charmander">
    <Radio value="bulbasaur">Bulbasaur</Radio>
    <Radio value="charmander" isDisabled>
      Charmander
    </Radio>
    <Radio value="squirtle">Squirtle</Radio>
  </RadioGroup>
);
`,...d.input.parameters?.docs?.source}}};t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{code:`const Invalid = () => (
  <RadioGroup name="pokemon" isInvalid>
    <Radio value="bulbasaur">Bulbasaur</Radio>
    <Radio value="charmander" isDisabled>
      Charmander
    </Radio>
    <Radio value="squirtle">Squirtle</Radio>
  </RadioGroup>
);
`,...t.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{code:`const Validation = () => (
  <RadioGroup
    name="pokemon"
    defaultValue="charmander"
    validationBehavior="aria"
    validate={(value) => (value === "charmander" ? "Nice try!" : null)}
  >
    <Radio value="bulbasaur">Bulbasaur</Radio>
    <Radio value="charmander">Charmander</Radio>
    <Radio value="squirtle">Squirtle</Radio>
  </RadioGroup>
);
`,...l.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{code:`const ReadOnly = () => (
  <RadioGroup isReadOnly defaultValue="charmander">
    <Radio value="bulbasaur">Bulbasaur</Radio>
    <Radio value="charmander">Charmander</Radio>
    <Radio value="squirtle">Squirtle</Radio>
  </RadioGroup>
);
`,...p.input.parameters?.docs?.source}}};i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'What is your favorite pokemon?'
  },
  render: args => <RadioGroup {...args}>
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander">Charmander</Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
})`,...i.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    orientation: 'horizontal'
  },
  render: args => <RadioGroup {...args}>
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander">Charmander</Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
})`,...o.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    isDisabled: true
  },
  render: args => <RadioGroup {...args}>
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander">Charmander</Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
})`,...s.input.parameters?.docs?.source}}};n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: args => <RadioGroup {...args}>
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander" isDisabled>
        Charmander
      </Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
})`,...n.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    value: 'charmander'
  },
  render: args => <RadioGroup {...args}>
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander" isDisabled>
        Charmander
      </Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
})`,...d.input.parameters?.docs?.source}}};t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
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
})`,...t.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
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
})`,...l.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    isReadOnly: true,
    defaultValue: 'charmander'
  },
  render: args => <RadioGroup {...args}>
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander">Charmander</Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
})`,...p.input.parameters?.docs?.source}}};const _=["Default","Horizontal","Disabled","DisabledSingle","DisabledAndSelected","Invalid","Validation","ReadOnly"];export{i as Default,s as Disabled,d as DisabledAndSelected,n as DisabledSingle,o as Horizontal,t as Invalid,p as ReadOnly,l as Validation,_ as __namedExportsOrder};
