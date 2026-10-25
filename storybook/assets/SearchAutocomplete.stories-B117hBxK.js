import{aN as z,aO as _,r as s,j as e,aQ as G,B as Z,aR as K,M as Q,p as U}from"./iframe-CMSX-Slv.js";import{f as J,g as X,$ as Y}from"./Dialog-Fw8yCkvG.js";import{a as ee}from"./Autocomplete-QSoLsmg6.js";import{$ as te}from"./Button-C89HVwFt.js";import{$ as ae}from"./Input-Cw-knjtb.js";import{$ as re,a as ie}from"./ListBox-B_Wi1ZMb.js";import{$ as oe}from"./SearchField-BXu4aPO1.js";import{a as ne}from"./useOverlayTriggerState-u57ke4k2.js";import{Z as se,A as le,d as N}from"./index-DnnZFGoL.js";import{V as ue}from"./VisuallyHidden-BynRym6m.js";import{P as ce}from"./PluginHeader-2O5WOgUJ.js";import{B}from"./ButtonIcon-DN3nNPiF.js";import{T as c}from"./Text-C7y2DDeV.js";import{F as O}from"./Flex-CKptG5Oa.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-lN068qtb.js";import"./useObjectRef-BtQagX3Q.js";import"./Heading-Dia6c8Ve.js";import"./useCollection-C55LZDbY.js";import"./useFocusRing-DUZK2ZXK.js";import"./openLink-p0OhMCOD.js";import"./Hidden-kIQntXwy.js";import"./keyboard-DZQobsnO.js";import"./getMetaValue-DyXwXlFD.js";import"./FocusScope-hnaFZs9t.js";import"./useEvent-BikmhAJg.js";import"./I18nProvider-B2rLmNuT.js";import"./usePress-BzSNyydx.js";import"./textSelection-CwsB_5f_.js";import"./useControlledState-DUMTY9Yj.js";import"./useLoadMoreSentinel-CTkpujsH.js";import"./SelectionIndicator-B0WiXYe-.js";import"./Text-CcBkJcX0.js";import"./useLocalizedStringFormatter-DNWACNIN.js";import"./useHover-D7owYt-e.js";import"./useLabels-B9A8JaNL.js";import"./VisuallyHidden-BP5VTP-I.js";import"./animation-rB_Nrf2Y.js";import"./Label-QJ7mfr_v.js";import"./useLabel-BoN1kqrs.js";import"./number-gVXFFl9I.js";import"./useButton-C_sygl1c.js";import"./useListState-DfNyrXkH.js";import"./FieldError-BqVen_RV.js";import"./Form-Bo24afV9.js";import"./useFormValidation-CxDn_wUg.js";import"./useTextField-Drkqegd4.js";import"./useField-B0e6CrK8.js";import"./useFormReset-CIL9IUM3.js";import"./Link-DRGUXBWJ.js";import"./useLink-wIHaApio.js";import"./Menu-BkgF4e0R.js";import"./Virtualizer-C1udpvcD.js";import"./useFilter-BpAAqLEH.js";import"./getNodeText-COCAFKSu.js";import"./Link-BcGMghtF.js";import"./useResolvedHref-CvdgPikl.js";import"./Tooltip-Dd1GWXAA.js";import"./Tabs-BYoZkzz0.js";import"./useHasTabbableChild-CXWmGR35.js";const F={"bui-SearchAutocomplete":"_bui-SearchAutocomplete_b3w4i_20","bui-SearchAutocompleteSearchField":"_bui-SearchAutocompleteSearchField_b3w4i_55","bui-SearchAutocompleteInput":"_bui-SearchAutocompleteInput_b3w4i_83","bui-SearchAutocompleteClear":"_bui-SearchAutocompleteClear_b3w4i_110","bui-SearchAutocompletePopover":"_bui-SearchAutocompletePopover_b3w4i_134","bui-SearchAutocompleteInner":"_bui-SearchAutocompleteInner_b3w4i_163","bui-SearchAutocompleteListBox":"_bui-SearchAutocompleteListBox_b3w4i_171","bui-SearchAutocompleteItem":"_bui-SearchAutocompleteItem_b3w4i_184","bui-SearchAutocompleteItemContent":"_bui-SearchAutocompleteItemContent_b3w4i_197","bui-SearchAutocompleteLoadingState":"_bui-SearchAutocompleteLoadingState_b3w4i_219","bui-SearchAutocompleteEmptyState":"_bui-SearchAutocompleteEmptyState_b3w4i_220"},k=z()({styles:F,bg:"consumer",classNames:{root:"bui-SearchAutocomplete",searchField:"bui-SearchAutocompleteSearchField",searchFieldInput:"bui-SearchAutocompleteInput",searchFieldClear:"bui-SearchAutocompleteClear",popover:"bui-SearchAutocompletePopover",inner:"bui-SearchAutocompleteInner",listBox:"bui-SearchAutocompleteListBox",loadingState:"bui-SearchAutocompleteLoadingState",emptyState:"bui-SearchAutocompleteEmptyState"},propDefs:{"aria-label":{},"aria-labelledby":{},size:{dataAttribute:!0,default:"small"},placeholder:{default:"Search"},inputValue:{},onInputChange:{},popoverWidth:{},popoverPlacement:{},children:{},isLoading:{},defaultOpen:{},className:{},style:{}}}),pe=z()({styles:F,classNames:{root:"bui-SearchAutocompleteItem",itemContent:"bui-SearchAutocompleteItemContent"},navigation:{type:"anchor"},propDefs:{children:{},className:{}}}),de=()=>{const{ownProps:n}=_(k,{});return e.jsx("div",{className:n.classes.emptyState,children:"No results found."})};function u(n){const{ownProps:i,dataAttributes:a}=_(k,n),{classes:r,"aria-label":o,"aria-labelledby":t,inputValue:f,onInputChange:l,placeholder:d,popoverWidth:b,popoverPlacement:q="bottom start",children:$,isLoading:g,defaultOpen:D,style:E}=i,T=s.useRef(null),P=s.useRef(null),W=!!f,H=s.Children.count($)>0;let R="";g?R="Searching":W&&!H&&(R="No results found");const S=ne({defaultOpen:D});return J({ref:P,onInteractOutside:x=>{const M=x.target;T.current?.contains(M)||S.close()},isDisabled:!S.isOpen}),e.jsx(X.Provider,{value:S,children:e.jsxs(ee,{inputValue:f,onInputChange:x=>{l?.(x),x?S.open():S.close()},children:[e.jsx(oe,{className:r.searchField,"aria-label":o??(t?void 0:d),"aria-labelledby":t,"data-size":a["data-size"],onKeyDown:x=>{x.key==="Enter"&&!S.isOpen&&W&&(x.preventDefault(),S.open())},children:e.jsxs("div",{ref:T,className:r.root,...a,style:E,children:[e.jsx("div",{"aria-hidden":"true",children:e.jsx(se,{})}),e.jsx(ae,{className:r.searchFieldInput,placeholder:d}),e.jsx(te,{className:r.searchFieldClear,style:{visibility:W?"visible":"hidden"},children:e.jsx(le,{})})]})}),e.jsx(Y,{ref:P,className:r.popover,triggerRef:T,isNonModal:!0,placement:q,...b?{style:{width:b}}:{},children:e.jsx(G,{children:e.jsx(Z,{bg:"neutral",className:r.inner,children:e.jsx(re,{className:r.listBox,autoFocus:"first",shouldFocusOnHover:!0,"aria-busy":g||void 0,"data-stale":g||void 0,renderEmptyState:()=>g?e.jsx("div",{className:r.loadingState,children:"Searching..."}):e.jsx(de,{}),onAction:()=>{S.close()},children:$})})})}),e.jsx(ue,{"aria-live":"polite","aria-atomic":"true",children:R})]})})}function me({definitionResult:n,navigation:i}){const{ownProps:a,restProps:r}=n,{classes:o,children:t}=a,f=K(i,r);return e.jsx(ie,{textValue:typeof t=="string"?t:void 0,className:o.root,...r,...f,children:e.jsx("div",{className:o.itemContent,children:t})})}function p(n){const i=_(pe,n),a=i.navigation;return e.jsx(a,{props:i.restProps,view:me,viewProps:{definitionResult:i}})}u.__docgenInfo={description:`A search input that shows a dropdown list of suggestions as the user types, with loading and empty states.

@public`,methods:[],displayName:"SearchAutocomplete",props:{inputValue:{required:!1,tsType:{name:"string"},description:"The current value of the search input (controlled)."},onInputChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: string) => void",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"void"}}},description:"Handler called when the search input value changes."},size:{required:!1,tsType:{name:"union",raw:"'small' | 'medium' | Partial<Record<Breakpoint, 'small' | 'medium'>>",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]}],raw:"Record<Breakpoint, 'small' | 'medium'>"}],raw:"Partial<Record<Breakpoint, 'small' | 'medium'>>"}]},description:`The size of the search input.
@defaultValue 'small'`},"aria-label":{required:!1,tsType:{name:"string"},description:"Accessible label for the search input."},"aria-labelledby":{required:!1,tsType:{name:"string"},description:"ID of the element that labels the search input."},placeholder:{required:!1,tsType:{name:"string"},description:"The placeholder text for the search input."},popoverWidth:{required:!1,tsType:{name:"string"},description:`Width of the results popover. Accepts any CSS width value.
When not set, the popover matches the input width.`},popoverPlacement:{required:!1,tsType:{name:"AriaPopoverProps['placement']",raw:"AriaPopoverProps['placement']"},description:`Placement of the results popover relative to the input.
@defaultValue 'bottom start'`},children:{required:!1,tsType:{name:"ReactNode"},description:"The result items to render inside the autocomplete."},isLoading:{required:!1,tsType:{name:"boolean"},description:`Whether results are currently loading.
When true, displays a loading indicator and announces the loading state to screen readers.`},defaultOpen:{required:!1,tsType:{name:"boolean"},description:"Whether the results popover is open by default."},className:{required:!1,tsType:{name:"string"},description:""},style:{required:!1,tsType:{name:"ReactCSSProperties",raw:"React.CSSProperties"},description:""}}};p.__docgenInfo={description:`An individual option item within a SearchAutocomplete dropdown.

@public`,methods:[],displayName:"SearchAutocompleteItem",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""},className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const m=U.meta({title:"Backstage UI/SearchAutocomplete",component:u,argTypes:{size:{control:"select",options:["small","medium"]},placeholder:{control:"text"},popoverWidth:{control:"text"}}}),h=[{id:"apple",name:"Apple",description:"A round fruit"},{id:"banana",name:"Banana",description:"A yellow curved fruit"},{id:"blueberry",name:"Blueberry",description:"A small blue berry"},{id:"cherry",name:"Cherry",description:"A small red stone fruit"},{id:"grape",name:"Grape",description:"Grows in clusters on vines"},{id:"lemon",name:"Lemon",description:"A sour yellow citrus fruit"},{id:"mango",name:"Mango",description:"A tropical stone fruit"},{id:"orange",name:"Orange",description:"A citrus fruit"},{id:"peach",name:"Peach",description:"A fuzzy stone fruit"},{id:"strawberry",name:"Strawberry",description:"A red fruit with seeds on its surface"}],y=m.story({args:{"aria-label":"Search fruits",placeholder:"Search fruits...",style:{maxWidth:"300px"}},render:function(i){const[a,r]=s.useState(""),o=h.filter(t=>t.name.toLowerCase().includes(a.toLowerCase()));return e.jsx(u,{...i,inputValue:a,onInputChange:r,children:o.map(t=>e.jsx(p,{id:t.id,textValue:t.name,children:t.name},t.id))})}}),A=m.story({args:{"aria-label":"Search fruits",placeholder:"Search fruits...",style:{maxWidth:"300px"}},render:function(i){const[a,r]=s.useState(""),o=h.filter(t=>t.name.toLowerCase().includes(a.toLowerCase()));return e.jsx(u,{...i,inputValue:a,onInputChange:r,children:o.map(t=>e.jsxs(p,{id:t.id,textValue:t.name,children:[e.jsx(c,{weight:"bold",children:t.name}),e.jsx(c,{variant:"body-small",color:"secondary",children:t.description})]},t.id))})}}),I=m.story({args:{"aria-label":"Search fruits",placeholder:"Search fruits...",style:{maxWidth:"300px"}},render:function(i){const[a,r]=s.useState(""),[o,t]=s.useState([]),[f,l]=s.useState(!1);return s.useEffect(()=>{if(!a){t([]);return}l(!0);const d=setTimeout(()=>{t(h.filter(b=>b.name.toLowerCase().includes(a.toLowerCase()))),l(!1)},2e3);return()=>clearTimeout(d)},[a]),e.jsx(u,{...i,inputValue:a,onInputChange:r,isLoading:f,children:o.map(d=>e.jsxs(p,{id:d.id,textValue:d.name,children:[e.jsx(c,{weight:"bold",children:d.name}),e.jsx(c,{variant:"body-small",color:"secondary",children:d.description})]},d.id))})}}),V=m.story({args:{"aria-label":"Search fruits",placeholder:"Search fruits...",style:{maxWidth:"300px"}},render:function(i){const[a,r]=s.useState(""),[o,t]=s.useState(null),f=h.filter(l=>l.name.toLowerCase().includes(a.toLowerCase()));return e.jsxs(O,{direction:"column",gap:"4",children:[e.jsx(u,{...i,inputValue:a,onInputChange:r,children:f.map(l=>e.jsx(p,{id:l.id,textValue:l.name,onAction:()=>{t(l.name),r("")},children:l.name},l.id))}),e.jsxs(c,{children:["Last selected: ",o??"none"]})]})}}),w=m.story({args:{"aria-label":"Search",placeholder:"Search..."},render:function(i){const[a,r]=s.useState(""),o=h.filter(t=>t.name.toLowerCase().includes(a.toLowerCase()));return e.jsxs(O,{direction:"row",gap:"4",style:{width:"100%",maxWidth:"600px"},children:[e.jsx(u,{...i,size:"small",inputValue:a,onInputChange:r,children:o.map(t=>e.jsx(p,{id:t.id,textValue:t.name,children:t.name},t.id))}),e.jsx(u,{...i,size:"medium",inputValue:a,onInputChange:r,children:o.map(t=>e.jsx(p,{id:t.id,textValue:t.name,children:t.name},t.id))})]})}}),v=m.story({args:{"aria-label":"Search",placeholder:"Search..."},decorators:[n=>e.jsx(Q,{children:e.jsx(n,{})})],render:function(i){const[a,r]=s.useState(""),o=h.filter(t=>t.name.toLowerCase().includes(a.toLowerCase()));return e.jsx(ce,{title:"Title",customActions:e.jsxs(e.Fragment,{children:[e.jsx(B,{"aria-label":"Cactus icon button",icon:e.jsx(N,{}),size:"small",variant:"secondary"}),e.jsx(u,{...i,size:"small",inputValue:a,onInputChange:r,popoverWidth:"400px",children:o.map(t=>e.jsx(p,{id:t.id,textValue:t.name,children:t.name},t.id))}),e.jsx(B,{"aria-label":"Cactus icon button",icon:e.jsx(N,{}),size:"small",variant:"secondary"})]})})}}),C=m.story({args:{"aria-label":"Search fruits",placeholder:"Search fruits...",popoverWidth:"500px",style:{maxWidth:"300px"}},render:function(i){const[a,r]=s.useState(""),o=h.filter(t=>t.name.toLowerCase().includes(a.toLowerCase()));return e.jsx(u,{...i,inputValue:a,onInputChange:r,children:o.map(t=>e.jsxs(p,{id:t.id,textValue:t.name,children:[e.jsx(c,{weight:"bold",children:t.name}),e.jsx(c,{variant:"body-small",color:"secondary",children:t.description})]},t.id))})}}),j=m.story({args:{"aria-label":"Search fruits",placeholder:"Search fruits...",defaultOpen:!0,style:{maxWidth:"300px"}},render:function(i){const[a,r]=s.useState("ap"),o=h.filter(t=>t.name.toLowerCase().includes(a.toLowerCase()));return e.jsx(u,{...i,inputValue:a,onInputChange:r,children:o.map(t=>e.jsxs(p,{id:t.id,textValue:t.name,children:[e.jsx(c,{weight:"bold",children:t.name}),e.jsx(c,{variant:"body-small",color:"secondary",children:t.description})]},t.id))})}}),L=m.story({args:{"aria-label":"Search fruits",placeholder:"Search fruits...",defaultOpen:!0,isLoading:!0,inputValue:"ap",style:{maxWidth:"300px"}},render:function(i){return e.jsx(u,{...i,onInputChange:()=>{},children:h.slice(0,3).map(a=>e.jsxs(p,{id:a.id,textValue:a.name,children:[e.jsx(c,{weight:"bold",children:a.name}),e.jsx(c,{variant:"body-small",color:"secondary",children:a.description})]},a.id))})}});y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    'aria-label': 'Search fruits',
    placeholder: 'Search fruits...',
    style: {
      maxWidth: '300px'
    }
  },
  render: function Render(args) {
    const [inputValue, setInputValue] = useState('');
    const filtered = fruits.filter(fruit => fruit.name.toLowerCase().includes(inputValue.toLowerCase()));
    return <SearchAutocomplete {...args} inputValue={inputValue} onInputChange={setInputValue}>
        {filtered.map(fruit => <SearchAutocompleteItem key={fruit.id} id={fruit.id} textValue={fruit.name}>
            {fruit.name}
          </SearchAutocompleteItem>)}
      </SearchAutocomplete>;
  }
})`,...y.input.parameters?.docs?.source}}};A.input.parameters={...A.input.parameters,docs:{...A.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    'aria-label': 'Search fruits',
    placeholder: 'Search fruits...',
    style: {
      maxWidth: '300px'
    }
  },
  render: function Render(args) {
    const [inputValue, setInputValue] = useState('');
    const filtered = fruits.filter(fruit => fruit.name.toLowerCase().includes(inputValue.toLowerCase()));
    return <SearchAutocomplete {...args} inputValue={inputValue} onInputChange={setInputValue}>
        {filtered.map(fruit => <SearchAutocompleteItem key={fruit.id} id={fruit.id} textValue={fruit.name}>
            <Text weight="bold">{fruit.name}</Text>
            <Text variant="body-small" color="secondary">
              {fruit.description}
            </Text>
          </SearchAutocompleteItem>)}
      </SearchAutocomplete>;
  }
})`,...A.input.parameters?.docs?.source}}};I.input.parameters={...I.input.parameters,docs:{...I.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    'aria-label': 'Search fruits',
    placeholder: 'Search fruits...',
    style: {
      maxWidth: '300px'
    }
  },
  render: function Render(args) {
    const [inputValue, setInputValue] = useState('');
    const [items, setItems] = useState<typeof fruits>([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
      if (!inputValue) {
        setItems([]);
        return undefined;
      }
      setIsLoading(true);
      const timeout = setTimeout(() => {
        setItems(fruits.filter(fruit => fruit.name.toLowerCase().includes(inputValue.toLowerCase())));
        setIsLoading(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }, [inputValue]);
    return <SearchAutocomplete {...args} inputValue={inputValue} onInputChange={setInputValue} isLoading={isLoading}>
        {items.map(item => <SearchAutocompleteItem key={item.id} id={item.id} textValue={item.name}>
            <Text weight="bold">{item.name}</Text>
            <Text variant="body-small" color="secondary">
              {item.description}
            </Text>
          </SearchAutocompleteItem>)}
      </SearchAutocomplete>;
  }
})`,...I.input.parameters?.docs?.source}}};V.input.parameters={...V.input.parameters,docs:{...V.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    'aria-label': 'Search fruits',
    placeholder: 'Search fruits...',
    style: {
      maxWidth: '300px'
    }
  },
  render: function Render(args) {
    const [inputValue, setInputValue] = useState('');
    const [selected, setSelected] = useState<string | null>(null);
    const filtered = fruits.filter(fruit => fruit.name.toLowerCase().includes(inputValue.toLowerCase()));
    return <Flex direction="column" gap="4">
        <SearchAutocomplete {...args} inputValue={inputValue} onInputChange={setInputValue}>
          {filtered.map(fruit => <SearchAutocompleteItem key={fruit.id} id={fruit.id} textValue={fruit.name} onAction={() => {
          setSelected(fruit.name);
          setInputValue('');
        }}>
              {fruit.name}
            </SearchAutocompleteItem>)}
        </SearchAutocomplete>
        <Text>Last selected: {selected ?? 'none'}</Text>
      </Flex>;
  }
})`,...V.input.parameters?.docs?.source}}};w.input.parameters={...w.input.parameters,docs:{...w.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    'aria-label': 'Search',
    placeholder: 'Search...'
  },
  render: function Render(args) {
    const [inputValue, setInputValue] = useState('');
    const filtered = fruits.filter(fruit => fruit.name.toLowerCase().includes(inputValue.toLowerCase()));
    return <Flex direction="row" gap="4" style={{
      width: '100%',
      maxWidth: '600px'
    }}>
        <SearchAutocomplete {...args} size="small" inputValue={inputValue} onInputChange={setInputValue}>
          {filtered.map(fruit => <SearchAutocompleteItem key={fruit.id} id={fruit.id} textValue={fruit.name}>
              {fruit.name}
            </SearchAutocompleteItem>)}
        </SearchAutocomplete>
        <SearchAutocomplete {...args} size="medium" inputValue={inputValue} onInputChange={setInputValue}>
          {filtered.map(fruit => <SearchAutocompleteItem key={fruit.id} id={fruit.id} textValue={fruit.name}>
              {fruit.name}
            </SearchAutocompleteItem>)}
        </SearchAutocomplete>
      </Flex>;
  }
})`,...w.input.parameters?.docs?.source}}};v.input.parameters={...v.input.parameters,docs:{...v.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    'aria-label': 'Search',
    placeholder: 'Search...'
  },
  decorators: [Story => <MemoryRouter>
        <Story />
      </MemoryRouter>],
  render: function Render(args) {
    const [inputValue, setInputValue] = useState('');
    const filtered = fruits.filter(fruit => fruit.name.toLowerCase().includes(inputValue.toLowerCase()));
    return <PluginHeader title="Title" customActions={<>
            <ButtonIcon aria-label="Cactus icon button" icon={<RiCactusLine />} size="small" variant="secondary" />
            <SearchAutocomplete {...args} size="small" inputValue={inputValue} onInputChange={setInputValue} popoverWidth="400px">
              {filtered.map(fruit => <SearchAutocompleteItem key={fruit.id} id={fruit.id} textValue={fruit.name}>
                  {fruit.name}
                </SearchAutocompleteItem>)}
            </SearchAutocomplete>
            <ButtonIcon aria-label="Cactus icon button" icon={<RiCactusLine />} size="small" variant="secondary" />
          </>} />;
  }
})`,...v.input.parameters?.docs?.source}}};C.input.parameters={...C.input.parameters,docs:{...C.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    'aria-label': 'Search fruits',
    placeholder: 'Search fruits...',
    popoverWidth: '500px',
    style: {
      maxWidth: '300px'
    }
  },
  render: function Render(args) {
    const [inputValue, setInputValue] = useState('');
    const filtered = fruits.filter(fruit => fruit.name.toLowerCase().includes(inputValue.toLowerCase()));
    return <SearchAutocomplete {...args} inputValue={inputValue} onInputChange={setInputValue}>
        {filtered.map(fruit => <SearchAutocompleteItem key={fruit.id} id={fruit.id} textValue={fruit.name}>
            <Text weight="bold">{fruit.name}</Text>
            <Text variant="body-small" color="secondary">
              {fruit.description}
            </Text>
          </SearchAutocompleteItem>)}
      </SearchAutocomplete>;
  }
})`,...C.input.parameters?.docs?.source}}};j.input.parameters={...j.input.parameters,docs:{...j.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    'aria-label': 'Search fruits',
    placeholder: 'Search fruits...',
    defaultOpen: true,
    style: {
      maxWidth: '300px'
    }
  },
  render: function Render(args) {
    const [inputValue, setInputValue] = useState('ap');
    const filtered = fruits.filter(fruit => fruit.name.toLowerCase().includes(inputValue.toLowerCase()));
    return <SearchAutocomplete {...args} inputValue={inputValue} onInputChange={setInputValue}>
        {filtered.map(fruit => <SearchAutocompleteItem key={fruit.id} id={fruit.id} textValue={fruit.name}>
            <Text weight="bold">{fruit.name}</Text>
            <Text variant="body-small" color="secondary">
              {fruit.description}
            </Text>
          </SearchAutocompleteItem>)}
      </SearchAutocomplete>;
  }
})`,...j.input.parameters?.docs?.source}}};L.input.parameters={...L.input.parameters,docs:{...L.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    'aria-label': 'Search fruits',
    placeholder: 'Search fruits...',
    defaultOpen: true,
    isLoading: true,
    inputValue: 'ap',
    style: {
      maxWidth: '300px'
    }
  },
  render: function Render(args) {
    return <SearchAutocomplete {...args} onInputChange={() => {}}>
        {fruits.slice(0, 3).map(fruit => <SearchAutocompleteItem key={fruit.id} id={fruit.id} textValue={fruit.name}>
            <Text weight="bold">{fruit.name}</Text>
            <Text variant="body-small" color="secondary">
              {fruit.description}
            </Text>
          </SearchAutocompleteItem>)}
      </SearchAutocomplete>;
  }
})`,...L.input.parameters?.docs?.source}}};const yt=["WithItems","WithRichContent","WithAsyncItems","WithSelection","Sizes","InHeader","WithPopoverWidth","OpenByDefault","OpenWithLoading"];export{v as InHeader,j as OpenByDefault,L as OpenWithLoading,w as Sizes,I as WithAsyncItems,y as WithItems,C as WithPopoverWidth,A as WithRichContent,V as WithSelection,yt as __namedExportsOrder};
