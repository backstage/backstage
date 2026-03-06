import{p as m,j as a}from"./iframe-DsSIhbnH.js";import{R as u,a as r}from"./RadioGroup-BzjWym4Y.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CvT5fIF8.js";import"./useObjectRef-DQRQLV-W.js";import"./FieldError-DqRzGsdC.js";import"./Text-Csf9jB8i.js";import"./useFocusable-Cl25xWdw.js";import"./Form-qWZbw0Ut.js";import"./Label-BWF0Xy8M.js";import"./Hidden-BZ7ahUrB.js";import"./SelectionIndicator-LRxPmeFP.js";import"./useControlledState-nsfjOaxZ.js";import"./useFocusRing-DNG6HILo.js";import"./useField-Dp0SHocZ.js";import"./useLabel-D9UDERh8.js";import"./useLabels-CEMdZqD5.js";import"./context-BJB_GP0l.js";import"./useFormReset-BPQtdjzR.js";import"./usePress-DlWdiVIq.js";import"./VisuallyHidden-D-uHk63X.js";import"./FieldLabel-CW3r1inq.js";import"./FieldError-DWzWrgvs.js";const c=m.meta({title:"Backstage UI/RadioGroup",component:u}),i=c.story({args:{label:"What is your favorite pokemon?"},render:e=>a.jsxs(u,{...e,children:[a.jsx(r,{value:"bulbasaur",children:"Bulbasaur"}),a.jsx(r,{value:"charmander",children:"Charmander"}),a.jsx(r,{value:"squirtle",children:"Squirtle"})]})}),s=c.story({args:{...i.input.args,orientation:"horizontal"},render:e=>a.jsxs(u,{...e,children:[a.jsx(r,{value:"bulbasaur",children:"Bulbasaur"}),a.jsx(r,{value:"charmander",children:"Charmander"}),a.jsx(r,{value:"squirtle",children:"Squirtle"})]})}),o=c.story({args:{...i.input.args,isDisabled:!0},render:e=>a.jsxs(u,{...e,children:[a.jsx(r,{value:"bulbasaur",children:"Bulbasaur"}),a.jsx(r,{value:"charmander",children:"Charmander"}),a.jsx(r,{value:"squirtle",children:"Squirtle"})]})}),n=c.story({args:{...i.input.args},render:e=>a.jsxs(u,{...e,children:[a.jsx(r,{value:"bulbasaur",children:"Bulbasaur"}),a.jsx(r,{value:"charmander",isDisabled:!0,children:"Charmander"}),a.jsx(r,{value:"squirtle",children:"Squirtle"})]})}),d=c.story({args:{...i.input.args,value:"charmander"},render:e=>a.jsxs(u,{...e,children:[a.jsx(r,{value:"bulbasaur",children:"Bulbasaur"}),a.jsx(r,{value:"charmander",isDisabled:!0,children:"Charmander"}),a.jsx(r,{value:"squirtle",children:"Squirtle"})]})}),t=c.story({args:{...i.input.args,name:"pokemon",isInvalid:!0},render:e=>a.jsxs(u,{...e,children:[a.jsx(r,{value:"bulbasaur",children:"Bulbasaur"}),a.jsx(r,{value:"charmander",isDisabled:!0,children:"Charmander"}),a.jsx(r,{value:"squirtle",children:"Squirtle"})]})}),l=c.story({args:{...i.input.args,name:"pokemon",defaultValue:"charmander",validationBehavior:"aria",validate:e=>e==="charmander"?"Nice try!":null},render:e=>a.jsxs(u,{...e,children:[a.jsx(r,{value:"bulbasaur",children:"Bulbasaur"}),a.jsx(r,{value:"charmander",children:"Charmander"}),a.jsx(r,{value:"squirtle",children:"Squirtle"})]})}),p=c.story({args:{...i.input.args,isReadOnly:!0,defaultValue:"charmander"},render:e=>a.jsxs(u,{...e,children:[a.jsx(r,{value:"bulbasaur",children:"Bulbasaur"}),a.jsx(r,{value:"charmander",children:"Charmander"}),a.jsx(r,{value:"squirtle",children:"Squirtle"})]})});i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{code:`const Default = () => (
  <RadioGroup label="What is your favorite pokemon?">
    <Radio value="bulbasaur">Bulbasaur</Radio>
    <Radio value="charmander">Charmander</Radio>
    <Radio value="squirtle">Squirtle</Radio>
  </RadioGroup>
);
`,...i.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{code:`const Horizontal = () => (
  <RadioGroup orientation="horizontal">
    <Radio value="bulbasaur">Bulbasaur</Radio>
    <Radio value="charmander">Charmander</Radio>
    <Radio value="squirtle">Squirtle</Radio>
  </RadioGroup>
);
`,...s.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{code:`const Disabled = () => (
  <RadioGroup isDisabled>
    <Radio value="bulbasaur">Bulbasaur</Radio>
    <Radio value="charmander">Charmander</Radio>
    <Radio value="squirtle">Squirtle</Radio>
  </RadioGroup>
);
`,...o.input.parameters?.docs?.source}}};n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{code:`const DisabledSingle = () => (
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
})`,...i.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    orientation: 'horizontal'
  },
  render: args => <RadioGroup {...args}>
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander">Charmander</Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
})`,...s.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    isDisabled: true
  },
  render: args => <RadioGroup {...args}>
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander">Charmander</Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
})`,...o.input.parameters?.docs?.source}}};n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...p.input.parameters?.docs?.source}}};const W=["Default","Horizontal","Disabled","DisabledSingle","DisabledAndSelected","Invalid","Validation","ReadOnly"];export{i as Default,o as Disabled,d as DisabledAndSelected,n as DisabledSingle,s as Horizontal,t as Invalid,p as ReadOnly,l as Validation,W as __namedExportsOrder};
