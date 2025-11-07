import{j as e,r as i}from"./iframe-DGs96NRX.js";import{M as a,h as l,g as n}from"./Menu-Fc-hhGPz.js";import{M as x}from"./index-Du2IYsJS.js";import{B as p}from"./Button-BZseCkD1.js";import{F as g}from"./Flex-DyTWKPeC.js";import{T as h}from"./Text-C6JGprs_.js";import"./preload-helper-D9Z9MdNV.js";import"./Dialog-BOg2QbXD.js";import"./ListBox-6MHiSOxR.js";import"./useListState-2CI5k1Gp.js";import"./useFocusRing-BH5dx5ew.js";import"./utils-Cg2mtjSe.js";import"./clsx-B-dksMZM.js";import"./usePress-CJ8kZKIo.js";import"./useEvent-B_boxdlY.js";import"./SelectionIndicator-DnYDpwDQ.js";import"./context-D7jFTL2Q.js";import"./Hidden-C43Hqw5G.js";import"./useControlledState-BKEqqZy2.js";import"./RSPContexts-C05VnW2e.js";import"./Text-8BNlLSqz.js";import"./useLabels-Cyub2fxl.js";import"./useLocalizedStringFormatter-DRcawwlA.js";import"./Button-BKPfLOkq.js";import"./OverlayArrow-CWGLJTR6.js";import"./VisuallyHidden-CLzOTpJ0.js";import"./Input-DJbi6niS.js";import"./useFormReset-Cg1YjiQK.js";import"./Form-Z6qT6avX.js";import"./SearchField-DOTit4dm.js";import"./FieldError-DUbnbTkK.js";import"./Label-7Iq-a4Lo.js";import"./useStyles-DSKvYoj-.js";import"./index-Bt17eeEA.js";import"./isExternalLink-DzQTpl4p.js";import"./Button.module-BHYJStbY.js";const $={title:"Backstage UI/MenuListBox",component:a,decorators:[r=>e.jsx(x,{children:e.jsx(r,{})})]},o={args:{children:null},render:()=>e.jsxs(a,{isOpen:!0,children:[e.jsx(p,{"aria-label":"Menu",children:"Menu"}),e.jsxs(l,{children:[e.jsx(n,{children:"Item 1"}),e.jsx(n,{children:"Item 2"}),e.jsx(n,{children:"Item 3"})]})]})},m={args:{...o.args},render:()=>{const[r,s]=i.useState(new Set(["paul"]));return e.jsxs(g,{direction:"column",gap:"2",align:"start",children:[e.jsxs(h,{children:["Selected: ",Array.from(r).join(", ")]}),e.jsxs(a,{isOpen:!0,children:[e.jsx(p,{"aria-label":"Menu",children:"Menu"}),e.jsxs(l,{selectionMode:"multiple",selectedKeys:r,onSelectionChange:s,children:[e.jsx(n,{id:"john",children:"John Lennon"},"item1"),e.jsx(n,{id:"paul",children:"Paul McCartney"},"item2"),e.jsx(n,{id:"george",children:"George Harrison"},"item3"),e.jsx(n,{id:"ringo",children:"Ringo Starr"},"item4")]})]})]})}},u={args:{...o.args},render:()=>{const[r,s]=i.useState([]);return i.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{s(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(p,{"aria-label":"Menu",children:"Menu"}),e.jsx(l,{items:r,virtualized:!0,children:r.map((t,d)=>e.jsx(n,{id:t.name,children:t.name.charAt(0).toLocaleUpperCase("en-US")+t.name.slice(1)},d))})]})}},c={args:{...o.args},render:()=>{const[r,s]=i.useState([]);return i.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{s(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(p,{"aria-label":"Menu",children:"Menu"}),e.jsx(l,{items:r,virtualized:!0,maxHeight:"300px",children:r.map((t,d)=>e.jsx(n,{id:t.name,children:t.name.charAt(0).toLocaleUpperCase("en-US")+t.name.slice(1)},d))})]})}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
