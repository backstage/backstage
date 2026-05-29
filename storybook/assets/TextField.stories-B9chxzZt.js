import{bR as e,i as n,c7 as j}from"./iframe-t54gLFa0.js";import{T as a}from"./TextField-DsOeZjB-.js";import{a as T}from"./useFormValidation-t-xGAaZ7.js";import{O as f,k as W}from"./index-BaJeNOvl.js";import{F as o}from"./Flex-B3YZfj4o.js";import{T as F}from"./Text-DUZhQt0L.js";import{F as D}from"./FieldLabel-CiSTb_vd.js";import"./preload-helper-PPVm8Dsz.js";import"./Input-JiKeBEm0.js";import"./utils-W_OcwHCh.js";import"./useObjectRef-C3DVLawX.js";import"./useHover-DSCE7LE-.js";import"./useFocusRing-V0WlKBhU.js";import"./openLink-BrZmZSwy.js";import"./Hidden-Bp4y3_la.js";import"./TextField-MithS7pD.js";import"./FieldError-N1cuoUOh.js";import"./Text-43fvPt9T.js";import"./Autocomplete-P1PFt3qE.js";import"./keyboard-RHFCgLFL.js";import"./useEvent-B2ORR698.js";import"./useLabels-Cl1AF1fl.js";import"./useLocalizedStringFormatter-DQu-DAui.js";import"./I18nProvider-D1Ub29LP.js";import"./useControlledState-3Cl2ojEk.js";import"./Label-BScIi9Kg.js";import"./useTextField-BWoBi-F7.js";import"./useField-BxTVInbI.js";import"./useLabel-B4TkV3uy.js";import"./useFormReset-CukaQ-Is.js";import"./FieldError-BpFGbwfs.js";const t=j.meta({title:"Backstage UI/TextField",component:a,argTypes:{isRequired:{control:"boolean"},icon:{control:"object"}}}),r=t.story({args:{name:"url",placeholder:"Enter a URL",style:{maxWidth:"300px"}}}),p=t.story({args:{...r.input.args},render:s=>e.jsxs(o,{direction:"row",gap:"4",style:{width:"100%",maxWidth:"600px"},children:[e.jsx(a,{...s,size:"small",icon:e.jsx(f,{})}),e.jsx(a,{...s,size:"medium",icon:e.jsx(f,{})})]})}),u=t.story({args:{...r.input.args,defaultValue:"https://example.com"}}),i=t.story({args:{...r.input.args,label:"Label"}}),c=t.story({args:{...i.input.args,description:"Description"}}),d=t.story({args:{...i.input.args,isRequired:!0}}),m=t.story({args:{...r.input.args,isDisabled:!0}}),l=t.story({args:{...r.input.args},render:s=>e.jsx(a,{...s,placeholder:"Enter a URL",size:"small",icon:e.jsx(W,{})})}),x=l.extend({args:{isDisabled:!0}}),g=t.story({args:{...i.input.args},render:s=>e.jsx(T,{validationErrors:{url:"Invalid URL"},children:e.jsx(a,{...s})})}),h=t.story({args:{...i.input.args,validate:s=>s==="admin"?"Nice try!":null}}),b=t.story({render:()=>e.jsxs(e.Fragment,{children:[e.jsx(D,{htmlFor:"custom-field",id:"custom-field-label",label:"Custom Field"}),e.jsx(a,{id:"custom-field","aria-labelledby":"custom-field-label",name:"custom-field",defaultValue:"Custom Field"})]})}),y=t.story({render:()=>e.jsxs(o,{direction:"column",gap:"4",children:[e.jsx("div",{style:{maxWidth:"600px"},children:"TextField automatically detects its parent bg context and increments the neutral level by 1. No prop is needed — it's fully automatic."}),e.jsxs(n,{bg:"neutral",p:"4",children:[e.jsx(F,{children:"Neutral 1 container"}),e.jsx(o,{mt:"2",style:{maxWidth:"300px"},children:e.jsx(a,{"aria-label":"Text",placeholder:"Enter text",size:"small"})})]}),e.jsx(n,{bg:"neutral",children:e.jsxs(n,{bg:"neutral",p:"4",children:[e.jsx(F,{children:"Neutral 2 container"}),e.jsx(o,{mt:"2",style:{maxWidth:"300px"},children:e.jsx(a,{"aria-label":"Text",placeholder:"Enter text",size:"small"})})]})}),e.jsx(n,{bg:"neutral",children:e.jsx(n,{bg:"neutral",children:e.jsxs(n,{bg:"neutral",p:"4",children:[e.jsx(F,{children:"Neutral 3 container"}),e.jsx(o,{mt:"2",style:{maxWidth:"300px"},children:e.jsx(a,{"aria-label":"Text",placeholder:"Enter text",size:"small"})})]})})})]})});r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    name: 'url',
    placeholder: 'Enter a URL',
    style: {
      maxWidth: '300px'
    }
  }
})`,...r.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: args => <Flex direction="row" gap="4" style={{
    width: '100%',
    maxWidth: '600px'
  }}>
      <TextField {...args} size="small" icon={<RiSparklingLine />} />
      <TextField {...args} size="medium" icon={<RiSparklingLine />} />
    </Flex>
})`,...p.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    defaultValue: 'https://example.com'
  }
})`,...u.input.parameters?.docs?.source}}};i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    label: 'Label'
  }
})`,...i.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    description: 'Description'
  }
})`,...c.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    isRequired: true
  }
})`,...d.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    isDisabled: true
  }
})`,...m.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: args => <TextField {...args} placeholder="Enter a URL" size="small" icon={<RiEyeLine />} />
})`,...l.input.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`WithIcon.extend({
  args: {
    isDisabled: true
  }
})`,...x.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args
  },
  render: args => <Form validationErrors={{
    url: 'Invalid URL'
  }}>
      <TextField {...args} />
    </Form>
})`,...g.input.parameters?.docs?.source}}};h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    validate: value => value === 'admin' ? 'Nice try!' : null
  }
})`,...h.input.parameters?.docs?.source}}};b.input.parameters={...b.input.parameters,docs:{...b.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <>
      <FieldLabel htmlFor="custom-field" id="custom-field-label" label="Custom Field" />
      <TextField id="custom-field" aria-labelledby="custom-field-label" name="custom-field" defaultValue="Custom Field" />
    </>
})`,...b.input.parameters?.docs?.source}}};y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex direction="column" gap="4">
      <div style={{
      maxWidth: '600px'
    }}>
        TextField automatically detects its parent bg context and increments the
        neutral level by 1. No prop is needed — it's fully automatic.
      </div>
      <Box bg="neutral" p="4">
        <Text>Neutral 1 container</Text>
        <Flex mt="2" style={{
        maxWidth: '300px'
      }}>
          <TextField aria-label="Text" placeholder="Enter text" size="small" />
        </Flex>
      </Box>
      <Box bg="neutral">
        <Box bg="neutral" p="4">
          <Text>Neutral 2 container</Text>
          <Flex mt="2" style={{
          maxWidth: '300px'
        }}>
            <TextField aria-label="Text" placeholder="Enter text" size="small" />
          </Flex>
        </Box>
      </Box>
      <Box bg="neutral">
        <Box bg="neutral">
          <Box bg="neutral" p="4">
            <Text>Neutral 3 container</Text>
            <Flex mt="2" style={{
            maxWidth: '300px'
          }}>
              <TextField aria-label="Text" placeholder="Enter text" size="small" />
            </Flex>
          </Box>
        </Box>
      </Box>
    </Flex>
})`,...y.input.parameters?.docs?.source}}};const re=["Default","Sizes","DefaultValue","WithLabel","WithDescription","Required","Disabled","WithIcon","DisabledWithIcon","ShowError","Validation","CustomField","AutoBg"];export{y as AutoBg,b as CustomField,r as Default,u as DefaultValue,m as Disabled,x as DisabledWithIcon,d as Required,g as ShowError,p as Sizes,h as Validation,c as WithDescription,l as WithIcon,i as WithLabel,re as __namedExportsOrder};
