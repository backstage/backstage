import{p as f,j as e,B as b}from"./iframe-CMBqt-A6.js";import{T as i}from"./TextField-DhNpfgc1.js";import{$ as W}from"./Form-taROB1iO.js";import{O as T,d as j}from"./index-CeouwpqU.js";import{F}from"./Flex-BCi6YlJM.js";import{F as B}from"./FieldLabel-B6qM2eQZ.js";import{T as y}from"./Text-BgeSLHUM.js";import"./preload-helper-PPVm8Dsz.js";import"./Input-BlSVicBV.js";import"./useObjectRef-CGSD8NQp.js";import"./useFocusable-CV7yW7DE.js";import"./useFormReset-Cl19A9mk.js";import"./useControlledState-Bi1RpUJn.js";import"./useField-BYQS2JaF.js";import"./useLabel-C3Rt0zjS.js";import"./useLabels-D3b8Bz8f.js";import"./utils-BsuA5P8E.js";import"./Hidden-Cum0__DP.js";import"./useFocusRing-Dg5qN7f3.js";import"./TextField-e1FI-X6F.js";import"./FieldError-2C2b1JKv.js";import"./Text-Df1pNLi3.js";import"./RSPContexts-C7S471nv.js";import"./Label-Dl30HET7.js";import"./FieldError-Ba9aJeWn.js";const a=f.meta({title:"Backstage UI/TextField",component:i,argTypes:{isRequired:{control:"boolean"},icon:{control:"object"}}}),t=a.story({args:{name:"url",placeholder:"Enter a URL",style:{maxWidth:"300px"}}}),o=a.story({args:{...t.input.args},render:n=>e.jsxs(F,{direction:"row",gap:"4",style:{width:"100%",maxWidth:"600px"},children:[e.jsx(i,{...n,size:"small",icon:e.jsx(T,{})}),e.jsx(i,{...n,size:"medium",icon:e.jsx(T,{})})]})}),l=a.story({args:{...t.input.args,defaultValue:"https://example.com"}}),r=a.story({args:{...t.input.args,label:"Label"}}),p=a.story({args:{...r.input.args,description:"Description"}}),u=a.story({args:{...r.input.args,isRequired:!0}}),c=a.story({args:{...t.input.args,isDisabled:!0}}),s=a.story({args:{...t.input.args},render:n=>e.jsx(i,{...n,placeholder:"Enter a URL",size:"small",icon:e.jsx(j,{})})}),d=s.extend({args:{isDisabled:!0}}),m=a.story({args:{...r.input.args},render:n=>e.jsx(W,{validationErrors:{url:"Invalid URL"},children:e.jsx(i,{...n})})}),x=a.story({args:{...r.input.args,validate:n=>n==="admin"?"Nice try!":null}}),g=a.story({render:()=>e.jsxs(e.Fragment,{children:[e.jsx(B,{htmlFor:"custom-field",id:"custom-field-label",label:"Custom Field"}),e.jsx(i,{id:"custom-field","aria-labelledby":"custom-field-label",name:"custom-field",defaultValue:"Custom Field"})]})}),h=a.story({render:()=>e.jsxs(F,{direction:"column",gap:"4",children:[e.jsx("div",{style:{maxWidth:"600px"},children:"TextField automatically detects its parent bg context and increments the neutral level by 1. No prop is needed — it's fully automatic."}),e.jsxs(b,{bg:"neutral",p:"4",children:[e.jsx(y,{children:"Neutral 1 container"}),e.jsx(F,{mt:"2",style:{maxWidth:"300px"},children:e.jsx(i,{"aria-label":"Text",placeholder:"Enter text",size:"small"})})]}),e.jsx(b,{bg:"neutral",children:e.jsxs(b,{bg:"neutral",p:"4",children:[e.jsx(y,{children:"Neutral 2 container"}),e.jsx(F,{mt:"2",style:{maxWidth:"300px"},children:e.jsx(i,{"aria-label":"Text",placeholder:"Enter text",size:"small"})})]})}),e.jsx(b,{bg:"neutral",children:e.jsx(b,{bg:"neutral",children:e.jsxs(b,{bg:"neutral",p:"4",children:[e.jsx(y,{children:"Neutral 3 container"}),e.jsx(F,{mt:"2",style:{maxWidth:"300px"},children:e.jsx(i,{"aria-label":"Text",placeholder:"Enter text",size:"small"})})]})})})]})});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{code:`const Default = () => (
  <TextField
    name="url"
    placeholder="Enter a URL"
    style={{
      maxWidth: "300px",
    }}
  />
);
`,...t.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{code:`const Sizes = () => (
  <Flex direction="row" gap="4" style={{ width: "100%", maxWidth: "600px" }}>
    <TextField size="small" icon={<RiSparklingLine />} />
    <TextField size="medium" icon={<RiSparklingLine />} />
  </Flex>
);
`,...o.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{code:`const DefaultValue = () => <TextField defaultValue="https://example.com" />;
`,...l.input.parameters?.docs?.source}}};r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{code:`const WithLabel = () => <TextField label="Label" />;
`,...r.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{code:`const WithDescription = () => <TextField description="Description" />;
`,...p.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{code:`const Required = () => <TextField isRequired />;
`,...u.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{code:`const Disabled = () => <TextField isDisabled />;
`,...c.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{code:`const WithIcon = () => (
  <TextField placeholder="Enter a URL" size="small" icon={<RiEyeLine />} />
);
`,...s.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{code:`const DisabledWithIcon = () => <TextField isDisabled />;
`,...d.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{code:`const ShowError = () => (
  <Form validationErrors={{ url: "Invalid URL" }}>
    <TextField />
  </Form>
);
`,...m.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{code:`const Validation = () => (
  <TextField validate={(value) => (value === "admin" ? "Nice try!" : null)} />
);
`,...x.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{code:`const CustomField = () => (
  <>
    <FieldLabel
      htmlFor="custom-field"
      id="custom-field-label"
      label="Custom Field"
    />
    <TextField
      id="custom-field"
      aria-labelledby="custom-field-label"
      name="custom-field"
      defaultValue="Custom Field"
    />
  </>
);
`,...g.input.parameters?.docs?.source}}};h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{code:`const AutoBg = () => (
  <Flex direction="column" gap="4">
    <div style={{ maxWidth: "600px" }}>
      TextField automatically detects its parent bg context and increments the
      neutral level by 1. No prop is needed — it's fully automatic.
    </div>
    <Box bg="neutral" p="4">
      <Text>Neutral 1 container</Text>
      <Flex mt="2" style={{ maxWidth: "300px" }}>
        <TextField aria-label="Text" placeholder="Enter text" size="small" />
      </Flex>
    </Box>
    <Box bg="neutral">
      <Box bg="neutral" p="4">
        <Text>Neutral 2 container</Text>
        <Flex mt="2" style={{ maxWidth: "300px" }}>
          <TextField aria-label="Text" placeholder="Enter text" size="small" />
        </Flex>
      </Box>
    </Box>
    <Box bg="neutral">
      <Box bg="neutral">
        <Box bg="neutral" p="4">
          <Text>Neutral 3 container</Text>
          <Flex mt="2" style={{ maxWidth: "300px" }}>
            <TextField
              aria-label="Text"
              placeholder="Enter text"
              size="small"
            />
          </Flex>
        </Box>
      </Box>
    </Box>
  </Flex>
);
`,...h.input.parameters?.docs?.source}}};t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    name: 'url',
    placeholder: 'Enter a URL',
    style: {
      maxWidth: '300px'
    }
  }
})`,...t.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...o.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    defaultValue: 'https://example.com'
  }
})`,...l.input.parameters?.docs?.source}}};r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    label: 'Label'
  }
})`,...r.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    description: 'Description'
  }
})`,...p.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    isRequired: true
  }
})`,...u.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    isDisabled: true
  }
})`,...c.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: args => <TextField {...args} placeholder="Enter a URL" size="small" icon={<RiEyeLine />} />
})`,...s.input.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`WithIcon.extend({
  args: {
    isDisabled: true
  }
})`,...d.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args
  },
  render: args => <Form validationErrors={{
    url: 'Invalid URL'
  }}>
      <TextField {...args} />
    </Form>
})`,...m.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    validate: value => value === 'admin' ? 'Nice try!' : null
  }
})`,...x.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <>
      <FieldLabel htmlFor="custom-field" id="custom-field-label" label="Custom Field" />
      <TextField id="custom-field" aria-labelledby="custom-field-label" name="custom-field" defaultValue="Custom Field" />
    </>
})`,...g.input.parameters?.docs?.source}}};h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...h.input.parameters?.docs?.source}}};const P=["Default","Sizes","DefaultValue","WithLabel","WithDescription","Required","Disabled","WithIcon","DisabledWithIcon","ShowError","Validation","CustomField","AutoBg"];export{h as AutoBg,g as CustomField,t as Default,l as DefaultValue,c as Disabled,d as DisabledWithIcon,u as Required,m as ShowError,o as Sizes,x as Validation,p as WithDescription,s as WithIcon,r as WithLabel,P as __namedExportsOrder};
