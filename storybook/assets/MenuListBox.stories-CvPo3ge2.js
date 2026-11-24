import{r as s,j as e,p as g}from"./iframe-4nxqZpQH.js";import{T as h}from"./TestRouter-CcRgr-w9.js";import{F as M}from"./Flex-DyLW1vPM.js";import{a,h as c,g as o}from"./Menu-PKYvBVUk.js";import{B}from"./BUIProvider-uTHUz88Y.js";import{T as j}from"./Text-BR7AZu71.js";import{B as l}from"./Button-IhDAe-ZW.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CKs39xo2.js";import"./Autocomplete-DCUHQcUI.js";import"./utils-B_CpPLsC.js";import"./useObjectRef-CnTOzlP3.js";import"./keyboard-DrZcZ53x.js";import"./useFocusRing-DLLTypMY.js";import"./getMetaValue-yJ3DJPKd.js";import"./useEvent-C0ADcz5S.js";import"./useLabels-LZrLLl2Z.js";import"./useLocalizedStringFormatter-4T10-1Qu.js";import"./I18nProvider-C7-lUSN5.js";import"./useControlledState-BipTuFfk.js";import"./Button-DcUmzCDo.js";import"./Label-DFDy7rWc.js";import"./Hidden-BHEINN-B.js";import"./useLabel-B3SXQ9nf.js";import"./number-CWCm_kOs.js";import"./useButton-kIYEhZRP.js";import"./usePress-IehbRc7n.js";import"./textSelection-BqsoCXBu.js";import"./useHover-6QHjRx59.js";import"./useLoadMoreSentinel-B02Bo39W.js";import"./useCollection-BK1naX3I.js";import"./FocusScope-DlgAda7i.js";import"./Input-Cdk-ot_F.js";import"./ListBox-CXErTZBH.js";import"./SelectionIndicator-qqCHqb3k.js";import"./Text-CLYtJTsR.js";import"./useListState-B4w7DXJu.js";import"./Dialog-DAjHlvOp.js";import"./Heading-Bpva74LM.js";import"./useOverlayTriggerState-_agSFwEY.js";import"./VisuallyHidden-DBTOudP9.js";import"./animation-Drc_DBoe.js";import"./SearchField-9UZ2-WMN.js";import"./FieldError-BXBChgnT.js";import"./Form-CqRLvZ1x.js";import"./useFormValidation-ZZF8mbB2.js";import"./useTextField-NQJPnPp0.js";import"./useField-C-Ng_aIY.js";import"./useFormReset-0ATPKRb6.js";import"./Virtualizer-DuLjAgv-.js";import"./useFilter-CfSo70hf.js";import"./index-CS0rKBQt.js";import"./getNodeText-CyElTUXt.js";import"./BUIRoutingProvider-Du5oqrd5.js";const d=g.meta({title:"Backstage UI/MenuListBox",component:a,decorators:[r=>e.jsx(h,{children:e.jsx(B,{children:e.jsx(r,{})})})]}),n=d.story({args:{children:null},render:()=>e.jsxs(a,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsxs(c,{children:[e.jsx(o,{children:"Item 1"}),e.jsx(o,{children:"Item 2"}),e.jsx(o,{children:"Item 3"})]})]})}),m=d.story({args:{...n.input.args},render:()=>{const[r,i]=s.useState(new Set(["paul"]));return e.jsxs(M,{direction:"column",gap:"2",align:"start",children:[e.jsxs(j,{children:["Selected: ",Array.from(r).join(", ")]}),e.jsxs(a,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsxs(c,{selectionMode:"multiple",selectedKeys:r,onSelectionChange:i,children:[e.jsx(o,{id:"john",children:"John Lennon"},"item1"),e.jsx(o,{id:"paul",children:"Paul McCartney"},"item2"),e.jsx(o,{id:"george",children:"George Harrison"},"item3"),e.jsx(o,{id:"ringo",children:"Ringo Starr"},"item4")]})]})]})}}),p=d.story({args:{...n.input.args},render:()=>{const[r,i]=s.useState([]);return s.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{i(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsx(c,{items:r,virtualized:!0,children:r.map((t,x)=>e.jsx(o,{id:t.name,children:t.name.charAt(0).toUpperCase()+t.name.slice(1)},x))})]})}}),u=d.story({args:{...n.input.args},render:()=>{const[r,i]=s.useState([]);return s.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{i(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsx(c,{items:r,virtualized:!0,maxHeight:"300px",children:r.map((t,x)=>e.jsx(o,{id:t.name,children:t.name.charAt(0).toUpperCase()+t.name.slice(1)},x))})]})}});n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
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
