import{r as I,j as e,a5 as ie}from"./iframe-BY6cr4Gs.js";import{$ as oe}from"./Button-BIvNcZCJ.js";import{$ as le}from"./Input-ZtxpiPoN.js";import{$ as ce}from"./SearchField-C_Ic480f.js";import{c as V}from"./clsx-B-dksMZM.js";import{Z as ue,A as de,e as pe,f as L}from"./index-B8WXLTiw.js";import{u as me}from"./useStyles-D8_XTlHG.js";import{F as U}from"./FieldLabel-dt5cTozY.js";import{F as he}from"./FieldError-UOA0jeJl.js";import{$ as ge}from"./Form-DfngdZI2.js";import{F as R}from"./Flex-DMuGPxbV.js";import{H as M}from"./Header-arVH-B7U.js";import{M as O}from"./index-CidjncPb.js";import{B}from"./ButtonIcon-DCNU4BJM.js";import{B as A}from"./Button-CeiXf_Z5.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-C2CAx66-.js";import"./useObjectRef-c-KjL6Jx.js";import"./Label-CciPANOT.js";import"./Hidden-CoREFX85.js";import"./useFocusable-aK4x0Gji.js";import"./useLabel-CuWrM3Um.js";import"./useLabels-BXD5mtLs.js";import"./context-BuHWFKfM.js";import"./usePress-DZVjaikz.js";import"./useFocusRing-17ZDvobQ.js";import"./useFormReset-Cpyf9gDh.js";import"./useControlledState-oiZqNchG.js";import"./Text-hwBn-xvB.js";import"./FieldError-CAeuyi4g.js";import"./RSPContexts-BFBefURi.js";import"./useLocalizedStringFormatter-Cb_Rl51L.js";import"./useSurface-yfTL8fH4.js";import"./Link-DyJ0IrrL.js";import"./useLink-D8cx_cHt.js";import"./Text-Cg9Zaa7m.js";import"./Tabs-BFSz46kQ.js";import"./useListState-BYBvXcaY.js";import"./useEvent-Cgzob2Ew.js";import"./SelectionIndicator-CgIQrdjY.js";import"./useHasTabbableChild-BBubaRnz.js";import"./Button.module-gtToApuQ.js";const xe={classNames:{root:"bui-SearchField",clear:"bui-SearchFieldClear",inputWrapper:"bui-SearchFieldInputWrapper",input:"bui-SearchFieldInput",inputIcon:"bui-SearchFieldInputIcon"},dataAttributes:{startCollapsed:[!0,!1],size:["small","medium"]}},D={"bui-SearchField":"_bui-SearchField_1kdj7_20","bui-SearchFieldClear":"_bui-SearchFieldClear_1kdj7_37","bui-SearchFieldInput":"_bui-SearchFieldInput_1kdj7_65","bui-SearchFieldInputWrapper":"_bui-SearchFieldInputWrapper_1kdj7_77","bui-SearchFieldInputIcon":"_bui-SearchFieldInputIcon_1kdj7_128"},t=I.forwardRef((a,W)=>{const{label:l,"aria-label":w,"aria-labelledby":H}=a;I.useEffect(()=>{!l&&!w&&!H&&console.warn("SearchField requires either a visible label, aria-label, or aria-labelledby for accessibility")},[l,w,H]);const{classNames:o,dataAttributes:E,style:P,cleanedProps:Z}=me(xe,{size:"small",placeholder:"Search",startCollapsed:!1,...a}),{className:G,description:J,icon:$,isRequired:K,secondaryLabel:Q,placeholder:X,startCollapsed:q,...N}=Z,[T,Y]=I.useState(!1),_=I.useRef(null),ee=Q||(K?"Required":null),ae=k=>{a.onFocusChange?.(k),Y(k)},re=()=>{_.current?.focus()},te=!!_.current,se=!!_.current?.value,ne=te?q&&!se&&!T:q&&!N.value&&!N.defaultValue&&!T;return e.jsxs(ce,{className:V(o.root,D[o.root],G),...E,"aria-label":w,"aria-labelledby":H,"data-collapsed":ne,style:P,...N,onFocusChange:ae,ref:W,children:[e.jsx(U,{label:l,secondaryLabel:ee,description:J}),e.jsxs("div",{className:V(o.inputWrapper,D[o.inputWrapper]),"data-size":E["data-size"],onClick:re,children:[$!==!1&&e.jsx("div",{className:V(o.inputIcon,D[o.inputIcon]),"data-size":E["data-size"],"aria-hidden":"true",children:$||e.jsx(ue,{})}),e.jsx(le,{ref:_,className:V(o.input,D[o.input]),...$!==!1&&{"data-icon":!0},placeholder:X}),e.jsx(oe,{className:V(o.clear,D[o.clear]),"data-size":E["data-size"],children:e.jsx(de,{})})]}),e.jsx(he,{})]})});t.displayName="searchField";t.__docgenInfo={description:"@public",methods:[],displayName:"searchField",props:{icon:{required:!1,tsType:{name:"union",raw:"ReactNode | false",elements:[{name:"ReactNode"},{name:"literal",value:"false"}]},description:"An icon to render before the input"},size:{required:!1,tsType:{name:"union",raw:"'small' | 'medium' | Partial<Record<Breakpoint, 'small' | 'medium'>>",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]}],raw:"Record<Breakpoint, 'small' | 'medium'>"}],raw:"Partial<Record<Breakpoint, 'small' | 'medium'>>"}]},description:`The size of the text field
@defaultValue 'medium'`},placeholder:{required:!1,tsType:{name:"string"},description:"The placeholder text for the input"},startCollapsed:{required:!1,tsType:{name:"boolean"},description:"Controls whether the SearchField starts in a collapsed state."}},composes:["AriaSearchFieldProps","Omit"]};const r=ie.meta({title:"Backstage UI/SearchField",component:t,argTypes:{isRequired:{control:"boolean"},icon:{control:"object"},placeholder:{control:"text"}}}),s=r.story({args:{name:"url",style:{maxWidth:"300px"},"aria-label":"Search"}}),u=r.story({args:{...s.input.args},render:a=>e.jsxs(R,{direction:"row",gap:"4",style:{width:"100%",maxWidth:"600px"},children:[e.jsx(t,{...a,size:"small"}),e.jsx(t,{...a,size:"medium"})]})}),d=r.story({args:{...s.input.args,defaultValue:"https://example.com"}}),i=r.story({args:{...s.input.args,label:"Label"}}),p=r.story({args:{...i.input.args,description:"Description"}}),m=r.story({args:{...i.input.args,isRequired:!0}}),h=r.story({args:{...s.input.args,isDisabled:!0}}),c=r.story({args:{...s.input.args},render:a=>e.jsx(t,{...a,placeholder:"Enter a URL",size:"small",icon:e.jsx(pe,{})})}),g=r.story({args:{...c.input.args,isDisabled:!0}}),x=r.story({args:{...i.input.args},render:a=>e.jsx(ge,{validationErrors:{url:"Invalid URL"},children:e.jsx(t,{...a})})}),b=r.story({args:{...i.input.args,validate:a=>a==="admin"?"Nice try!":null}}),S=r.story({render:()=>e.jsxs(e.Fragment,{children:[e.jsx(U,{htmlFor:"custom-field",id:"custom-field-label",label:"Custom Field"}),e.jsx(t,{id:"custom-field","aria-labelledby":"custom-field-label",name:"custom-field",defaultValue:"Custom Field"})]})}),n=r.story({args:{...s.input.args,startCollapsed:!0},render:a=>e.jsxs(R,{direction:"column",gap:"4",children:[e.jsxs(R,{direction:"row",gap:"4",children:[e.jsx(t,{...a,size:"small"}),e.jsx(t,{...a,size:"medium"})]}),e.jsx(t,{...a,size:"small"})]})}),F=r.story({args:{...n.input.args,defaultValue:"https://example.com"},render:a=>e.jsx(t,{...a,size:"small"})}),y=r.story({decorators:[a=>e.jsx(O,{children:e.jsx(a,{})})],render:a=>e.jsx(e.Fragment,{children:e.jsx(M,{title:"Title",customActions:e.jsxs(e.Fragment,{children:[e.jsx(B,{"aria-label":"Cactus icon button",icon:e.jsx(L,{}),size:"small",variant:"secondary"}),e.jsx(t,{"aria-label":"Search",...a,size:"small"}),e.jsx(B,{"aria-label":"Cactus icon button",icon:e.jsx(L,{}),size:"small",variant:"secondary"})]})})})}),C=r.story({args:{...n.input.args},decorators:[a=>e.jsx(O,{children:e.jsx(a,{})})],render:a=>e.jsx(e.Fragment,{children:e.jsx(M,{title:"Title",customActions:e.jsxs(e.Fragment,{children:[e.jsx(B,{"aria-label":"Cactus icon button",icon:e.jsx(L,{}),size:"small",variant:"secondary"}),e.jsx(t,{...a,size:"small"}),e.jsx(B,{"aria-label":"Cactus icon button",icon:e.jsx(L,{}),size:"small",variant:"secondary"})]})})})}),f=r.story({args:{...n.input.args},render:a=>e.jsxs(R,{direction:"row",gap:"2",style:{width:"100%",maxWidth:"600px"},children:[e.jsx(t,{...a,size:"small"}),e.jsx(B,{"aria-label":"Cactus icon button",icon:e.jsx(L,{}),size:"small",variant:"secondary"}),e.jsx(A,{size:"small",variant:"secondary",children:"Hello world"}),e.jsx(t,{...a,size:"medium"}),e.jsx(B,{"aria-label":"Cactus icon button",icon:e.jsx(L,{}),size:"medium",variant:"secondary"}),e.jsx(A,{size:"medium",variant:"secondary",children:"Hello world"})]})}),z=r.story({args:{...n.input.args},render:a=>{const W=l=>{console.log("Search value:",l)};return e.jsx(R,{direction:"row",gap:"2",style:{width:"100%",maxWidth:"600px"},children:e.jsx(t,{...a,onChange:W,size:"small"})})}}),v=r.story({args:{...n.input.args},render:function(W){const[l,w]=I.useState("");return e.jsx(R,{direction:"row",gap:"2",style:{width:"100%",maxWidth:"600px"},children:e.jsx(t,{...W,size:"small",value:l,onChange:w})})}}),j=r.story({args:{...n.input.args},render:function(W){const[l,w]=I.useState("Component");return e.jsx(R,{direction:"row",gap:"2",style:{width:"100%",maxWidth:"600px"},children:e.jsx(t,{...W,size:"small",value:l,onChange:w})})}});s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{code:`const Default = () => (
  <SearchField
    name="url"
    style={{
      maxWidth: "300px",
    }}
    aria-label="Search"
  />
);
`,...s.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{code:`const Sizes = () => (
  <Flex direction="row" gap="4" style={{ width: "100%", maxWidth: "600px" }}>
    <SearchField size="small" />
    <SearchField size="medium" />
  </Flex>
);
`,...u.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{code:`const DefaultValue = () => <SearchField defaultValue="https://example.com" />;
`,...d.input.parameters?.docs?.source}}};i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{code:`const WithLabel = () => <SearchField label="Label" />;
`,...i.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{code:`const WithDescription = () => <SearchField description="Description" />;
`,...p.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{code:`const Required = () => <SearchField isRequired />;
`,...m.input.parameters?.docs?.source}}};h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{code:`const Disabled = () => <SearchField isDisabled />;
`,...h.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{code:`const WithIcon = () => (
  <SearchField placeholder="Enter a URL" size="small" icon={<RiEBike2Line />} />
);
`,...c.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{code:`const DisabledWithIcon = () => <SearchField isDisabled />;
`,...g.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{code:`const ShowError = () => (
  <Form validationErrors={{ url: "Invalid URL" }}>
    <SearchField />
  </Form>
);
`,...x.input.parameters?.docs?.source}}};b.input.parameters={...b.input.parameters,docs:{...b.input.parameters?.docs,source:{code:`const Validation = () => (
  <SearchField validate={(value) => (value === "admin" ? "Nice try!" : null)} />
);
`,...b.input.parameters?.docs?.source}}};S.input.parameters={...S.input.parameters,docs:{...S.input.parameters?.docs,source:{code:`const CustomField = () => (
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
`,...S.input.parameters?.docs?.source}}};n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{code:`const StartCollapsed = () => (
  <Flex direction="column" gap="4">
    <Flex direction="row" gap="4">
      <SearchField startCollapsed size="small" />
      <SearchField startCollapsed size="medium" />
    </Flex>
    <SearchField startCollapsed size="small" />
  </Flex>
);
`,...n.input.parameters?.docs?.source}}};F.input.parameters={...F.input.parameters,docs:{...F.input.parameters?.docs,source:{code:`const StartCollapsedWithValue = () => (
  <SearchField defaultValue="https://example.com" size="small" />
);
`,...F.input.parameters?.docs?.source}}};y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{code:`const InHeader = (args) => (
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
`,...C.input.parameters?.docs?.source}}};f.input.parameters={...f.input.parameters,docs:{...f.input.parameters?.docs,source:{code:`const StartCollapsedWithButtons = () => (
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
`,...f.input.parameters?.docs?.source}}};z.input.parameters={...z.input.parameters,docs:{...z.input.parameters?.docs,source:{code:`const StartCollapsedWithOnChange = () => {
  const handleChange = (value: string) => {
    console.log("Search value:", value);
  };

  return (
    <Flex direction="row" gap="2" style={{ width: "100%", maxWidth: "600px" }}>
      <SearchField onChange={handleChange} size="small" />
    </Flex>
  );
};
`,...z.input.parameters?.docs?.source}}};v.input.parameters={...v.input.parameters,docs:{...v.input.parameters?.docs,source:{code:`const StartCollapsedControlledEmpty = () => {
  const [value, setValue] = useState("");

  return (
    <Flex direction="row" gap="2" style={{ width: "100%", maxWidth: "600px" }}>
      <SearchField size="small" value={value} onChange={setValue} />
    </Flex>
  );
};
`,...v.input.parameters?.docs?.source}}};j.input.parameters={...j.input.parameters,docs:{...j.input.parameters?.docs,source:{code:`const StartCollapsedControlledWithValue = () => {
  const [value, setValue] = useState("Component");

  return (
    <Flex direction="row" gap="2" style={{ width: "100%", maxWidth: "600px" }}>
      <SearchField size="small" value={value} onChange={setValue} />
    </Flex>
  );
};
`,...j.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    name: 'url',
    style: {
      maxWidth: '300px'
    },
    'aria-label': 'Search'
  }
})`,...s.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...u.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    defaultValue: 'https://example.com'
  }
})`,...d.input.parameters?.docs?.source}}};i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    label: 'Label'
  }
})`,...i.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    description: 'Description'
  }
})`,...p.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    isRequired: true
  }
})`,...m.input.parameters?.docs?.source}}};h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    isDisabled: true
  }
})`,...h.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: args => <SearchField {...args} placeholder="Enter a URL" size="small" icon={<RiEBike2Line />} />
})`,...c.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithIcon.input.args,
    isDisabled: true
  }
})`,...g.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args
  },
  render: args => <Form validationErrors={{
    url: 'Invalid URL'
  }}>
      <SearchField {...args} />
    </Form>
})`,...x.input.parameters?.docs?.source}}};b.input.parameters={...b.input.parameters,docs:{...b.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    validate: value => value === 'admin' ? 'Nice try!' : null
  }
})`,...b.input.parameters?.docs?.source}}};S.input.parameters={...S.input.parameters,docs:{...S.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <>
      <FieldLabel htmlFor="custom-field" id="custom-field-label" label="Custom Field" />
      <SearchField id="custom-field" aria-labelledby="custom-field-label" name="custom-field" defaultValue="Custom Field" />
    </>
})`,...S.input.parameters?.docs?.source}}};n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...n.input.parameters?.docs?.source}}};F.input.parameters={...F.input.parameters,docs:{...F.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...StartCollapsed.input.args,
    defaultValue: 'https://example.com'
  },
  render: args => <SearchField {...args} size="small" />
})`,...F.input.parameters?.docs?.source}}};y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...C.input.parameters?.docs?.source}}};f.input.parameters={...f.input.parameters,docs:{...f.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...f.input.parameters?.docs?.source}}};z.input.parameters={...z.input.parameters,docs:{...z.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...z.input.parameters?.docs?.source}}};v.input.parameters={...v.input.parameters,docs:{...v.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...v.input.parameters?.docs?.source}}};j.input.parameters={...j.input.parameters,docs:{...j.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...j.input.parameters?.docs?.source}}};const na=["Default","Sizes","DefaultValue","WithLabel","WithDescription","Required","Disabled","WithIcon","DisabledWithIcon","ShowError","Validation","CustomField","StartCollapsed","StartCollapsedWithValue","InHeader","StartCollapsedInHeader","StartCollapsedWithButtons","StartCollapsedWithOnChange","StartCollapsedControlledEmpty","StartCollapsedControlledWithValue"];export{S as CustomField,s as Default,d as DefaultValue,h as Disabled,g as DisabledWithIcon,y as InHeader,m as Required,x as ShowError,u as Sizes,n as StartCollapsed,v as StartCollapsedControlledEmpty,j as StartCollapsedControlledWithValue,C as StartCollapsedInHeader,f as StartCollapsedWithButtons,z as StartCollapsedWithOnChange,F as StartCollapsedWithValue,b as Validation,p as WithDescription,c as WithIcon,i as WithLabel,na as __namedExportsOrder};
