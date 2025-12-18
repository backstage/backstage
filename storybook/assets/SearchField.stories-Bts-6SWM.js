import{r as m,j as e}from"./iframe-BNEamOZA.js";import{$ as le}from"./Button-CniS0S0Y.js";import{$ as oe}from"./Input-Ba7cPzZJ.js";import{$ as ie}from"./SearchField-Ckmdv--Q.js";import{c as h}from"./clsx-B-dksMZM.js";import{Z as ne,A as ce,e as de,f as u}from"./index-CYRXZF_j.js";import{u as me}from"./useStyles-BZ3MWhV2.js";import{F as A}from"./FieldLabel-msacTGzx.js";import{F as ue}from"./FieldError-CVKGMCzs.js";import{$ as pe}from"./Form-XQN7NSwN.js";import{F as d}from"./Flex-1jNIcION.js";import{H as M}from"./Header-NDKGk5qJ.js";import{M as U}from"./index-eWkqxFkm.js";import{B as p}from"./ButtonIcon-BUNduotD.js";import{B as T}from"./Button-DVrmAqGt.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-BdKXg7WC.js";import"./useObjectRef-B7TEzoeg.js";import"./Label-CLu3Zy6z.js";import"./Hidden-Cs1DyCT0.js";import"./useFocusable-DnF-AVgM.js";import"./useLabel-Di7dmV43.js";import"./useLabels-Cntp4pBB.js";import"./context-C1jrLScA.js";import"./usePress-CpqgsrMo.js";import"./useFocusRing-CB06qjJ1.js";import"./useFormReset-CcLWNshh.js";import"./useControlledState-DSlhGfc6.js";import"./Text-DhEdvwSL.js";import"./FieldError-D493rpmH.js";import"./RSPContexts-BzKJ74fa.js";import"./useLocalizedStringFormatter-BUPc8sSu.js";import"./Link-BWP0p6mx.js";import"./useLink-Bwv4PBVu.js";import"./Text-Dqe5fSig.js";import"./Tabs-DVtZ9z3Z.js";import"./useListState-DK2rfubD.js";import"./useEvent-CE7KTVjX.js";import"./SelectionIndicator-CjI20O-B.js";import"./index-JiX37tWT.js";import"./useHasTabbableChild-CCvUlAu1.js";import"./Button.module-BPzqtDAO.js";const he={classNames:{root:"bui-SearchField",clear:"bui-SearchFieldClear",inputWrapper:"bui-SearchFieldInputWrapper",input:"bui-SearchFieldInput",inputIcon:"bui-SearchFieldInputIcon"},dataAttributes:{startCollapsed:[!0,!1],size:["small","medium"]}},g={"bui-SearchField":"_bui-SearchField_1kdj7_20","bui-SearchFieldClear":"_bui-SearchFieldClear_1kdj7_37","bui-SearchFieldInput":"_bui-SearchFieldInput_1kdj7_65","bui-SearchFieldInputWrapper":"_bui-SearchFieldInputWrapper_1kdj7_77","bui-SearchFieldInputIcon":"_bui-SearchFieldInputIcon_1kdj7_128"},r=m.forwardRef((a,n)=>{const{label:o,"aria-label":c,"aria-labelledby":$}=a;m.useEffect(()=>{!o&&!c&&!$&&console.warn("SearchField requires either a visible label, aria-label, or aria-labelledby for accessibility")},[o,c,$]);const{classNames:s,dataAttributes:b,style:P,cleanedProps:O}=me(he,{size:"small",placeholder:"Search",startCollapsed:!1,...a}),{className:Z,description:G,icon:E,isRequired:J,secondaryLabel:K,placeholder:Q,startCollapsed:k,...N}=O,[q,X]=m.useState(!1),S=m.useRef(null),Y=K||(J?"Required":null),ee=H=>{a.onFocusChange?.(H),X(H)},ae=()=>{S.current?.focus()},re=!!S.current,se=!!S.current?.value,te=re?k&&!se&&!q:k&&!N.value&&!N.defaultValue&&!q;return e.jsxs(ie,{className:h(s.root,g[s.root],Z),...b,"aria-label":c,"aria-labelledby":$,"data-collapsed":te,style:P,...N,onFocusChange:ee,ref:n,children:[e.jsx(A,{label:o,secondaryLabel:Y,description:G}),e.jsxs("div",{className:h(s.inputWrapper,g[s.inputWrapper]),"data-size":b["data-size"],onClick:ae,children:[E!==!1&&e.jsx("div",{className:h(s.inputIcon,g[s.inputIcon]),"data-size":b["data-size"],"aria-hidden":"true",children:E||e.jsx(ne,{})}),e.jsx(oe,{ref:S,className:h(s.input,g[s.input]),...E!==!1&&{"data-icon":!0},placeholder:Q}),e.jsx(le,{className:h(s.clear,g[s.clear]),"data-size":b["data-size"],children:e.jsx(ce,{})})]}),e.jsx(ue,{})]})});r.displayName="searchField";r.__docgenInfo={description:"@public",methods:[],displayName:"searchField",props:{icon:{required:!1,tsType:{name:"union",raw:"ReactNode | false",elements:[{name:"ReactNode"},{name:"literal",value:"false"}]},description:"An icon to render before the input"},size:{required:!1,tsType:{name:"union",raw:"'small' | 'medium' | Partial<Record<Breakpoint, 'small' | 'medium'>>",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]}],raw:"Record<Breakpoint, 'small' | 'medium'>"}],raw:"Partial<Record<Breakpoint, 'small' | 'medium'>>"}]},description:`The size of the text field
@defaultValue 'medium'`},placeholder:{required:!1,tsType:{name:"string"},description:"The placeholder text for the input"},startCollapsed:{required:!1,tsType:{name:"boolean"},description:"Controls whether the SearchField starts in a collapsed state."}},composes:["AriaSearchFieldProps","Omit"]};const sa={title:"Backstage UI/SearchField",component:r,argTypes:{isRequired:{control:"boolean"},icon:{control:"object"},placeholder:{control:"text"}}},t={args:{name:"url",style:{maxWidth:"300px"},"aria-label":"Search"}},f={args:{...t.args},render:a=>e.jsxs(d,{direction:"row",gap:"4",style:{width:"100%",maxWidth:"600px"},children:[e.jsx(r,{...a,size:"small"}),e.jsx(r,{...a,size:"medium"})]})},F={args:{...t.args,defaultValue:"https://example.com"}},i={args:{...t.args,label:"Label"}},C={args:{...i.args,description:"Description"}},j={args:{...i.args,isRequired:!0}},y={args:{...t.args,isDisabled:!0}},x={args:{...t.args},render:a=>e.jsx(r,{...a,placeholder:"Enter a URL",size:"small",icon:e.jsx(de,{})})},z={args:{...x.args,isDisabled:!0}},v={args:{...i.args},render:a=>e.jsx(pe,{validationErrors:{url:"Invalid URL"},children:e.jsx(r,{...a})})},W={args:{...i.args,validate:a=>a==="admin"?"Nice try!":null}},R={render:()=>e.jsxs(e.Fragment,{children:[e.jsx(A,{htmlFor:"custom-field",id:"custom-field-label",label:"Custom Field"}),e.jsx(r,{id:"custom-field","aria-labelledby":"custom-field-label",name:"custom-field",defaultValue:"Custom Field"})]})},l={args:{...t.args,startCollapsed:!0},render:a=>e.jsxs(d,{direction:"column",gap:"4",children:[e.jsxs(d,{direction:"row",gap:"4",children:[e.jsx(r,{...a,size:"small"}),e.jsx(r,{...a,size:"medium"})]}),e.jsx(r,{...a,size:"small"})]})},w={args:{...l.args,defaultValue:"https://example.com"},render:a=>e.jsx(r,{...a,size:"small"})},I={decorators:[a=>e.jsx(U,{children:e.jsx(a,{})})],render:a=>e.jsx(e.Fragment,{children:e.jsx(M,{title:"Title",customActions:e.jsxs(e.Fragment,{children:[e.jsx(p,{"aria-label":"Cactus icon button",icon:e.jsx(u,{}),size:"small",variant:"secondary"}),e.jsx(r,{"aria-label":"Search",...a,size:"small"}),e.jsx(p,{"aria-label":"Cactus icon button",icon:e.jsx(u,{}),size:"small",variant:"secondary"})]})})})},L={args:{...l.args},decorators:[a=>e.jsx(U,{children:e.jsx(a,{})})],render:a=>e.jsx(e.Fragment,{children:e.jsx(M,{title:"Title",customActions:e.jsxs(e.Fragment,{children:[e.jsx(p,{"aria-label":"Cactus icon button",icon:e.jsx(u,{}),size:"small",variant:"secondary"}),e.jsx(r,{...a,size:"small"}),e.jsx(p,{"aria-label":"Cactus icon button",icon:e.jsx(u,{}),size:"small",variant:"secondary"})]})})})},D={args:{...l.args},render:a=>e.jsxs(d,{direction:"row",gap:"2",style:{width:"100%",maxWidth:"600px"},children:[e.jsx(r,{...a,size:"small"}),e.jsx(p,{"aria-label":"Cactus icon button",icon:e.jsx(u,{}),size:"small",variant:"secondary"}),e.jsx(T,{size:"small",variant:"secondary",children:"Hello world"}),e.jsx(r,{...a,size:"medium"}),e.jsx(p,{"aria-label":"Cactus icon button",icon:e.jsx(u,{}),size:"medium",variant:"secondary"}),e.jsx(T,{size:"medium",variant:"secondary",children:"Hello world"})]})},V={args:{...l.args},render:a=>{const n=o=>{console.log("Search value:",o)};return e.jsx(d,{direction:"row",gap:"2",style:{width:"100%",maxWidth:"600px"},children:e.jsx(r,{...a,onChange:n,size:"small"})})}},B={args:{...l.args},render:function(n){const[o,c]=m.useState("");return e.jsx(d,{direction:"row",gap:"2",style:{width:"100%",maxWidth:"600px"},children:e.jsx(r,{...n,size:"small",value:o,onChange:c})})}},_={args:{...l.args},render:function(n){const[o,c]=m.useState("Component");return e.jsx(d,{direction:"row",gap:"2",style:{width:"100%",maxWidth:"600px"},children:e.jsx(r,{...n,size:"small",value:o,onChange:c})})}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'url',
    style: {
      maxWidth: '300px'
    },
    'aria-label': 'Search'
  }
}`,...t.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
  },
  render: args => <Flex direction="row" gap="4" style={{
    width: '100%',
    maxWidth: '600px'
  }}>
      <SearchField {...args} size="small" />
      <SearchField {...args} size="medium" />
    </Flex>
}`,...f.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    defaultValue: 'https://example.com'
  }
}`,...F.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    label: 'Label'
  }
}`,...i.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    ...WithLabel.args,
    description: 'Description'
  }
}`,...C.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    ...WithLabel.args,
    isRequired: true
  }
}`,...j.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    isDisabled: true
  }
}`,...y.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
  },
  render: args => <SearchField {...args} placeholder="Enter a URL" size="small" icon={<RiEBike2Line />} />
}`,...x.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    ...WithIcon.args,
    isDisabled: true
  }
}`,...z.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    ...WithLabel.args
  },
  render: args => <Form validationErrors={{
    url: 'Invalid URL'
  }}>
      <SearchField {...args} />
    </Form>
}`,...v.parameters?.docs?.source}}};W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  args: {
    ...WithLabel.args,
    validate: value => value === 'admin' ? 'Nice try!' : null
  }
}`,...W.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  render: () => <>
      <FieldLabel htmlFor="custom-field" id="custom-field-label" label="Custom Field" />
      <SearchField id="custom-field" aria-labelledby="custom-field-label" name="custom-field" defaultValue="Custom Field" />
    </>
}`,...R.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    startCollapsed: true
  },
  render: args => <Flex direction="column" gap="4">
      <Flex direction="row" gap="4">
        <SearchField {...args} size="small" />
        <SearchField {...args} size="medium" />
      </Flex>
      <SearchField {...args} size="small" />
    </Flex>
}`,...l.parameters?.docs?.source}}};w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    ...StartCollapsed.args,
    defaultValue: 'https://example.com'
  },
  render: args => <SearchField {...args} size="small" />
}`,...w.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
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
}`,...I.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    ...StartCollapsed.args
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
}`,...L.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    ...StartCollapsed.args
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
}`,...D.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    ...StartCollapsed.args
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
}`,...V.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    ...StartCollapsed.args
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
}`,...B.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    ...StartCollapsed.args
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
}`,..._.parameters?.docs?.source}}};const ta=["Default","Sizes","DefaultValue","WithLabel","WithDescription","Required","Disabled","WithIcon","DisabledWithIcon","ShowError","Validation","CustomField","StartCollapsed","StartCollapsedWithValue","InHeader","StartCollapsedInHeader","StartCollapsedWithButtons","StartCollapsedWithOnChange","StartCollapsedControlledEmpty","StartCollapsedControlledWithValue"];export{R as CustomField,t as Default,F as DefaultValue,y as Disabled,z as DisabledWithIcon,I as InHeader,j as Required,v as ShowError,f as Sizes,l as StartCollapsed,B as StartCollapsedControlledEmpty,_ as StartCollapsedControlledWithValue,L as StartCollapsedInHeader,D as StartCollapsedWithButtons,V as StartCollapsedWithOnChange,w as StartCollapsedWithValue,W as Validation,C as WithDescription,x as WithIcon,i as WithLabel,ta as __namedExportsOrder,sa as default};
