import{bg as q,ca as v,cH as L,bR as e,c7 as w}from"./iframe-C134ftd_.js";import{a as V}from"./Checkbox-DapfitjG.js";import{F as T}from"./FieldLabel-X1Qa6MCe.js";import{F}from"./FieldError-B3m0AjM9.js";import{C as a}from"./Checkbox-CIpwep1S.js";import{T as P}from"./Text-CMUSX-Wb.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-ZhLQjZIu.js";import"./useObjectRef-CpAZkPjD.js";import"./FieldError-D65LPVQm.js";import"./Text-rWPrkzXG.js";import"./useFocusRing-CEbL5n3V.js";import"./openLink-CXjQqT5j.js";import"./useFormValidation-s9lT5xWl.js";import"./Label-NvoSwhWO.js";import"./Hidden-Bciv724x.js";import"./useField-By1WoCRi.js";import"./useLabel-BlNKan1O.js";import"./useLabels-DE_o1GVW.js";import"./useToggle-BIss6HDM.js";import"./useFormReset-CQi6w5nh.js";import"./usePress-DEZzIpor.js";import"./textSelection-DpSIhvEg.js";import"./useToggleState-BC60jf1g.js";import"./useControlledState-BrUi6TrE.js";import"./useHover-crLX5QKB.js";import"./VisuallyHidden-nqqisxk3.js";import"./index-CFfinTmq.js";const _={"bui-CheckboxGroup":"_bui-CheckboxGroup_j2fct_4","bui-CheckboxGroupContent":"_bui-CheckboxGroupContent_j2fct_9"},N=q()({styles:_,classNames:{root:"bui-CheckboxGroup",content:"bui-CheckboxGroupContent"},propDefs:{className:{},children:{},label:{},secondaryLabel:{},description:{},isRequired:{},orientation:{}}}),i=v.forwardRef((r,l)=>{const{ownProps:k,restProps:g}=L(N,r),{classes:f,label:C,secondaryLabel:S,description:D,isRequired:G,orientation:E,children:H}=k,j=g["aria-label"],y=g["aria-labelledby"];v.useEffect(()=>{!C&&!j&&!y&&console.warn("CheckboxGroup requires either a visible label, aria-label, or aria-labelledby for accessibility")},[C,j,y]);const R=S||(G?"Required":null);return e.jsxs(V,{ref:l,className:f.root,isRequired:G,"data-orientation":E,...g,children:[e.jsx(T,{label:C,secondaryLabel:R,description:D,descriptionSlot:"description"}),e.jsx("div",{className:f.content,children:H}),e.jsx(F,{})]})});i.displayName="CheckboxGroup";i.__docgenInfo={description:`A group of checkboxes for selecting multiple options from a list.
@public`,methods:[],displayName:"CheckboxGroup",props:{className:{required:!1,tsType:{name:"string"},description:""},children:{required:!1,tsType:{name:"ReactNode"},description:""},label:{required:!1,tsType:{name:"FieldLabelProps['label']",raw:"FieldLabelProps['label']"},description:""},secondaryLabel:{required:!1,tsType:{name:"FieldLabelProps['secondaryLabel']",raw:"FieldLabelProps['secondaryLabel']"},description:""},description:{required:!1,tsType:{name:"FieldLabelProps['description']",raw:"FieldLabelProps['description']"},description:""},isRequired:{required:!1,tsType:{name:"RACheckboxGroupProps['isRequired']",raw:"RACheckboxGroupProps['isRequired']"},description:""},orientation:{required:!1,tsType:{name:"union",raw:"'horizontal' | 'vertical'",elements:[{name:"literal",value:"'horizontal'"},{name:"literal",value:"'vertical'"}]},description:""}},composes:["Omit"]};const o=w.meta({title:"Backstage UI/CheckboxGroup",component:i}),s=o.story({args:{label:"Choose platforms for notifications",defaultValue:["github"]},render:r=>e.jsxs(i,{...r,children:[e.jsx(a,{value:"github",children:"GitHub"}),e.jsx(a,{value:"slack",children:"Slack"}),e.jsx(a,{value:"email",children:"Email"})]})}),t=o.story({args:{label:"Choose platforms for notifications"},render:r=>{const[l,k]=v.useState(["email"]);return e.jsxs(e.Fragment,{children:[e.jsxs(i,{...r,value:l,onChange:k,children:[e.jsx(a,{value:"github",children:"GitHub"}),e.jsx(a,{value:"slack",children:"Slack"}),e.jsx(a,{value:"email",children:"Email"})]}),e.jsxs(P,{children:["Selected: ",l.join(", ")||"none"]})]})}}),c=o.story({args:{...s.input.args,orientation:"horizontal"},render:r=>e.jsxs(i,{...r,children:[e.jsx(a,{value:"github",children:"GitHub"}),e.jsx(a,{value:"slack",children:"Slack"}),e.jsx(a,{value:"email",children:"Email"})]})}),n=o.story({args:{...s.input.args,isDisabled:!0},render:r=>e.jsxs(i,{...r,children:[e.jsx(a,{value:"github",children:"GitHub"}),e.jsx(a,{value:"slack",children:"Slack"}),e.jsx(a,{value:"email",children:"Email"})]})}),u=o.story({args:{...s.input.args},render:r=>e.jsxs(i,{...r,children:[e.jsx(a,{value:"github",children:"GitHub"}),e.jsx(a,{value:"slack",isDisabled:!0,children:"Slack"}),e.jsx(a,{value:"email",children:"Email"})]})}),p=o.story({args:{...s.input.args,defaultValue:["slack"]},render:r=>e.jsxs(i,{...r,children:[e.jsx(a,{value:"github",children:"GitHub"}),e.jsx(a,{value:"slack",isDisabled:!0,children:"Slack"}),e.jsx(a,{value:"email",children:"Email"})]})}),d=o.story({args:{...s.input.args,isInvalid:!0},render:r=>e.jsxs(i,{...r,children:[e.jsx(a,{value:"github",children:"GitHub"}),e.jsx(a,{value:"slack",children:"Slack"}),e.jsx(a,{value:"email",children:"Email"})]})}),b=o.story({args:{...s.input.args,isReadOnly:!0,defaultValue:["github"]},render:r=>e.jsxs(i,{...r,children:[e.jsx(a,{value:"github",children:"GitHub"}),e.jsx(a,{value:"slack",children:"Slack"}),e.jsx(a,{value:"email",children:"Email"})]})}),h=o.story({args:{...s.input.args,description:"Select all channels where you want to receive notifications."},render:r=>e.jsxs(i,{...r,children:[e.jsx(a,{value:"github",children:"GitHub"}),e.jsx(a,{value:"slack",children:"Slack"}),e.jsx(a,{value:"email",children:"Email"})]})}),m=o.story({args:{...s.input.args,isRequired:!0},render:r=>e.jsxs(i,{...r,children:[e.jsx(a,{value:"github",children:"GitHub"}),e.jsx(a,{value:"slack",children:"Slack"}),e.jsx(a,{value:"email",children:"Email"})]})}),x=o.story({args:{...s.input.args,defaultValue:["github","slack"],validationBehavior:"aria",validate:r=>r.includes("slack")?"Slack is not available in your region.":null},render:r=>e.jsxs(i,{...r,children:[e.jsx(a,{value:"github",children:"GitHub"}),e.jsx(a,{value:"slack",children:"Slack"}),e.jsx(a,{value:"email",children:"Email"})]})});s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Choose platforms for notifications',
    defaultValue: ['github']
  },
  render: args => <CheckboxGroup {...args}>
      <Checkbox value="github">GitHub</Checkbox>
      <Checkbox value="slack">Slack</Checkbox>
      <Checkbox value="email">Email</Checkbox>
    </CheckboxGroup>
})`,...s.input.parameters?.docs?.source}}};t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Choose platforms for notifications'
  },
  render: args => {
    const [values, setValues] = useState<string[]>(['email']);
    return <>
        <CheckboxGroup {...args} value={values} onChange={setValues}>
          <Checkbox value="github">GitHub</Checkbox>
          <Checkbox value="slack">Slack</Checkbox>
          <Checkbox value="email">Email</Checkbox>
        </CheckboxGroup>
        <Text>Selected: {values.join(', ') || 'none'}</Text>
      </>;
  }
})`,...t.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    orientation: 'horizontal'
  },
  render: args => <CheckboxGroup {...args}>
      <Checkbox value="github">GitHub</Checkbox>
      <Checkbox value="slack">Slack</Checkbox>
      <Checkbox value="email">Email</Checkbox>
    </CheckboxGroup>
})`,...c.input.parameters?.docs?.source}}};n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    isDisabled: true
  },
  render: args => <CheckboxGroup {...args}>
      <Checkbox value="github">GitHub</Checkbox>
      <Checkbox value="slack">Slack</Checkbox>
      <Checkbox value="email">Email</Checkbox>
    </CheckboxGroup>
})`,...n.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: args => <CheckboxGroup {...args}>
      <Checkbox value="github">GitHub</Checkbox>
      <Checkbox value="slack" isDisabled>
        Slack
      </Checkbox>
      <Checkbox value="email">Email</Checkbox>
    </CheckboxGroup>
})`,...u.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    defaultValue: ['slack']
  },
  render: args => <CheckboxGroup {...args}>
      <Checkbox value="github">GitHub</Checkbox>
      <Checkbox value="slack" isDisabled>
        Slack
      </Checkbox>
      <Checkbox value="email">Email</Checkbox>
    </CheckboxGroup>
})`,...p.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    isInvalid: true
  },
  render: args => <CheckboxGroup {...args}>
      <Checkbox value="github">GitHub</Checkbox>
      <Checkbox value="slack">Slack</Checkbox>
      <Checkbox value="email">Email</Checkbox>
    </CheckboxGroup>
})`,...d.input.parameters?.docs?.source}}};b.input.parameters={...b.input.parameters,docs:{...b.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    isReadOnly: true,
    defaultValue: ['github']
  },
  render: args => <CheckboxGroup {...args}>
      <Checkbox value="github">GitHub</Checkbox>
      <Checkbox value="slack">Slack</Checkbox>
      <Checkbox value="email">Email</Checkbox>
    </CheckboxGroup>
})`,...b.input.parameters?.docs?.source}}};h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    description: 'Select all channels where you want to receive notifications.'
  },
  render: args => <CheckboxGroup {...args}>
      <Checkbox value="github">GitHub</Checkbox>
      <Checkbox value="slack">Slack</Checkbox>
      <Checkbox value="email">Email</Checkbox>
    </CheckboxGroup>
})`,...h.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    isRequired: true
  },
  render: args => <CheckboxGroup {...args}>
      <Checkbox value="github">GitHub</Checkbox>
      <Checkbox value="slack">Slack</Checkbox>
      <Checkbox value="email">Email</Checkbox>
    </CheckboxGroup>
})`,...m.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    defaultValue: ['github', 'slack'],
    validationBehavior: 'aria',
    validate: (value: string[]) => value.includes('slack') ? 'Slack is not available in your region.' : null
  },
  render: args => <CheckboxGroup {...args}>
      <Checkbox value="github">GitHub</Checkbox>
      <Checkbox value="slack">Slack</Checkbox>
      <Checkbox value="email">Email</Checkbox>
    </CheckboxGroup>
})`,...x.input.parameters?.docs?.source}}};const be=["Default","Controlled","Horizontal","Disabled","DisabledSingle","DisabledAndSelected","Invalid","ReadOnly","WithDescription","Required","Validation"];export{t as Controlled,s as Default,n as Disabled,p as DisabledAndSelected,u as DisabledSingle,c as Horizontal,d as Invalid,b as ReadOnly,m as Required,x as Validation,h as WithDescription,be as __namedExportsOrder};
