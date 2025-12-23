import{r as p,j as e,a3 as ne}from"./iframe-Hw755TNi.js";import{$ as oe}from"./Button-DwgHingZ.js";import{$ as le}from"./Input-DUNqwJ3W.js";import{$ as ce}from"./SearchField-Br7esYFm.js";import{c as g}from"./clsx-B-dksMZM.js";import{Z as ue,A as de,e as pe,f as m}from"./index-DEcR4k_l.js";import{u as me}from"./useStyles-B00qSMeS.js";import{F as M}from"./FieldLabel-CW1FdPFl.js";import{F as he}from"./FieldError-CthxFkzO.js";import{$ as ge}from"./Form-CUIRz8F1.js";import{F as d}from"./Flex-qn2HiTG0.js";import{H as U}from"./Header-Dfu0__i5.js";import{M as P}from"./index-CMiNgydu.js";import{B as h}from"./ButtonIcon-B4YQQ6hq.js";import{B as A}from"./Button-DlAT_MrR.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-BUVUUeFt.js";import"./useObjectRef-Cc5_Ey3_.js";import"./Label-CorDF3tZ.js";import"./Hidden-Dbya7mrA.js";import"./useFocusable-m4FGHcow.js";import"./useLabel-NzZqVTci.js";import"./useLabels-Cj-GaSS9.js";import"./context-BGVznzgA.js";import"./usePress-BD667nug.js";import"./useFocusRing-B7_LwlYY.js";import"./useFormReset-BAJhHFtg.js";import"./useControlledState-BXR-fBbB.js";import"./Text-BJjUO6R9.js";import"./FieldError-aOIswKl9.js";import"./RSPContexts-8F24Wau_.js";import"./useLocalizedStringFormatter-CQ5iz0hS.js";import"./Link-BkPBRrmm.js";import"./useLink-FRiP_iGz.js";import"./Text-CsKFcROI.js";import"./Tabs-DXis6cEz.js";import"./useListState-D8JghFOT.js";import"./useEvent-B8Xs39KX.js";import"./SelectionIndicator-2vRnNvSY.js";import"./useHasTabbableChild-D6iY3DAC.js";import"./Button.module-BPzqtDAO.js";const xe={classNames:{root:"bui-SearchField",clear:"bui-SearchFieldClear",inputWrapper:"bui-SearchFieldInputWrapper",input:"bui-SearchFieldInput",inputIcon:"bui-SearchFieldInputIcon"},dataAttributes:{startCollapsed:[!0,!1],size:["small","medium"]}},x={"bui-SearchField":"_bui-SearchField_1kdj7_20","bui-SearchFieldClear":"_bui-SearchFieldClear_1kdj7_37","bui-SearchFieldInput":"_bui-SearchFieldInput_1kdj7_65","bui-SearchFieldInputWrapper":"_bui-SearchFieldInputWrapper_1kdj7_77","bui-SearchFieldInputIcon":"_bui-SearchFieldInputIcon_1kdj7_128"},t=p.forwardRef((a,c)=>{const{label:o,"aria-label":u,"aria-labelledby":E}=a;p.useEffect(()=>{!o&&!u&&!E&&console.warn("SearchField requires either a visible label, aria-label, or aria-labelledby for accessibility")},[o,u,E]);const{classNames:s,dataAttributes:y,style:O,cleanedProps:Z}=me(xe,{size:"small",placeholder:"Search",startCollapsed:!1,...a}),{className:G,description:J,icon:N,isRequired:K,secondaryLabel:Q,placeholder:X,startCollapsed:q,...k}=Z,[H,Y]=p.useState(!1),S=p.useRef(null),ee=Q||(K?"Required":null),ae=T=>{a.onFocusChange?.(T),Y(T)},re=()=>{S.current?.focus()},te=!!S.current,se=!!S.current?.value,ie=te?q&&!se&&!H:q&&!k.value&&!k.defaultValue&&!H;return e.jsxs(ce,{className:g(s.root,x[s.root],G),...y,"aria-label":u,"aria-labelledby":E,"data-collapsed":ie,style:O,...k,onFocusChange:ae,ref:c,children:[e.jsx(M,{label:o,secondaryLabel:ee,description:J}),e.jsxs("div",{className:g(s.inputWrapper,x[s.inputWrapper]),"data-size":y["data-size"],onClick:re,children:[N!==!1&&e.jsx("div",{className:g(s.inputIcon,x[s.inputIcon]),"data-size":y["data-size"],"aria-hidden":"true",children:N||e.jsx(ue,{})}),e.jsx(le,{ref:S,className:g(s.input,x[s.input]),...N!==!1&&{"data-icon":!0},placeholder:X}),e.jsx(oe,{className:g(s.clear,x[s.clear]),"data-size":y["data-size"],children:e.jsx(de,{})})]}),e.jsx(he,{})]})});t.displayName="searchField";t.__docgenInfo={description:"@public",methods:[],displayName:"searchField",props:{icon:{required:!1,tsType:{name:"union",raw:"ReactNode | false",elements:[{name:"ReactNode"},{name:"literal",value:"false"}]},description:"An icon to render before the input"},size:{required:!1,tsType:{name:"union",raw:"'small' | 'medium' | Partial<Record<Breakpoint, 'small' | 'medium'>>",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]}],raw:"Record<Breakpoint, 'small' | 'medium'>"}],raw:"Partial<Record<Breakpoint, 'small' | 'medium'>>"}]},description:`The size of the text field
@defaultValue 'medium'`},placeholder:{required:!1,tsType:{name:"string"},description:"The placeholder text for the input"},startCollapsed:{required:!1,tsType:{name:"boolean"},description:"Controls whether the SearchField starts in a collapsed state."}},composes:["AriaSearchFieldProps","Omit"]};const r=ne.meta({title:"Backstage UI/SearchField",component:t,argTypes:{isRequired:{control:"boolean"},icon:{control:"object"},placeholder:{control:"text"}}}),i=r.story({args:{name:"url",style:{maxWidth:"300px"},"aria-label":"Search"}}),f=r.story({args:{...i.input.args},render:a=>e.jsxs(d,{direction:"row",gap:"4",style:{width:"100%",maxWidth:"600px"},children:[e.jsx(t,{...a,size:"small"}),e.jsx(t,{...a,size:"medium"})]})}),F=r.story({args:{...i.input.args,defaultValue:"https://example.com"}}),l=r.story({args:{...i.input.args,label:"Label"}}),C=r.story({args:{...l.input.args,description:"Description"}}),j=r.story({args:{...l.input.args,isRequired:!0}}),z=r.story({args:{...i.input.args,isDisabled:!0}}),b=r.story({args:{...i.input.args},render:a=>e.jsx(t,{...a,placeholder:"Enter a URL",size:"small",icon:e.jsx(pe,{})})}),v=r.story({args:{...b.input.args,isDisabled:!0}}),W=r.story({args:{...l.input.args},render:a=>e.jsx(ge,{validationErrors:{url:"Invalid URL"},children:e.jsx(t,{...a})})}),w=r.story({args:{...l.input.args,validate:a=>a==="admin"?"Nice try!":null}}),R=r.story({render:()=>e.jsxs(e.Fragment,{children:[e.jsx(M,{htmlFor:"custom-field",id:"custom-field-label",label:"Custom Field"}),e.jsx(t,{id:"custom-field","aria-labelledby":"custom-field-label",name:"custom-field",defaultValue:"Custom Field"})]})}),n=r.story({args:{...i.input.args,startCollapsed:!0},render:a=>e.jsxs(d,{direction:"column",gap:"4",children:[e.jsxs(d,{direction:"row",gap:"4",children:[e.jsx(t,{...a,size:"small"}),e.jsx(t,{...a,size:"medium"})]}),e.jsx(t,{...a,size:"small"})]})}),I=r.story({args:{...n.input.args,defaultValue:"https://example.com"},render:a=>e.jsx(t,{...a,size:"small"})}),L=r.story({decorators:[a=>e.jsx(P,{children:e.jsx(a,{})})],render:a=>e.jsx(e.Fragment,{children:e.jsx(U,{title:"Title",customActions:e.jsxs(e.Fragment,{children:[e.jsx(h,{"aria-label":"Cactus icon button",icon:e.jsx(m,{}),size:"small",variant:"secondary"}),e.jsx(t,{"aria-label":"Search",...a,size:"small"}),e.jsx(h,{"aria-label":"Cactus icon button",icon:e.jsx(m,{}),size:"small",variant:"secondary"})]})})})}),D=r.story({args:{...n.input.args},decorators:[a=>e.jsx(P,{children:e.jsx(a,{})})],render:a=>e.jsx(e.Fragment,{children:e.jsx(U,{title:"Title",customActions:e.jsxs(e.Fragment,{children:[e.jsx(h,{"aria-label":"Cactus icon button",icon:e.jsx(m,{}),size:"small",variant:"secondary"}),e.jsx(t,{...a,size:"small"}),e.jsx(h,{"aria-label":"Cactus icon button",icon:e.jsx(m,{}),size:"small",variant:"secondary"})]})})})}),V=r.story({args:{...n.input.args},render:a=>e.jsxs(d,{direction:"row",gap:"2",style:{width:"100%",maxWidth:"600px"},children:[e.jsx(t,{...a,size:"small"}),e.jsx(h,{"aria-label":"Cactus icon button",icon:e.jsx(m,{}),size:"small",variant:"secondary"}),e.jsx(A,{size:"small",variant:"secondary",children:"Hello world"}),e.jsx(t,{...a,size:"medium"}),e.jsx(h,{"aria-label":"Cactus icon button",icon:e.jsx(m,{}),size:"medium",variant:"secondary"}),e.jsx(A,{size:"medium",variant:"secondary",children:"Hello world"})]})}),B=r.story({args:{...n.input.args},render:a=>{const c=o=>{console.log("Search value:",o)};return e.jsx(d,{direction:"row",gap:"2",style:{width:"100%",maxWidth:"600px"},children:e.jsx(t,{...a,onChange:c,size:"small"})})}}),_=r.story({args:{...n.input.args},render:function(c){const[o,u]=p.useState("");return e.jsx(d,{direction:"row",gap:"2",style:{width:"100%",maxWidth:"600px"},children:e.jsx(t,{...c,size:"small",value:o,onChange:u})})}}),$=r.story({args:{...n.input.args},render:function(c){const[o,u]=p.useState("Component");return e.jsx(d,{direction:"row",gap:"2",style:{width:"100%",maxWidth:"600px"},children:e.jsx(t,{...c,size:"small",value:o,onChange:u})})}});i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    name: 'url',
    style: {
      maxWidth: '300px'
    },
    'aria-label': 'Search'
  }
})`,...i.input.parameters?.docs?.source}}};f.input.parameters={...f.input.parameters,docs:{...f.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...f.input.parameters?.docs?.source}}};F.input.parameters={...F.input.parameters,docs:{...F.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    defaultValue: 'https://example.com'
  }
})`,...F.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    label: 'Label'
  }
})`,...l.input.parameters?.docs?.source}}};C.input.parameters={...C.input.parameters,docs:{...C.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    description: 'Description'
  }
})`,...C.input.parameters?.docs?.source}}};j.input.parameters={...j.input.parameters,docs:{...j.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    isRequired: true
  }
})`,...j.input.parameters?.docs?.source}}};z.input.parameters={...z.input.parameters,docs:{...z.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    isDisabled: true
  }
})`,...z.input.parameters?.docs?.source}}};b.input.parameters={...b.input.parameters,docs:{...b.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: args => <SearchField {...args} placeholder="Enter a URL" size="small" icon={<RiEBike2Line />} />
})`,...b.input.parameters?.docs?.source}}};v.input.parameters={...v.input.parameters,docs:{...v.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithIcon.input.args,
    isDisabled: true
  }
})`,...v.input.parameters?.docs?.source}}};W.input.parameters={...W.input.parameters,docs:{...W.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args
  },
  render: args => <Form validationErrors={{
    url: 'Invalid URL'
  }}>
      <SearchField {...args} />
    </Form>
})`,...W.input.parameters?.docs?.source}}};w.input.parameters={...w.input.parameters,docs:{...w.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    validate: value => value === 'admin' ? 'Nice try!' : null
  }
})`,...w.input.parameters?.docs?.source}}};R.input.parameters={...R.input.parameters,docs:{...R.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <>
      <FieldLabel htmlFor="custom-field" id="custom-field-label" label="Custom Field" />
      <SearchField id="custom-field" aria-labelledby="custom-field-label" name="custom-field" defaultValue="Custom Field" />
    </>
})`,...R.input.parameters?.docs?.source}}};n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...n.input.parameters?.docs?.source}}};I.input.parameters={...I.input.parameters,docs:{...I.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...StartCollapsed.input.args,
    defaultValue: 'https://example.com'
  },
  render: args => <SearchField {...args} size="small" />
})`,...I.input.parameters?.docs?.source}}};L.input.parameters={...L.input.parameters,docs:{...L.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...L.input.parameters?.docs?.source}}};D.input.parameters={...D.input.parameters,docs:{...D.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...D.input.parameters?.docs?.source}}};V.input.parameters={...V.input.parameters,docs:{...V.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...V.input.parameters?.docs?.source}}};B.input.parameters={...B.input.parameters,docs:{...B.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...B.input.parameters?.docs?.source}}};_.input.parameters={..._.input.parameters,docs:{..._.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,..._.input.parameters?.docs?.source}}};$.input.parameters={...$.input.parameters,docs:{...$.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...$.input.parameters?.docs?.source}}};const sa=["Default","Sizes","DefaultValue","WithLabel","WithDescription","Required","Disabled","WithIcon","DisabledWithIcon","ShowError","Validation","CustomField","StartCollapsed","StartCollapsedWithValue","InHeader","StartCollapsedInHeader","StartCollapsedWithButtons","StartCollapsedWithOnChange","StartCollapsedControlledEmpty","StartCollapsedControlledWithValue"];export{R as CustomField,i as Default,F as DefaultValue,z as Disabled,v as DisabledWithIcon,L as InHeader,j as Required,W as ShowError,f as Sizes,n as StartCollapsed,_ as StartCollapsedControlledEmpty,$ as StartCollapsedControlledWithValue,D as StartCollapsedInHeader,V as StartCollapsedWithButtons,B as StartCollapsedWithOnChange,I as StartCollapsedWithValue,w as Validation,C as WithDescription,b as WithIcon,l as WithLabel,sa as __namedExportsOrder};
