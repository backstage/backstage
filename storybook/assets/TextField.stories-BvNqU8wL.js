import{j as e,B as n,p as j}from"./iframe-DWvOg1Nr.js";import{T as a}from"./TextField-dXka7PnJ.js";import{$ as T}from"./useFormValidation-dqv5PRTh.js";import{O as f,e as W}from"./index-S3ZOnYmL.js";import{F as o}from"./Flex-Xh3GCAdr.js";import{T as F}from"./Text-D5esK7bM.js";import{F as D}from"./FieldLabel-XmD2Nl-X.js";import"./preload-helper-PPVm8Dsz.js";import"./Input-D_1Oh_cE.js";import"./utils-DtKPZPYA.js";import"./useObjectRef-DrTl60C1.js";import"./useHover-BBZSc4a-.js";import"./useFocusRing-YnyZfhhs.js";import"./openLink-l0pO1O-P.js";import"./Hidden-cMg_glYf.js";import"./TextField-DMMVZ7v_.js";import"./FieldError-Cn4RMDH6.js";import"./Text-D7tUisNB.js";import"./Autocomplete--OHIbt3H.js";import"./keyboard-DsYEEPu8.js";import"./useEvent-br1AIljo.js";import"./useLabels-C3rwEQd8.js";import"./useLocalizedStringFormatter-8YxUyZJo.js";import"./I18nProvider-CKpv70eZ.js";import"./useControlledState-C9nFpXLR.js";import"./Label-CaafuvKx.js";import"./useTextField-DD6tM4yt.js";import"./useField-Cz8KgY5A.js";import"./useLabel-Bai5AK5S.js";import"./useFormReset-CxVBRLBa.js";import"./FieldError-CgRJrcBj.js";const t=j.meta({title:"Backstage UI/TextField",component:a,argTypes:{isRequired:{control:"boolean"},icon:{control:"object"}}}),r=t.story({args:{name:"url",placeholder:"Enter a URL",style:{maxWidth:"300px"}}}),p=t.story({args:{...r.input.args},render:s=>e.jsxs(o,{direction:"row",gap:"4",style:{width:"100%",maxWidth:"600px"},children:[e.jsx(a,{...s,size:"small",icon:e.jsx(f,{})}),e.jsx(a,{...s,size:"medium",icon:e.jsx(f,{})})]})}),u=t.story({args:{...r.input.args,defaultValue:"https://example.com"}}),i=t.story({args:{...r.input.args,label:"Label"}}),c=t.story({args:{...i.input.args,description:"Description"}}),d=t.story({args:{...i.input.args,isRequired:!0}}),m=t.story({args:{...r.input.args,isDisabled:!0}}),l=t.story({args:{...r.input.args},render:s=>e.jsx(a,{...s,placeholder:"Enter a URL",size:"small",icon:e.jsx(W,{})})}),x=l.extend({args:{isDisabled:!0}}),g=t.story({args:{...i.input.args},render:s=>e.jsx(T,{validationErrors:{url:"Invalid URL"},children:e.jsx(a,{...s})})}),h=t.story({args:{...i.input.args,validate:s=>s==="admin"?"Nice try!":null}}),b=t.story({render:()=>e.jsxs(e.Fragment,{children:[e.jsx(D,{htmlFor:"custom-field",id:"custom-field-label",label:"Custom Field"}),e.jsx(a,{id:"custom-field","aria-labelledby":"custom-field-label",name:"custom-field",defaultValue:"Custom Field"})]})}),y=t.story({render:()=>e.jsxs(o,{direction:"column",gap:"4",children:[e.jsx("div",{style:{maxWidth:"600px"},children:"TextField automatically detects its parent bg context and increments the neutral level by 1. No prop is needed — it's fully automatic."}),e.jsxs(n,{bg:"neutral",p:"4",children:[e.jsx(F,{children:"Neutral 1 container"}),e.jsx(o,{mt:"2",style:{maxWidth:"300px"},children:e.jsx(a,{"aria-label":"Text",placeholder:"Enter text",size:"small"})})]}),e.jsx(n,{bg:"neutral",children:e.jsxs(n,{bg:"neutral",p:"4",children:[e.jsx(F,{children:"Neutral 2 container"}),e.jsx(o,{mt:"2",style:{maxWidth:"300px"},children:e.jsx(a,{"aria-label":"Text",placeholder:"Enter text",size:"small"})})]})}),e.jsx(n,{bg:"neutral",children:e.jsx(n,{bg:"neutral",children:e.jsxs(n,{bg:"neutral",p:"4",children:[e.jsx(F,{children:"Neutral 3 container"}),e.jsx(o,{mt:"2",style:{maxWidth:"300px"},children:e.jsx(a,{"aria-label":"Text",placeholder:"Enter text",size:"small"})})]})})})]})});r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{originalSource:`meta.story({
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
