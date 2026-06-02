import{bg as B,cH as _,ca as s,bR as e,h as G,i as Z,w as K,c7 as U}from"./iframe-DogXi1kP.js";import{m as J,r as Q,g as X}from"./Dialog-CuUASSK4.js";import{$ as Y}from"./Autocomplete-DYW-F-Tj.js";import{b as ee}from"./Button-Fh9tm360.js";import{c as te}from"./Input-BStAHKnh.js";import{a as ae,d as re}from"./ListBox-CpFc4rcf.js";import{$ as ie}from"./SearchField-bPygfAon.js";import{f as oe}from"./useOverlayTriggerState-NZ_YQKiz.js";import{Z as ne,A as se,e as N}from"./index-RV6Ph9vd.js";import{V as le}from"./VisuallyHidden-CMhaGwvP.js";import{P as ue}from"./PluginHeader-B3UhAP7o.js";import{B as z}from"./ButtonIcon-C7uVqlJx.js";import{T as c}from"./Text-BbRcKCRf.js";import{F}from"./Flex-Bi-SKTgz.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-AxfqVSE9.js";import"./useObjectRef-UHrM_yCs.js";import"./Heading-CeGRyyrD.js";import"./useCollection-D7sNZtry.js";import"./useFocusRing-mENG_ikp.js";import"./openLink-CxuZpafj.js";import"./Hidden-CYdnfqbh.js";import"./keyboard-a1n3wmz-.js";import"./FocusScope-C_GT869N.js";import"./useEvent-EwjaUY4k.js";import"./I18nProvider-Cag9fozJ.js";import"./usePress-PepYZ5yJ.js";import"./textSelection-QdGxsqrV.js";import"./useControlledState-CrzRLYRc.js";import"./getItemCount-C0QHxlzQ.js";import"./Text-BRIb-OAb.js";import"./useLocalizedStringFormatter-CfgpiWB3.js";import"./useHover-ox9S2Piy.js";import"./useLabels-DnC-SBWU.js";import"./VisuallyHidden-BwKEPC3N.js";import"./animation-NVFnR0bW.js";import"./Label-BT3yvL3F.js";import"./useLabel-DvnqIlMC.js";import"./number-C2ZI7feN.js";import"./useButton-C2CjCUzA.js";import"./useListState-Y13CpHKJ.js";import"./FieldError-CzpSx-Mx.js";import"./useFormValidation-BIYlJHZ1.js";import"./useTextField-D7_hM5Yb.js";import"./useField-DTPdncVL.js";import"./useFormReset-CXIeSoiQ.js";import"./Link-D1uGA1pu.js";import"./useLink-C5PjbgXa.js";import"./useResolvedHref-BFQ7w248.js";import"./getNodeText-8Y9Za0Fs.js";import"./Tabs-Ur9XWUll.js";import"./useHasTabbableChild-Dlx45nME.js";const O={"bui-SearchAutocomplete":"_bui-SearchAutocomplete_8wg5e_20","bui-SearchAutocompleteSearchField":"_bui-SearchAutocompleteSearchField_8wg5e_55","bui-SearchAutocompleteInput":"_bui-SearchAutocompleteInput_8wg5e_83","bui-SearchAutocompleteClear":"_bui-SearchAutocompleteClear_8wg5e_109","bui-SearchAutocompletePopover":"_bui-SearchAutocompletePopover_8wg5e_133","bui-SearchAutocompleteInner":"_bui-SearchAutocompleteInner_8wg5e_162","bui-SearchAutocompleteListBox":"_bui-SearchAutocompleteListBox_8wg5e_170","bui-SearchAutocompleteItem":"_bui-SearchAutocompleteItem_8wg5e_183","bui-SearchAutocompleteItemContent":"_bui-SearchAutocompleteItemContent_8wg5e_196","bui-SearchAutocompleteLoadingState":"_bui-SearchAutocompleteLoadingState_8wg5e_217","bui-SearchAutocompleteEmptyState":"_bui-SearchAutocompleteEmptyState_8wg5e_218"},k=B()({styles:O,bg:"consumer",classNames:{root:"bui-SearchAutocomplete",searchField:"bui-SearchAutocompleteSearchField",searchFieldInput:"bui-SearchAutocompleteInput",searchFieldClear:"bui-SearchAutocompleteClear",popover:"bui-SearchAutocompletePopover",inner:"bui-SearchAutocompleteInner",listBox:"bui-SearchAutocompleteListBox",loadingState:"bui-SearchAutocompleteLoadingState",emptyState:"bui-SearchAutocompleteEmptyState"},propDefs:{"aria-label":{},"aria-labelledby":{},size:{dataAttribute:!0,default:"small"},placeholder:{default:"Search"},inputValue:{},onInputChange:{},popoverWidth:{},popoverPlacement:{},children:{},isLoading:{},defaultOpen:{},className:{},style:{}}}),ce=B()({styles:O,classNames:{root:"bui-SearchAutocompleteItem",itemContent:"bui-SearchAutocompleteItemContent"},propDefs:{children:{},className:{}}}),pe=()=>{const{ownProps:n}=_(k,{});return e.jsx("div",{className:n.classes.emptyState,children:"No results found."})};function u(n){const{ownProps:i,dataAttributes:a}=_(k,n),{classes:r,"aria-label":o,"aria-labelledby":t,inputValue:x,onInputChange:l,placeholder:d,popoverWidth:g,popoverPlacement:q="bottom start",children:$,isLoading:b,defaultOpen:D,style:E}=i,T=s.useRef(null),P=s.useRef(null),W=!!x,H=s.Children.count($)>0;let R="";b?R="Searching":W&&!H&&(R="No results found");const f=oe({defaultOpen:D});return J({ref:P,onInteractOutside:S=>{const M=S.target;T.current?.contains(M)||f.close()},isDisabled:!f.isOpen}),e.jsx(Q.Provider,{value:f,children:e.jsxs(Y,{inputValue:x,onInputChange:S=>{l?.(S),S?f.open():f.close()},children:[e.jsx(ie,{className:r.searchField,"aria-label":o??(t?void 0:d),"aria-labelledby":t,"data-size":a["data-size"],onKeyDown:S=>{S.key==="Enter"&&!f.isOpen&&W&&(S.preventDefault(),f.open())},children:e.jsxs("div",{ref:T,className:r.root,...a,style:E,children:[e.jsx("div",{"aria-hidden":"true",children:e.jsx(ne,{})}),e.jsx(te,{className:r.searchFieldInput,placeholder:d}),e.jsx(ee,{className:r.searchFieldClear,style:{visibility:W?"visible":"hidden"},children:e.jsx(se,{})})]})}),e.jsx(X,{ref:P,className:r.popover,triggerRef:T,isNonModal:!0,placement:q,...g?{style:{width:g}}:{},children:e.jsx(G,{children:e.jsx(Z,{bg:"neutral",className:r.inner,children:e.jsx(ae,{className:r.listBox,autoFocus:"first",shouldFocusOnHover:!0,"aria-busy":b||void 0,"data-stale":b||void 0,renderEmptyState:()=>b?e.jsx("div",{className:r.loadingState,children:"Searching..."}):e.jsx(pe,{}),onAction:()=>{f.close()},children:$})})})}),e.jsx(le,{"aria-live":"polite","aria-atomic":"true",children:R})]})})}function p(n){const{ownProps:i,restProps:a}=_(ce,n),{classes:r,children:o}=i;return e.jsx(re,{textValue:typeof o=="string"?o:void 0,className:r.root,...a,children:e.jsx("div",{className:r.itemContent,children:o})})}u.__docgenInfo={description:`A search input that shows a dropdown list of suggestions as the user types, with loading and empty states.

@public`,methods:[],displayName:"SearchAutocomplete",props:{inputValue:{required:!1,tsType:{name:"string"},description:"The current value of the search input (controlled)."},onInputChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: string) => void",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"void"}}},description:"Handler called when the search input value changes."},size:{required:!1,tsType:{name:"union",raw:"'small' | 'medium' | Partial<Record<Breakpoint, 'small' | 'medium'>>",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]}],raw:"Record<Breakpoint, 'small' | 'medium'>"}],raw:"Partial<Record<Breakpoint, 'small' | 'medium'>>"}]},description:`The size of the search input.
@defaultValue 'small'`},"aria-label":{required:!1,tsType:{name:"string"},description:"Accessible label for the search input."},"aria-labelledby":{required:!1,tsType:{name:"string"},description:"ID of the element that labels the search input."},placeholder:{required:!1,tsType:{name:"string"},description:"The placeholder text for the search input."},popoverWidth:{required:!1,tsType:{name:"string"},description:`Width of the results popover. Accepts any CSS width value.
When not set, the popover matches the input width.`},popoverPlacement:{required:!1,tsType:{name:"AriaPopoverProps['placement']",raw:"AriaPopoverProps['placement']"},description:`Placement of the results popover relative to the input.
@defaultValue 'bottom start'`},children:{required:!1,tsType:{name:"ReactNode"},description:"The result items to render inside the autocomplete."},isLoading:{required:!1,tsType:{name:"boolean"},description:`Whether results are currently loading.
When true, displays a loading indicator and announces the loading state to screen readers.`},defaultOpen:{required:!1,tsType:{name:"boolean"},description:"Whether the results popover is open by default."},className:{required:!1,tsType:{name:"string"},description:""},style:{required:!1,tsType:{name:"ReactCSSProperties",raw:"React.CSSProperties"},description:""}}};p.__docgenInfo={description:`An individual option item within a SearchAutocomplete dropdown.

@public`,methods:[],displayName:"SearchAutocompleteItem",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""},className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const m=U.meta({title:"Backstage UI/SearchAutocomplete",component:u,argTypes:{size:{control:"select",options:["small","medium"]},placeholder:{control:"text"},popoverWidth:{control:"text"}}}),h=[{id:"apple",name:"Apple",description:"A round fruit"},{id:"banana",name:"Banana",description:"A yellow curved fruit"},{id:"blueberry",name:"Blueberry",description:"A small blue berry"},{id:"cherry",name:"Cherry",description:"A small red stone fruit"},{id:"grape",name:"Grape",description:"Grows in clusters on vines"},{id:"lemon",name:"Lemon",description:"A sour yellow citrus fruit"},{id:"mango",name:"Mango",description:"A tropical stone fruit"},{id:"orange",name:"Orange",description:"A citrus fruit"},{id:"peach",name:"Peach",description:"A fuzzy stone fruit"},{id:"strawberry",name:"Strawberry",description:"A red fruit with seeds on its surface"}],y=m.story({args:{"aria-label":"Search fruits",placeholder:"Search fruits...",style:{maxWidth:"300px"}},render:function(i){const[a,r]=s.useState(""),o=h.filter(t=>t.name.toLowerCase().includes(a.toLowerCase()));return e.jsx(u,{...i,inputValue:a,onInputChange:r,children:o.map(t=>e.jsx(p,{id:t.id,textValue:t.name,children:t.name},t.id))})}}),A=m.story({args:{"aria-label":"Search fruits",placeholder:"Search fruits...",style:{maxWidth:"300px"}},render:function(i){const[a,r]=s.useState(""),o=h.filter(t=>t.name.toLowerCase().includes(a.toLowerCase()));return e.jsx(u,{...i,inputValue:a,onInputChange:r,children:o.map(t=>e.jsxs(p,{id:t.id,textValue:t.name,children:[e.jsx(c,{weight:"bold",children:t.name}),e.jsx(c,{variant:"body-small",color:"secondary",children:t.description})]},t.id))})}}),I=m.story({args:{"aria-label":"Search fruits",placeholder:"Search fruits...",style:{maxWidth:"300px"}},render:function(i){const[a,r]=s.useState(""),[o,t]=s.useState([]),[x,l]=s.useState(!1);return s.useEffect(()=>{if(!a){t([]);return}l(!0);const d=setTimeout(()=>{t(h.filter(g=>g.name.toLowerCase().includes(a.toLowerCase()))),l(!1)},2e3);return()=>clearTimeout(d)},[a]),e.jsx(u,{...i,inputValue:a,onInputChange:r,isLoading:x,children:o.map(d=>e.jsxs(p,{id:d.id,textValue:d.name,children:[e.jsx(c,{weight:"bold",children:d.name}),e.jsx(c,{variant:"body-small",color:"secondary",children:d.description})]},d.id))})}}),V=m.story({args:{"aria-label":"Search fruits",placeholder:"Search fruits...",style:{maxWidth:"300px"}},render:function(i){const[a,r]=s.useState(""),[o,t]=s.useState(null),x=h.filter(l=>l.name.toLowerCase().includes(a.toLowerCase()));return e.jsxs(F,{direction:"column",gap:"4",children:[e.jsx(u,{...i,inputValue:a,onInputChange:r,children:x.map(l=>e.jsx(p,{id:l.id,textValue:l.name,onAction:()=>{t(l.name),r("")},children:l.name},l.id))}),e.jsxs(c,{children:["Last selected: ",o??"none"]})]})}}),w=m.story({args:{"aria-label":"Search",placeholder:"Search..."},render:function(i){const[a,r]=s.useState(""),o=h.filter(t=>t.name.toLowerCase().includes(a.toLowerCase()));return e.jsxs(F,{direction:"row",gap:"4",style:{width:"100%",maxWidth:"600px"},children:[e.jsx(u,{...i,size:"small",inputValue:a,onInputChange:r,children:o.map(t=>e.jsx(p,{id:t.id,textValue:t.name,children:t.name},t.id))}),e.jsx(u,{...i,size:"medium",inputValue:a,onInputChange:r,children:o.map(t=>e.jsx(p,{id:t.id,textValue:t.name,children:t.name},t.id))})]})}}),C=m.story({args:{"aria-label":"Search",placeholder:"Search..."},decorators:[n=>e.jsx(K,{children:e.jsx(n,{})})],render:function(i){const[a,r]=s.useState(""),o=h.filter(t=>t.name.toLowerCase().includes(a.toLowerCase()));return e.jsx(ue,{title:"Title",customActions:e.jsxs(e.Fragment,{children:[e.jsx(z,{"aria-label":"Cactus icon button",icon:e.jsx(N,{}),size:"small",variant:"secondary"}),e.jsx(u,{...i,size:"small",inputValue:a,onInputChange:r,popoverWidth:"400px",children:o.map(t=>e.jsx(p,{id:t.id,textValue:t.name,children:t.name},t.id))}),e.jsx(z,{"aria-label":"Cactus icon button",icon:e.jsx(N,{}),size:"small",variant:"secondary"})]})})}}),v=m.story({args:{"aria-label":"Search fruits",placeholder:"Search fruits...",popoverWidth:"500px",style:{maxWidth:"300px"}},render:function(i){const[a,r]=s.useState(""),o=h.filter(t=>t.name.toLowerCase().includes(a.toLowerCase()));return e.jsx(u,{...i,inputValue:a,onInputChange:r,children:o.map(t=>e.jsxs(p,{id:t.id,textValue:t.name,children:[e.jsx(c,{weight:"bold",children:t.name}),e.jsx(c,{variant:"body-small",color:"secondary",children:t.description})]},t.id))})}}),j=m.story({args:{"aria-label":"Search fruits",placeholder:"Search fruits...",defaultOpen:!0,style:{maxWidth:"300px"}},render:function(i){const[a,r]=s.useState("ap"),o=h.filter(t=>t.name.toLowerCase().includes(a.toLowerCase()));return e.jsx(u,{...i,inputValue:a,onInputChange:r,children:o.map(t=>e.jsxs(p,{id:t.id,textValue:t.name,children:[e.jsx(c,{weight:"bold",children:t.name}),e.jsx(c,{variant:"body-small",color:"secondary",children:t.description})]},t.id))})}}),L=m.story({args:{"aria-label":"Search fruits",placeholder:"Search fruits...",defaultOpen:!0,isLoading:!0,inputValue:"ap",style:{maxWidth:"300px"}},render:function(i){return e.jsx(u,{...i,onInputChange:()=>{},children:h.slice(0,3).map(a=>e.jsxs(p,{id:a.id,textValue:a.name,children:[e.jsx(c,{weight:"bold",children:a.name}),e.jsx(c,{variant:"body-small",color:"secondary",children:a.description})]},a.id))})}});y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...w.input.parameters?.docs?.source}}};C.input.parameters={...C.input.parameters,docs:{...C.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...C.input.parameters?.docs?.source}}};v.input.parameters={...v.input.parameters,docs:{...v.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...v.input.parameters?.docs?.source}}};j.input.parameters={...j.input.parameters,docs:{...j.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...L.input.parameters?.docs?.source}}};const ct=["WithItems","WithRichContent","WithAsyncItems","WithSelection","Sizes","InHeader","WithPopoverWidth","OpenByDefault","OpenWithLoading"];export{C as InHeader,j as OpenByDefault,L as OpenWithLoading,w as Sizes,I as WithAsyncItems,y as WithItems,v as WithPopoverWidth,A as WithRichContent,V as WithSelection,ct as __namedExportsOrder};
