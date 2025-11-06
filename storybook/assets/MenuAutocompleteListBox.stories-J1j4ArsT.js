import{j as e,r as a}from"./iframe-DKl1TaBY.js";import{M as i,f as l,g as c,a as j,b,S as v}from"./Menu-DLmCTjFO.js";import{M as f}from"./index-CAizWZSO.js";import{F as h}from"./Flex-Bp51ecym.js";import{T as M}from"./Text-CGO_UQFN.js";import{B as u}from"./Button-BnoIzI9g.js";import"./preload-helper-D9Z9MdNV.js";import"./RSPContexts-BzUg7TeD.js";import"./utils-ih_j407f.js";import"./clsx-B-dksMZM.js";import"./useFocusRing-m_zlqpNl.js";import"./useLabels-Vp5U3kXQ.js";import"./useEvent-iZ2JTqbT.js";import"./useListState-DtfUdoBM.js";import"./usePress-Dcs4E9UJ.js";import"./SelectionIndicator-BEq20Vmj.js";import"./context-DTIhHctQ.js";import"./Hidden-C-3P-8TB.js";import"./useControlledState-5ZwgRprs.js";import"./useLocalizedStringFormatter-Cs6Ft6bz.js";import"./Button-tZKFDyl-.js";import"./Dialog-DpWpgszf.js";import"./OverlayArrow-C9viu7LB.js";import"./ListBox-Bv0yKMsi.js";import"./Text-Bi5gH-cw.js";import"./VisuallyHidden-T6iAQWzB.js";import"./Input-CCpTS05k.js";import"./useFormReset-BA_u5cn5.js";import"./Form-DYw8-Sqj.js";import"./SearchField-DOgCdufr.js";import"./FieldError-Cwp00kop.js";import"./Label-C8AhOPMe.js";import"./useStyles-CE3xc5I3.js";import"./index-DnIFsHVM.js";import"./isExternalLink-DzQTpl4p.js";import"./Button.module-BHYJStbY.js";const se={title:"Backstage UI/MenuAutocompleteListBox",component:i,decorators:[r=>e.jsx(f,{children:e.jsx(r,{})})]},s=[{label:"Apple",value:"apple"},{label:"Banana",value:"banana"},{label:"Blueberry",value:"blueberry"},{label:"Cherry",value:"cherry"},{label:"Durian",value:"durian"},{label:"Elderberry",value:"elderberry"},{label:"Fig",value:"fig"},{label:"Grape",value:"grape"},{label:"Honeydew",value:"honeydew"}],n={args:{children:null},render:()=>{const[r,o]=a.useState(new Set([s[2].value]));return e.jsxs(h,{direction:"column",gap:"2",align:"start",children:[e.jsxs(M,{children:["Selected: ",Array.from(r).join(", ")]}),e.jsxs(i,{isOpen:!0,children:[e.jsx(u,{"aria-label":"Menu",children:"Menu"}),e.jsx(l,{selectedKeys:r,onSelectionChange:o,children:s.map(t=>e.jsx(c,{id:t.value,children:t.label},t.value))})]})]})}},m={args:{...n.args},render:()=>{const[r,o]=a.useState(new Set([s[2].value]));return e.jsxs(h,{direction:"column",gap:"2",align:"center",children:[e.jsxs(M,{children:["Selected: ",Array.from(r).join(", ")]}),e.jsxs(i,{children:[e.jsx(u,{"aria-label":"Menu",children:"Menu"}),e.jsx(l,{selectedKeys:r,onSelectionChange:o,children:s.map(t=>e.jsx(c,{id:t.value,children:t.label},t.value))})]})]})}},p={args:{...n.args},render:()=>{const[r,o]=a.useState(new Set([s[2].value,s[3].value]));return e.jsxs(h,{direction:"column",gap:"2",align:"center",children:[e.jsxs(M,{children:["Selected: ",Array.from(r).join(", ")]}),e.jsxs(i,{children:[e.jsx(u,{"aria-label":"Menu",children:"Menu"}),e.jsx(l,{selectionMode:"multiple",selectedKeys:r,onSelectionChange:o,children:s.map(t=>e.jsx(c,{id:t.value,children:t.label},t.value))})]})]})}},d={args:{...n.args},render:()=>{const[r,o]=a.useState(new Set([s[2].value]));return e.jsxs(h,{direction:"column",gap:"2",align:"start",children:[e.jsxs(M,{children:["Selected: ",Array.from(r).join(", ")]}),e.jsxs(i,{isOpen:!0,children:[e.jsx(u,{"aria-label":"Menu",children:"Menu"}),e.jsxs(j,{children:[e.jsx(b,{children:"Edit"}),e.jsx(b,{children:"Duplicate"}),e.jsxs(v,{children:[e.jsx(b,{children:"Submenu"}),e.jsx(l,{selectedKeys:r,onSelectionChange:o,placement:"right top",children:s.map(t=>e.jsx(c,{id:t.value,children:t.label},t.value))})]})]})]})]})}},g={args:{...n.args},render:()=>{const[r,o]=a.useState([]);return a.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{o(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(i,{isOpen:!0,children:[e.jsx(u,{"aria-label":"Menu",children:"Menu"}),e.jsx(l,{items:r,placeholder:"Search Pokemon...",virtualized:!0,children:r.map((t,S)=>e.jsx(c,{id:t.name,children:t.name.charAt(0).toLocaleUpperCase("en-US")+t.name.slice(1)},S))})]})}},x={args:{...n.args},render:()=>{const[r,o]=a.useState([]);return a.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{o(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(i,{isOpen:!0,children:[e.jsx(u,{"aria-label":"Menu",children:"Menu"}),e.jsx(l,{items:r,placeholder:"Search Pokemon...",virtualized:!0,maxHeight:"300px",children:r.map((t,S)=>e.jsx(c,{id:t.name,children:t.name.charAt(0).toLocaleUpperCase("en-US")+t.name.slice(1)},S))})]})}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  render: () => {
    const [selected, setSelected] = useState<Selection>(new Set([options[2].value]));
    return <Flex direction="column" gap="2" align="start">
        <Text>Selected: {Array.from(selected).join(', ')}</Text>
        <MenuTrigger isOpen>
          <Button aria-label="Menu">Menu</Button>
          <MenuAutocompleteListbox selectedKeys={selected} onSelectionChange={setSelected}>
            {options.map(option => <MenuListBoxItem key={option.value} id={option.value}>
                {option.label}
              </MenuListBoxItem>)}
          </MenuAutocompleteListbox>
        </MenuTrigger>
      </Flex>;
  }
}`,...n.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
  },
  render: () => {
    const [selected, setSelected] = useState<Selection>(new Set([options[2].value]));
    return <Flex direction="column" gap="2" align="center">
        <Text>Selected: {Array.from(selected).join(', ')}</Text>
        <MenuTrigger>
          <Button aria-label="Menu">Menu</Button>
          <MenuAutocompleteListbox selectedKeys={selected} onSelectionChange={setSelected}>
            {options.map(option => <MenuListBoxItem key={option.value} id={option.value}>
                {option.label}
              </MenuListBoxItem>)}
          </MenuAutocompleteListbox>
        </MenuTrigger>
      </Flex>;
  }
}`,...m.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
  },
  render: () => {
    const [selected, setSelected] = useState<Selection>(new Set([options[2].value, options[3].value]));
    return <Flex direction="column" gap="2" align="center">
        <Text>Selected: {Array.from(selected).join(', ')}</Text>
        <MenuTrigger>
          <Button aria-label="Menu">Menu</Button>
          <MenuAutocompleteListbox selectionMode="multiple" selectedKeys={selected} onSelectionChange={setSelected}>
            {options.map(option => <MenuListBoxItem key={option.value} id={option.value}>
                {option.label}
              </MenuListBoxItem>)}
          </MenuAutocompleteListbox>
        </MenuTrigger>
      </Flex>;
  }
}`,...p.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
  },
  render: () => {
    const [selected, setSelected] = useState<Selection>(new Set([options[2].value]));
    return <Flex direction="column" gap="2" align="start">
        <Text>Selected: {Array.from(selected).join(', ')}</Text>
        <MenuTrigger isOpen>
          <Button aria-label="Menu">Menu</Button>
          <Menu>
            <MenuItem>Edit</MenuItem>
            <MenuItem>Duplicate</MenuItem>
            <SubmenuTrigger>
              <MenuItem>Submenu</MenuItem>
              <MenuAutocompleteListbox selectedKeys={selected} onSelectionChange={setSelected} placement="right top">
                {options.map(option => <MenuListBoxItem key={option.value} id={option.value}>
                    {option.label}
                  </MenuListBoxItem>)}
              </MenuAutocompleteListbox>
            </SubmenuTrigger>
          </Menu>
        </MenuTrigger>
      </Flex>;
  }
}`,...d.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
        <MenuAutocompleteListbox items={pokemon} placeholder="Search Pokemon..." virtualized>
          {pokemon.map((p, index) => <MenuListBoxItem key={index} id={p.name}>
              {p.name.charAt(0).toLocaleUpperCase('en-US') + p.name.slice(1)}
            </MenuListBoxItem>)}
        </MenuAutocompleteListbox>
      </MenuTrigger>;
  }
}`,...g.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
        <MenuAutocompleteListbox items={pokemon} placeholder="Search Pokemon..." virtualized maxHeight="300px">
          {pokemon.map((p, index) => <MenuListBoxItem key={index} id={p.name}>
              {p.name.charAt(0).toLocaleUpperCase('en-US') + p.name.slice(1)}
            </MenuListBoxItem>)}
        </MenuAutocompleteListbox>
      </MenuTrigger>;
  }
}`,...x.parameters?.docs?.source}}};const ae=["Default","PreviewListbox","PreviewListboxMultiple","Submenu","Virtualized","VirtualizedMaxHeight"];export{n as Default,m as PreviewListbox,p as PreviewListboxMultiple,d as Submenu,g as Virtualized,x as VirtualizedMaxHeight,ae as __namedExportsOrder,se as default};
