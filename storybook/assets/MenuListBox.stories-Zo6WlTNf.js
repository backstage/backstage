import{j as e,r as i}from"./iframe-D4YkWMPd.js";import{M as a,h as l,g as n}from"./Menu-B61nTCdR.js";import{M as x}from"./index-Cb5ApCX3.js";import{B as p}from"./Button-B5RBvaOD.js";import{F as g}from"./Flex-BApT9WnH.js";import{T as h}from"./Text-CO-IAJCE.js";import"./preload-helper-D9Z9MdNV.js";import"./RSPContexts-CaU8v6lP.js";import"./utils-DC4lCrYp.js";import"./clsx-B-dksMZM.js";import"./useFocusRing-BB2_8xTe.js";import"./useLabels-CUySVsUf.js";import"./useEvent-Dou5Apax.js";import"./useListState-OxYjtzOI.js";import"./usePress-xT3Tq1ZD.js";import"./SelectionIndicator-BH7Lx6i2.js";import"./context-5SX1E9i3.js";import"./Hidden-h5lpMBrE.js";import"./useControlledState-D2kbQZKm.js";import"./useLocalizedStringFormatter-BFqMry8S.js";import"./Button-D2eZfW-4.js";import"./Dialog-DJOccuzO.js";import"./OverlayArrow-Cg3QB4mw.js";import"./ListBox-Bq5RBcpZ.js";import"./Text-BAEVBR3H.js";import"./VisuallyHidden-D6BSMgD0.js";import"./Input-DS9mHWJ4.js";import"./useFormReset-gog8c8Xs.js";import"./Form-Cj9eoAUB.js";import"./SearchField-BWCEFQwP.js";import"./FieldError-DWLPrlO-.js";import"./Label-D5ROKj0e.js";import"./useStyles-Dj9KEUsZ.js";import"./index-CD_2jLbB.js";import"./isExternalLink-DzQTpl4p.js";import"./Button.module-BHYJStbY.js";const $={title:"Backstage UI/MenuListBox",component:a,decorators:[r=>e.jsx(x,{children:e.jsx(r,{})})]},o={args:{children:null},render:()=>e.jsxs(a,{isOpen:!0,children:[e.jsx(p,{"aria-label":"Menu",children:"Menu"}),e.jsxs(l,{children:[e.jsx(n,{children:"Item 1"}),e.jsx(n,{children:"Item 2"}),e.jsx(n,{children:"Item 3"})]})]})},m={args:{...o.args},render:()=>{const[r,s]=i.useState(new Set(["paul"]));return e.jsxs(g,{direction:"column",gap:"2",align:"start",children:[e.jsxs(h,{children:["Selected: ",Array.from(r).join(", ")]}),e.jsxs(a,{isOpen:!0,children:[e.jsx(p,{"aria-label":"Menu",children:"Menu"}),e.jsxs(l,{selectionMode:"multiple",selectedKeys:r,onSelectionChange:s,children:[e.jsx(n,{id:"john",children:"John Lennon"},"item1"),e.jsx(n,{id:"paul",children:"Paul McCartney"},"item2"),e.jsx(n,{id:"george",children:"George Harrison"},"item3"),e.jsx(n,{id:"ringo",children:"Ringo Starr"},"item4")]})]})]})}},u={args:{...o.args},render:()=>{const[r,s]=i.useState([]);return i.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{s(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(p,{"aria-label":"Menu",children:"Menu"}),e.jsx(l,{items:r,virtualized:!0,children:r.map((t,d)=>e.jsx(n,{id:t.name,children:t.name.charAt(0).toLocaleUpperCase("en-US")+t.name.slice(1)},d))})]})}},c={args:{...o.args},render:()=>{const[r,s]=i.useState([]);return i.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{s(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(p,{"aria-label":"Menu",children:"Menu"}),e.jsx(l,{items:r,virtualized:!0,maxHeight:"300px",children:r.map((t,d)=>e.jsx(n,{id:t.name,children:t.name.charAt(0).toLocaleUpperCase("en-US")+t.name.slice(1)},d))})]})}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
}`,...c.parameters?.docs?.source}}};const ee=["Default","Controlled","Virtualized","VirtualizedMaxHeight"];export{m as Controlled,o as Default,u as Virtualized,c as VirtualizedMaxHeight,ee as __namedExportsOrder,$ as default};
