import{p as H,j as e,r as B}from"./iframe-CNJ8DcrC.js";import{S as t}from"./SearchField-BoRx3-2Y.js";import{$ as E}from"./Form-y2WNsJvz.js";import{U,c as j}from"./index-Bscon1G1.js";import{F as f}from"./Flex-gznhGsL1.js";import{H as D}from"./Header-ByBsR2U3.js";import{M as I}from"./index-DkthXm2e.js";import{F as q}from"./FieldLabel-p3nFc0gc.js";import{B as W}from"./ButtonIcon-DGJXN4it.js";import{B as V}from"./Button-Vzu3Jvbs.js";import"./preload-helper-PPVm8Dsz.js";import"./Button-BeiFbECh.js";import"./utils-DqzyTKhZ.js";import"./useObjectRef-D4VDTdyV.js";import"./clsx-B-dksMZM.js";import"./Label-CJ-vxwqW.js";import"./Hidden-ubLVAw13.js";import"./useFocusable-BRngNkQp.js";import"./useLabel-BZdBZ-M8.js";import"./useLabels-CtOTMY5s.js";import"./context-BaC93-pS.js";import"./useButton-CBYUCijk.js";import"./usePress-D634pjUp.js";import"./useFocusRing-_R5-3ahM.js";import"./Input-Bx1Q9ja8.js";import"./useFormReset-CElrKw0c.js";import"./useControlledState-CqjGTBew.js";import"./useField-DsFdjrH-.js";import"./SearchField-zRsAF-St.js";import"./FieldError-ed3rL4L6.js";import"./Text-Cn9vnNz6.js";import"./RSPContexts-6RDiUzJW.js";import"./useLocalizedStringFormatter-BNUwPyU_.js";import"./useStyles-Ctwz8Mdy.js";import"./FieldError-Cd_1JWen.js";import"./useSurface-psgZOnSF.js";import"./Link-D_0V-iQP.js";import"./useLink-C_kUAI-j.js";import"./Text-DZ9ojE3W.js";import"./Tabs-BG1L4Fvw.js";import"./SelectionManager-3zHy28g_.js";import"./useEvent-BTL2BJnf.js";import"./SelectionIndicator-B--I21Py.js";import"./useListState-DHoCQKk8.js";import"./animation-CFsi5qUo.js";import"./useHasTabbableChild-CoDRaCSe.js";import"./InternalLinkProvider-BkNugvJ-.js";import"./defineComponent-B_6e1-Ln.js";const r=H.meta({title:"Backstage UI/SearchField",component:t,argTypes:{isRequired:{control:"boolean"},icon:{control:"object"},placeholder:{control:"text"}}}),s=r.story({args:{name:"url",style:{maxWidth:"300px"},"aria-label":"Search"}}),l=r.story({args:{...s.input.args},render:a=>e.jsxs(f,{direction:"row",gap:"4",style:{width:"100%",maxWidth:"600px"},children:[e.jsx(t,{...a,size:"small"}),e.jsx(t,{...a,size:"medium"})]})}),c=r.story({args:{...s.input.args,defaultValue:"https://example.com"}}),i=r.story({args:{...s.input.args,label:"Label"}}),u=r.story({args:{...i.input.args,description:"Description"}}),p=r.story({args:{...i.input.args,isRequired:!0}}),d=r.story({args:{...s.input.args,isDisabled:!0}}),o=r.story({args:{...s.input.args},render:a=>e.jsx(t,{...a,placeholder:"Enter a URL",size:"small",icon:e.jsx(U,{})})}),m=r.story({args:{...o.input.args,isDisabled:!0}}),h=r.story({args:{...i.input.args},render:a=>e.jsx(E,{validationErrors:{url:"Invalid URL"},children:e.jsx(t,{...a})})}),g=r.story({args:{...i.input.args,validate:a=>a==="admin"?"Nice try!":null}}),x=r.story({render:()=>e.jsxs(e.Fragment,{children:[e.jsx(q,{htmlFor:"custom-field",id:"custom-field-label",label:"Custom Field"}),e.jsx(t,{id:"custom-field","aria-labelledby":"custom-field-label",name:"custom-field",defaultValue:"Custom Field"})]})}),n=r.story({args:{...s.input.args,startCollapsed:!0},render:a=>e.jsxs(f,{direction:"column",gap:"4",children:[e.jsxs(f,{direction:"row",gap:"4",children:[e.jsx(t,{...a,size:"small"}),e.jsx(t,{...a,size:"medium"})]}),e.jsx(t,{...a,size:"small"})]})}),S=r.story({args:{...n.input.args,defaultValue:"https://example.com"},render:a=>e.jsx(t,{...a,size:"small"})}),y=r.story({decorators:[a=>e.jsx(I,{children:e.jsx(a,{})})],render:a=>e.jsx(e.Fragment,{children:e.jsx(D,{title:"Title",customActions:e.jsxs(e.Fragment,{children:[e.jsx(W,{"aria-label":"Cactus icon button",icon:e.jsx(j,{}),size:"small",variant:"secondary"}),e.jsx(t,{"aria-label":"Search",...a,size:"small"}),e.jsx(W,{"aria-label":"Cactus icon button",icon:e.jsx(j,{}),size:"small",variant:"secondary"})]})})})}),C=r.story({args:{...n.input.args},decorators:[a=>e.jsx(I,{children:e.jsx(a,{})})],render:a=>e.jsx(e.Fragment,{children:e.jsx(D,{title:"Title",customActions:e.jsxs(e.Fragment,{children:[e.jsx(W,{"aria-label":"Cactus icon button",icon:e.jsx(j,{}),size:"small",variant:"secondary"}),e.jsx(t,{...a,size:"small"}),e.jsx(W,{"aria-label":"Cactus icon button",icon:e.jsx(j,{}),size:"small",variant:"secondary"})]})})})}),F=r.story({args:{...n.input.args},render:a=>e.jsxs(f,{direction:"row",gap:"2",style:{width:"100%",maxWidth:"600px"},children:[e.jsx(t,{...a,size:"small"}),e.jsx(W,{"aria-label":"Cactus icon button",icon:e.jsx(j,{}),size:"small",variant:"secondary"}),e.jsx(V,{size:"small",variant:"secondary",children:"Hello world"}),e.jsx(t,{...a,size:"medium"}),e.jsx(W,{"aria-label":"Cactus icon button",icon:e.jsx(j,{}),size:"medium",variant:"secondary"}),e.jsx(V,{size:"medium",variant:"secondary",children:"Hello world"})]})}),b=r.story({args:{...n.input.args},render:a=>{const w=R=>{console.log("Search value:",R)};return e.jsx(f,{direction:"row",gap:"2",style:{width:"100%",maxWidth:"600px"},children:e.jsx(t,{...a,onChange:w,size:"small"})})}}),z=r.story({args:{...n.input.args},render:function(w){const[R,L]=B.useState("");return e.jsx(f,{direction:"row",gap:"2",style:{width:"100%",maxWidth:"600px"},children:e.jsx(t,{...w,size:"small",value:R,onChange:L})})}}),v=r.story({args:{...n.input.args},render:function(w){const[R,L]=B.useState("Component");return e.jsx(f,{direction:"row",gap:"2",style:{width:"100%",maxWidth:"600px"},children:e.jsx(t,{...w,size:"small",value:R,onChange:L})})}});s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{code:`const Default = () => (
  <SearchField
    name="url"
    style={{
      maxWidth: "300px",
    }}
    aria-label="Search"
  />
);
`,...s.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{code:`const Sizes = () => (
  <Flex direction="row" gap="4" style={{ width: "100%", maxWidth: "600px" }}>
    <SearchField size="small" />
    <SearchField size="medium" />
  </Flex>
);
`,...l.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{code:`const DefaultValue = () => <SearchField defaultValue="https://example.com" />;
`,...c.input.parameters?.docs?.source}}};i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{code:`const WithLabel = () => <SearchField label="Label" />;
`,...i.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{code:`const WithDescription = () => <SearchField description="Description" />;
`,...u.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{code:`const Required = () => <SearchField isRequired />;
`,...p.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{code:`const Disabled = () => <SearchField isDisabled />;
`,...d.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{code:`const WithIcon = () => (
  <SearchField placeholder="Enter a URL" size="small" icon={<RiEBike2Line />} />
);
`,...o.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{code:`const DisabledWithIcon = () => <SearchField isDisabled />;
`,...m.input.parameters?.docs?.source}}};h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{code:`const ShowError = () => (
  <Form validationErrors={{ url: "Invalid URL" }}>
    <SearchField />
  </Form>
);
`,...h.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{code:`const Validation = () => (
  <SearchField validate={(value) => (value === "admin" ? "Nice try!" : null)} />
);
`,...g.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{code:`const CustomField = () => (
  <>
    <FieldLabel
      htmlFor="custom-field"
      id="custom-field-label"
      label="Custom Field"
    />
    <SearchField
      id="custom-field"
      aria-labelledby="custom-field-label"
      name="custom-field"
      defaultValue="Custom Field"
    />
  </>
);
`,...x.input.parameters?.docs?.source}}};n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{code:`const StartCollapsed = () => (
  <Flex direction="column" gap="4">
    <Flex direction="row" gap="4">
      <SearchField startCollapsed size="small" />
      <SearchField startCollapsed size="medium" />
    </Flex>
    <SearchField startCollapsed size="small" />
  </Flex>
);
`,...n.input.parameters?.docs?.source}}};S.input.parameters={...S.input.parameters,docs:{...S.input.parameters?.docs,source:{code:`const StartCollapsedWithValue = () => (
  <SearchField defaultValue="https://example.com" size="small" />
);
`,...S.input.parameters?.docs?.source}}};y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{code:`const InHeader = (args) => (
  <>
    <Header
      title="Title"
      customActions={
        <>
          <ButtonIcon
            aria-label="Cactus icon button"
            icon={<RiCactusLine />}
            size="small"
            variant="secondary"
          />
          <SearchField aria-label="Search" {...args} size="small" />
          <ButtonIcon
            aria-label="Cactus icon button"
            icon={<RiCactusLine />}
            size="small"
            variant="secondary"
          />
        </>
      }
    />
  </>
);
`,...y.input.parameters?.docs?.source}}};C.input.parameters={...C.input.parameters,docs:{...C.input.parameters?.docs,source:{code:`const StartCollapsedInHeader = (args) => (
  <>
    <Header
      title="Title"
      customActions={
        <>
          <ButtonIcon
            aria-label="Cactus icon button"
            icon={<RiCactusLine />}
            size="small"
            variant="secondary"
          />
          <SearchField {...args} size="small" />
          <ButtonIcon
            aria-label="Cactus icon button"
            icon={<RiCactusLine />}
            size="small"
            variant="secondary"
          />
        </>
      }
    />
  </>
);
`,...C.input.parameters?.docs?.source}}};F.input.parameters={...F.input.parameters,docs:{...F.input.parameters?.docs,source:{code:`const StartCollapsedWithButtons = () => (
  <Flex direction="row" gap="2" style={{ width: "100%", maxWidth: "600px" }}>
    <SearchField size="small" />
    <ButtonIcon
      aria-label="Cactus icon button"
      icon={<RiCactusLine />}
      size="small"
      variant="secondary"
    />
    <Button size="small" variant="secondary">
      Hello world
    </Button>
    <SearchField size="medium" />
    <ButtonIcon
      aria-label="Cactus icon button"
      icon={<RiCactusLine />}
      size="medium"
      variant="secondary"
    />
    <Button size="medium" variant="secondary">
      Hello world
    </Button>
  </Flex>
);
`,...F.input.parameters?.docs?.source}}};b.input.parameters={...b.input.parameters,docs:{...b.input.parameters?.docs,source:{code:`const StartCollapsedWithOnChange = () => {
  const handleChange = (value: string) => {
    console.log("Search value:", value);
  };

  return (
    <Flex direction="row" gap="2" style={{ width: "100%", maxWidth: "600px" }}>
      <SearchField onChange={handleChange} size="small" />
    </Flex>
  );
};
`,...b.input.parameters?.docs?.source}}};z.input.parameters={...z.input.parameters,docs:{...z.input.parameters?.docs,source:{code:`const StartCollapsedControlledEmpty = () => {
  const [value, setValue] = useState("");

  return (
    <Flex direction="row" gap="2" style={{ width: "100%", maxWidth: "600px" }}>
      <SearchField size="small" value={value} onChange={setValue} />
    </Flex>
  );
};
`,...z.input.parameters?.docs?.source}}};v.input.parameters={...v.input.parameters,docs:{...v.input.parameters?.docs,source:{code:`const StartCollapsedControlledWithValue = () => {
  const [value, setValue] = useState("Component");

  return (
    <Flex direction="row" gap="2" style={{ width: "100%", maxWidth: "600px" }}>
      <SearchField size="small" value={value} onChange={setValue} />
    </Flex>
  );
};
`,...v.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    name: 'url',
    style: {
      maxWidth: '300px'
    },
    'aria-label': 'Search'
  }
})`,...s.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: args => <Flex direction="row" gap="4" style={{
    width: '100%',
    maxWidth: '600px'
  }}>
      <SearchField {...args} size="small" />
      <SearchField {...args} size="medium" />
    </Flex>
})`,...l.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    defaultValue: 'https://example.com'
  }
})`,...c.input.parameters?.docs?.source}}};i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    label: 'Label'
  }
})`,...i.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    description: 'Description'
  }
})`,...u.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    isRequired: true
  }
})`,...p.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    isDisabled: true
  }
})`,...d.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: args => <SearchField {...args} placeholder="Enter a URL" size="small" icon={<RiEBike2Line />} />
})`,...o.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithIcon.input.args,
    isDisabled: true
  }
})`,...m.input.parameters?.docs?.source}}};h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args
  },
  render: args => <Form validationErrors={{
    url: 'Invalid URL'
  }}>
      <SearchField {...args} />
    </Form>
})`,...h.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    validate: value => value === 'admin' ? 'Nice try!' : null
  }
})`,...g.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <>
      <FieldLabel htmlFor="custom-field" id="custom-field-label" label="Custom Field" />
      <SearchField id="custom-field" aria-labelledby="custom-field-label" name="custom-field" defaultValue="Custom Field" />
    </>
})`,...x.input.parameters?.docs?.source}}};n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    startCollapsed: true
  },
  render: args => <Flex direction="column" gap="4">
      <Flex direction="row" gap="4">
        <SearchField {...args} size="small" />
        <SearchField {...args} size="medium" />
      </Flex>
      <SearchField {...args} size="small" />
    </Flex>
})`,...n.input.parameters?.docs?.source}}};S.input.parameters={...S.input.parameters,docs:{...S.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...StartCollapsed.input.args,
    defaultValue: 'https://example.com'
  },
  render: args => <SearchField {...args} size="small" />
})`,...S.input.parameters?.docs?.source}}};y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [Story => <MemoryRouter>
        <Story />
      </MemoryRouter>],
  render: args => <>
      <Header title="Title" customActions={<>
            <ButtonIcon aria-label="Cactus icon button" icon={<RiCactusLine />} size="small" variant="secondary" />
            <SearchField aria-label="Search" {...args} size="small" />
            <ButtonIcon aria-label="Cactus icon button" icon={<RiCactusLine />} size="small" variant="secondary" />
          </>} />
    </>
})`,...y.input.parameters?.docs?.source}}};C.input.parameters={...C.input.parameters,docs:{...C.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...StartCollapsed.input.args
  },
  decorators: [Story => <MemoryRouter>
        <Story />
      </MemoryRouter>],
  render: args => <>
      <Header title="Title" customActions={<>
            <ButtonIcon aria-label="Cactus icon button" icon={<RiCactusLine />} size="small" variant="secondary" />
            <SearchField {...args} size="small" />
            <ButtonIcon aria-label="Cactus icon button" icon={<RiCactusLine />} size="small" variant="secondary" />
          </>} />
    </>
})`,...C.input.parameters?.docs?.source}}};F.input.parameters={...F.input.parameters,docs:{...F.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...StartCollapsed.input.args
  },
  render: args => <Flex direction="row" gap="2" style={{
    width: '100%',
    maxWidth: '600px'
  }}>
      <SearchField {...args} size="small" />
      <ButtonIcon aria-label="Cactus icon button" icon={<RiCactusLine />} size="small" variant="secondary" />
      <Button size="small" variant="secondary">
        Hello world
      </Button>
      <SearchField {...args} size="medium" />
      <ButtonIcon aria-label="Cactus icon button" icon={<RiCactusLine />} size="medium" variant="secondary" />
      <Button size="medium" variant="secondary">
        Hello world
      </Button>
    </Flex>
})`,...F.input.parameters?.docs?.source}}};b.input.parameters={...b.input.parameters,docs:{...b.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...StartCollapsed.input.args
  },
  render: args => {
    const handleChange = (value: string) => {
      console.log('Search value:', value);
    };
    return <Flex direction="row" gap="2" style={{
      width: '100%',
      maxWidth: '600px'
    }}>
        <SearchField {...args} onChange={handleChange} size="small" />
      </Flex>;
  }
})`,...b.input.parameters?.docs?.source}}};z.input.parameters={...z.input.parameters,docs:{...z.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...StartCollapsed.input.args
  },
  render: function Render(args) {
    const [value, setValue] = useState('');
    return <Flex direction="row" gap="2" style={{
      width: '100%',
      maxWidth: '600px'
    }}>
        <SearchField {...args} size="small" value={value} onChange={setValue} />
      </Flex>;
  }
})`,...z.input.parameters?.docs?.source}}};v.input.parameters={...v.input.parameters,docs:{...v.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...StartCollapsed.input.args
  },
  render: function Render(args) {
    const [value, setValue] = useState('Component');
    return <Flex direction="row" gap="2" style={{
      width: '100%',
      maxWidth: '600px'
    }}>
        <SearchField {...args} size="small" value={value} onChange={setValue} />
      </Flex>;
  }
})`,...v.input.parameters?.docs?.source}}};const De=["Default","Sizes","DefaultValue","WithLabel","WithDescription","Required","Disabled","WithIcon","DisabledWithIcon","ShowError","Validation","CustomField","StartCollapsed","StartCollapsedWithValue","InHeader","StartCollapsedInHeader","StartCollapsedWithButtons","StartCollapsedWithOnChange","StartCollapsedControlledEmpty","StartCollapsedControlledWithValue"];export{x as CustomField,s as Default,c as DefaultValue,d as Disabled,m as DisabledWithIcon,y as InHeader,p as Required,h as ShowError,l as Sizes,n as StartCollapsed,z as StartCollapsedControlledEmpty,v as StartCollapsedControlledWithValue,C as StartCollapsedInHeader,F as StartCollapsedWithButtons,b as StartCollapsedWithOnChange,S as StartCollapsedWithValue,g as Validation,u as WithDescription,o as WithIcon,i as WithLabel,De as __namedExportsOrder};
