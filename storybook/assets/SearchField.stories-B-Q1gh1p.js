import{p as H,j as e,r as B}from"./iframe-M9O-K8SB.js";import{S as t}from"./SearchField-DWbSv7at.js";import{$ as E}from"./Form-BBJy9cFl.js";import{U,c as j}from"./index-BKJKY9Wv.js";import{F as f}from"./Flex-Bz2InqMs.js";import{H as D}from"./Header-DWHlBJTS.js";import{M as I}from"./index-CuiKZooy.js";import{F as q}from"./FieldLabel-Dm8Ex6MU.js";import{B as W}from"./ButtonIcon-CDy8Bm8x.js";import{B as V}from"./Button-BbTpZl37.js";import"./preload-helper-PPVm8Dsz.js";import"./Button-Dkbd3KcU.js";import"./utils-BXllfVt4.js";import"./useObjectRef-BPFp5snO.js";import"./clsx-B-dksMZM.js";import"./Label-o9S_v-xF.js";import"./Hidden-DTd05gNK.js";import"./useFocusable-BwFERnd_.js";import"./useLabel-COjMvP6r.js";import"./useLabels-C3g0X61E.js";import"./context-Bv6kxITJ.js";import"./useButton-F9hepFpV.js";import"./usePress-ByOsZuB9.js";import"./useFocusRing-COnCKKka.js";import"./Input-MCe13Yrn.js";import"./useFormReset-DJISnqgL.js";import"./useControlledState-DzBnLbpE.js";import"./useField-BgIPqRrs.js";import"./SearchField-DGocqKEX.js";import"./FieldError-BifbfugT.js";import"./Text-B7PuQZMK.js";import"./RSPContexts-BdpIjeVF.js";import"./useLocalizedStringFormatter-C4c9cZU5.js";import"./useStyles-BRwt6BXn.js";import"./FieldError-Dr6Rp0Rr.js";import"./useSurface-CJaN3YoD.js";import"./Link-Dd7GVCHR.js";import"./useLink-B9gmuu0v.js";import"./Text-RD33cT1s.js";import"./Tabs-D0FA7CWN.js";import"./SelectionManager-AOhnTTKk.js";import"./useEvent-BRbGx-1q.js";import"./SelectionIndicator-yhlvspp_.js";import"./useListState-DtLAZGwv.js";import"./animation-D5pTcXzL.js";import"./useHasTabbableChild-D6MbJ94R.js";import"./InternalLinkProvider-Bi_DmABW.js";import"./defineComponent-BmABoWOu.js";const r=H.meta({title:"Backstage UI/SearchField",component:t,argTypes:{isRequired:{control:"boolean"},icon:{control:"object"},placeholder:{control:"text"}}}),s=r.story({args:{name:"url",style:{maxWidth:"300px"},"aria-label":"Search"}}),l=r.story({args:{...s.input.args},render:a=>e.jsxs(f,{direction:"row",gap:"4",style:{width:"100%",maxWidth:"600px"},children:[e.jsx(t,{...a,size:"small"}),e.jsx(t,{...a,size:"medium"})]})}),c=r.story({args:{...s.input.args,defaultValue:"https://example.com"}}),i=r.story({args:{...s.input.args,label:"Label"}}),u=r.story({args:{...i.input.args,description:"Description"}}),p=r.story({args:{...i.input.args,isRequired:!0}}),d=r.story({args:{...s.input.args,isDisabled:!0}}),o=r.story({args:{...s.input.args},render:a=>e.jsx(t,{...a,placeholder:"Enter a URL",size:"small",icon:e.jsx(U,{})})}),m=r.story({args:{...o.input.args,isDisabled:!0}}),h=r.story({args:{...i.input.args},render:a=>e.jsx(E,{validationErrors:{url:"Invalid URL"},children:e.jsx(t,{...a})})}),g=r.story({args:{...i.input.args,validate:a=>a==="admin"?"Nice try!":null}}),x=r.story({render:()=>e.jsxs(e.Fragment,{children:[e.jsx(q,{htmlFor:"custom-field",id:"custom-field-label",label:"Custom Field"}),e.jsx(t,{id:"custom-field","aria-labelledby":"custom-field-label",name:"custom-field",defaultValue:"Custom Field"})]})}),n=r.story({args:{...s.input.args,startCollapsed:!0},render:a=>e.jsxs(f,{direction:"column",gap:"4",children:[e.jsxs(f,{direction:"row",gap:"4",children:[e.jsx(t,{...a,size:"small"}),e.jsx(t,{...a,size:"medium"})]}),e.jsx(t,{...a,size:"small"})]})}),S=r.story({args:{...n.input.args,defaultValue:"https://example.com"},render:a=>e.jsx(t,{...a,size:"small"})}),y=r.story({decorators:[a=>e.jsx(I,{children:e.jsx(a,{})})],render:a=>e.jsx(e.Fragment,{children:e.jsx(D,{title:"Title",customActions:e.jsxs(e.Fragment,{children:[e.jsx(W,{"aria-label":"Cactus icon button",icon:e.jsx(j,{}),size:"small",variant:"secondary"}),e.jsx(t,{"aria-label":"Search",...a,size:"small"}),e.jsx(W,{"aria-label":"Cactus icon button",icon:e.jsx(j,{}),size:"small",variant:"secondary"})]})})})}),C=r.story({args:{...n.input.args},decorators:[a=>e.jsx(I,{children:e.jsx(a,{})})],render:a=>e.jsx(e.Fragment,{children:e.jsx(D,{title:"Title",customActions:e.jsxs(e.Fragment,{children:[e.jsx(W,{"aria-label":"Cactus icon button",icon:e.jsx(j,{}),size:"small",variant:"secondary"}),e.jsx(t,{...a,size:"small"}),e.jsx(W,{"aria-label":"Cactus icon button",icon:e.jsx(j,{}),size:"small",variant:"secondary"})]})})})}),F=r.story({args:{...n.input.args},render:a=>e.jsxs(f,{direction:"row",gap:"2",style:{width:"100%",maxWidth:"600px"},children:[e.jsx(t,{...a,size:"small"}),e.jsx(W,{"aria-label":"Cactus icon button",icon:e.jsx(j,{}),size:"small",variant:"secondary"}),e.jsx(V,{size:"small",variant:"secondary",children:"Hello world"}),e.jsx(t,{...a,size:"medium"}),e.jsx(W,{"aria-label":"Cactus icon button",icon:e.jsx(j,{}),size:"medium",variant:"secondary"}),e.jsx(V,{size:"medium",variant:"secondary",children:"Hello world"})]})}),b=r.story({args:{...n.input.args},render:a=>{const w=R=>{console.log("Search value:",R)};return e.jsx(f,{direction:"row",gap:"2",style:{width:"100%",maxWidth:"600px"},children:e.jsx(t,{...a,onChange:w,size:"small"})})}}),z=r.story({args:{...n.input.args},render:function(w){const[R,L]=B.useState("");return e.jsx(f,{direction:"row",gap:"2",style:{width:"100%",maxWidth:"600px"},children:e.jsx(t,{...w,size:"small",value:R,onChange:L})})}}),v=r.story({args:{...n.input.args},render:function(w){const[R,L]=B.useState("Component");return e.jsx(f,{direction:"row",gap:"2",style:{width:"100%",maxWidth:"600px"},children:e.jsx(t,{...w,size:"small",value:R,onChange:L})})}});s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{code:`const Default = () => (
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
