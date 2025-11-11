import{j as e,r as i}from"./iframe-D1GFiJZo.js";import{M as a,h as l,g as n}from"./Menu-CIeK8ZKR.js";import{M as x}from"./index-DKQ8ROEi.js";import{B as p}from"./Button-BAJYwszi.js";import{F as g}from"./Flex-BtP_5tP5.js";import{T as h}from"./Text-Dd41ZRap.js";import"./preload-helper-D9Z9MdNV.js";import"./Dialog-BNaPfK1G.js";import"./ListBox-BiHmM1Iv.js";import"./useListState-CWQwRy9x.js";import"./useFocusRing-D3IFXkEE.js";import"./utils-Ca8TvNj0.js";import"./clsx-B-dksMZM.js";import"./usePress-B5nQIucE.js";import"./useEvent-u_7Zhiuq.js";import"./SelectionIndicator-BrolPTaV.js";import"./context-Dd9J9Uit.js";import"./Hidden-DrBZnckA.js";import"./useControlledState-BPTILyls.js";import"./RSPContexts-DxYjEM2z.js";import"./Text-DWhhDPai.js";import"./useLabel-B7H3dBPt.js";import"./useLabels-Cr58B2xr.js";import"./useLocalizedStringFormatter-CYdqkXaW.js";import"./Button-Csoy-ZUF.js";import"./Label-m_goJHQj.js";import"./OverlayArrow-pohziZtH.js";import"./VisuallyHidden-DluLs1vl.js";import"./Input-DZk0GmM2.js";import"./useFormReset-Clc3IhnG.js";import"./Form-Bg6_PKsV.js";import"./SearchField-BNuFnD2a.js";import"./FieldError-CGJDOUP-.js";import"./useStyles-B11jByn2.js";import"./index-AM_pMIe5.js";import"./isExternalLink-DzQTpl4p.js";import"./Button.module-CBqvMRbq.js";const ee={title:"Backstage UI/MenuListBox",component:a,decorators:[r=>e.jsx(x,{children:e.jsx(r,{})})]},o={args:{children:null},render:()=>e.jsxs(a,{isOpen:!0,children:[e.jsx(p,{"aria-label":"Menu",children:"Menu"}),e.jsxs(l,{children:[e.jsx(n,{children:"Item 1"}),e.jsx(n,{children:"Item 2"}),e.jsx(n,{children:"Item 3"})]})]})},m={args:{...o.args},render:()=>{const[r,s]=i.useState(new Set(["paul"]));return e.jsxs(g,{direction:"column",gap:"2",align:"start",children:[e.jsxs(h,{children:["Selected: ",Array.from(r).join(", ")]}),e.jsxs(a,{isOpen:!0,children:[e.jsx(p,{"aria-label":"Menu",children:"Menu"}),e.jsxs(l,{selectionMode:"multiple",selectedKeys:r,onSelectionChange:s,children:[e.jsx(n,{id:"john",children:"John Lennon"},"item1"),e.jsx(n,{id:"paul",children:"Paul McCartney"},"item2"),e.jsx(n,{id:"george",children:"George Harrison"},"item3"),e.jsx(n,{id:"ringo",children:"Ringo Starr"},"item4")]})]})]})}},u={args:{...o.args},render:()=>{const[r,s]=i.useState([]);return i.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{s(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(p,{"aria-label":"Menu",children:"Menu"}),e.jsx(l,{items:r,virtualized:!0,children:r.map((t,d)=>e.jsx(n,{id:t.name,children:t.name.charAt(0).toLocaleUpperCase("en-US")+t.name.slice(1)},d))})]})}},c={args:{...o.args},render:()=>{const[r,s]=i.useState([]);return i.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{s(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(p,{"aria-label":"Menu",children:"Menu"}),e.jsx(l,{items:r,virtualized:!0,maxHeight:"300px",children:r.map((t,d)=>e.jsx(n,{id:t.name,children:t.name.charAt(0).toLocaleUpperCase("en-US")+t.name.slice(1)},d))})]})}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
}`,...o.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
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
}`,...m.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
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
              {p.name.charAt(0).toLocaleUpperCase('en-US') + p.name.slice(1)}
            </MenuListBoxItem>)}
        </MenuListBox>
      </MenuTrigger>;
  }
}`,...u.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
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
              {p.name.charAt(0).toLocaleUpperCase('en-US') + p.name.slice(1)}
            </MenuListBoxItem>)}
        </MenuListBox>
      </MenuTrigger>;
  }
}`,...c.parameters?.docs?.source}}};const te=["Default","Controlled","Virtualized","VirtualizedMaxHeight"];export{m as Controlled,o as Default,u as Virtualized,c as VirtualizedMaxHeight,te as __namedExportsOrder,ee as default};
