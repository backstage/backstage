import{r as s,j as e,p as g,M as h}from"./iframe-S5OJNhaE.js";import{F as M}from"./Flex-BDHXNlSl.js";import{a,h as c,g as o}from"./Menu-CCBUh7j9.js";import{B}from"./BUIProvider-CxyEA8gh.js";import{T as j}from"./Text-bGH6hxSc.js";import{B as l}from"./Button-DDULhRN_.js";import"./preload-helper-PPVm8Dsz.js";import"./Autocomplete-D8VeH8Ib.js";import"./utils-Bf43CEqe.js";import"./useObjectRef-Ce7Pg0IE.js";import"./keyboard-DsBCMzZY.js";import"./useFocusRing-DrNn4w0v.js";import"./openLink-gCGEI6Hl.js";import"./getMetaValue-DfvZTkcg.js";import"./useEvent-BTfti7hW.js";import"./useLabels-lt4DDiFl.js";import"./useLocalizedStringFormatter-FCJD34ts.js";import"./I18nProvider-B9PKsfTQ.js";import"./useControlledState-sjWVeRbh.js";import"./Button-C2Hm-9-t.js";import"./Label-Dm19jsZB.js";import"./Hidden-bbdHFmyf.js";import"./useLabel-D6KUrPXz.js";import"./number-DPETitzY.js";import"./useButton-ZsuQVD8S.js";import"./usePress-BKUcGSaX.js";import"./textSelection-C5XFxsbn.js";import"./useHover-DRBklp1Y.js";import"./useLoadMoreSentinel-BFnt0SFw.js";import"./useCollection-k8pWz5ND.js";import"./FocusScope-C1MKzIWs.js";import"./Input-eHTkKayp.js";import"./ListBox-3Aeqh9PT.js";import"./SelectionIndicator-CRRCNCtd.js";import"./Text-CxFSOtlL.js";import"./useListState-CXSz469O.js";import"./Dialog-BiUzqtUJ.js";import"./Heading-C94RofTM.js";import"./useOverlayTriggerState-C-PPUK0B.js";import"./VisuallyHidden-DVzk229T.js";import"./animation-D5KQd_1z.js";import"./SearchField-meulwOzD.js";import"./FieldError-B0-R75VP.js";import"./Form-CdsOyD6B.js";import"./useFormValidation-CHoAG3iu.js";import"./useTextField-XvGvtHKV.js";import"./useField-C9JYPx-z.js";import"./useFormReset-CTFIfjuR.js";import"./Virtualizer-F-4qcxjn.js";import"./useFilter-7KI-EPr5.js";import"./index-BC5M37nw.js";import"./getNodeText-opGXgiNZ.js";import"./BUIRoutingProvider-MbdU_jc-.js";import"./useResolvedHref-D6pj4Xy7.js";const d=g.meta({title:"Backstage UI/MenuListBox",component:a,decorators:[r=>e.jsx(h,{children:e.jsx(B,{children:e.jsx(r,{})})})]}),n=d.story({args:{children:null},render:()=>e.jsxs(a,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsxs(c,{children:[e.jsx(o,{children:"Item 1"}),e.jsx(o,{children:"Item 2"}),e.jsx(o,{children:"Item 3"})]})]})}),m=d.story({args:{...n.input.args},render:()=>{const[r,i]=s.useState(new Set(["paul"]));return e.jsxs(M,{direction:"column",gap:"2",align:"start",children:[e.jsxs(j,{children:["Selected: ",Array.from(r).join(", ")]}),e.jsxs(a,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsxs(c,{selectionMode:"multiple",selectedKeys:r,onSelectionChange:i,children:[e.jsx(o,{id:"john",children:"John Lennon"},"item1"),e.jsx(o,{id:"paul",children:"Paul McCartney"},"item2"),e.jsx(o,{id:"george",children:"George Harrison"},"item3"),e.jsx(o,{id:"ringo",children:"Ringo Starr"},"item4")]})]})]})}}),p=d.story({args:{...n.input.args},render:()=>{const[r,i]=s.useState([]);return s.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{i(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsx(c,{items:r,virtualized:!0,children:r.map((t,x)=>e.jsx(o,{id:t.name,children:t.name.charAt(0).toUpperCase()+t.name.slice(1)},x))})]})}}),u=d.story({args:{...n.input.args},render:()=>{const[r,i]=s.useState([]);return s.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{i(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsx(c,{items:r,virtualized:!0,maxHeight:"300px",children:r.map((t,x)=>e.jsx(o,{id:t.name,children:t.name.charAt(0).toUpperCase()+t.name.slice(1)},x))})]})}});n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: null
  },
  render: () => <MenuTrigger isOpen>
      <Button aria-label="Menu">Menu</Button>
      <MenuListBox>
        <MenuListBoxItem>Item 1</MenuListBoxItem>
        <MenuListBoxItem>Item 2</MenuListBoxItem>
        <MenuListBoxItem>Item 3</MenuListBoxItem>
      </MenuListBox>
    </MenuTrigger>
})`,...n.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: () => {
    const [selected, setSelected] = useState<Selection>(new Set(['paul']));
    return <Flex direction="column" gap="2" align="start">
        <Text>Selected: {Array.from(selected).join(', ')}</Text>
        <MenuTrigger isOpen>
          <Button aria-label="Menu">Menu</Button>
          <MenuListBox selectionMode="multiple" selectedKeys={selected} onSelectionChange={setSelected}>
            <MenuListBoxItem key="item1" id="john">
              John Lennon
            </MenuListBoxItem>
            <MenuListBoxItem key="item2" id="paul">
              Paul McCartney
            </MenuListBoxItem>
            <MenuListBoxItem key="item3" id="george">
              George Harrison
            </MenuListBoxItem>
            <MenuListBoxItem key="item4" id="ringo">
              Ringo Starr
            </MenuListBoxItem>
          </MenuListBox>
        </MenuTrigger>
      </Flex>;
  }
})`,...m.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: () => {
    const [pokemon, setPokemon] = useState<Array<{
      name: string;
      url: string;
    }>>([]);
    useEffect(() => {
      fetch('https://pokeapi.co/api/v2/pokemon?limit=1000').then(response => response.json()).then(data => {
        setPokemon(data.results);
      }).catch(error => {
        console.error('Error fetching Pokemon:', error);
      });
    }, []);
    return <MenuTrigger isOpen>
        <Button aria-label="Menu">Menu</Button>
        <MenuListBox items={pokemon} virtualized>
          {pokemon.map((p, index) => <MenuListBoxItem key={index} id={p.name}>
              {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
            </MenuListBoxItem>)}
        </MenuListBox>
      </MenuTrigger>;
  }
})`,...p.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: () => {
    const [pokemon, setPokemon] = useState<Array<{
      name: string;
      url: string;
    }>>([]);
    useEffect(() => {
      fetch('https://pokeapi.co/api/v2/pokemon?limit=1000').then(response => response.json()).then(data => {
        setPokemon(data.results);
      }).catch(error => {
        console.error('Error fetching Pokemon:', error);
      });
    }, []);
    return <MenuTrigger isOpen>
        <Button aria-label="Menu">Menu</Button>
        <MenuListBox items={pokemon} virtualized maxHeight="300px">
          {pokemon.map((p, index) => <MenuListBoxItem key={index} id={p.name}>
              {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
            </MenuListBoxItem>)}
        </MenuListBox>
      </MenuTrigger>;
  }
})`,...u.input.parameters?.docs?.source}}};const ke=["Default","Controlled","Virtualized","VirtualizedMaxHeight"];export{m as Controlled,n as Default,p as Virtualized,u as VirtualizedMaxHeight,ke as __namedExportsOrder};
