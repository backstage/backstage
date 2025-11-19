import{j as e,r as a}from"./iframe-C4dPZ8kl.js";import{M as i,f as l,g as c,a as j,b,S as v}from"./Menu-CeG8pIqr.js";import{M as f}from"./index-D_dzg66M.js";import{F as h}from"./Flex-DR64_dj8.js";import{T as M}from"./Text-C6hlEEd2.js";import{B as u}from"./Button-OR3JgNo1.js";import"./preload-helper-D9Z9MdNV.js";import"./Dialog-CN9eeHLf.js";import"./ListBox-CLAbG0Cr.js";import"./useListState-vOFMVhwY.js";import"./useFocusRing-BKXr-WrK.js";import"./utils-CDQyq5OZ.js";import"./clsx-B-dksMZM.js";import"./usePress-DGfDb_LI.js";import"./useEvent-Dw0gAJSb.js";import"./SelectionIndicator-B1lxFGgK.js";import"./context-Cd-M5AOT.js";import"./Hidden-Cpr4YWbw.js";import"./useControlledState-CkaIfySs.js";import"./RSPContexts-COoJcBxj.js";import"./Text-FnU8c-4_.js";import"./useLabel-CIXfSmph.js";import"./useLabels-DDCYiv1v.js";import"./useLocalizedStringFormatter-DOyK_DNG.js";import"./Button-DqIGhd0C.js";import"./Label-BKdilz82.js";import"./OverlayArrow-6YcF9Ro0.js";import"./VisuallyHidden-j1aPgUbF.js";import"./Input-CR_Y990M.js";import"./useFormReset-BYvlgLku.js";import"./Form-DJgkfewX.js";import"./SearchField-BxvMb0jf.js";import"./FieldError-BfklYlw6.js";import"./useStyles-SlN8UMlD.js";import"./index-fUaMcycj.js";import"./isExternalLink-DzQTpl4p.js";import"./Button.module-BPzqtDAO.js";const ae={title:"Backstage UI/MenuAutocompleteListBox",component:i,decorators:[r=>e.jsx(f,{children:e.jsx(r,{})})]},s=[{label:"Apple",value:"apple"},{label:"Banana",value:"banana"},{label:"Blueberry",value:"blueberry"},{label:"Cherry",value:"cherry"},{label:"Durian",value:"durian"},{label:"Elderberry",value:"elderberry"},{label:"Fig",value:"fig"},{label:"Grape",value:"grape"},{label:"Honeydew",value:"honeydew"}],n={args:{children:null},render:()=>{const[r,o]=a.useState(new Set([s[2].value]));return e.jsxs(h,{direction:"column",gap:"2",align:"start",children:[e.jsxs(M,{children:["Selected: ",Array.from(r).join(", ")]}),e.jsxs(i,{isOpen:!0,children:[e.jsx(u,{"aria-label":"Menu",children:"Menu"}),e.jsx(l,{selectedKeys:r,onSelectionChange:o,children:s.map(t=>e.jsx(c,{id:t.value,children:t.label},t.value))})]})]})}},m={args:{...n.args},render:()=>{const[r,o]=a.useState(new Set([s[2].value]));return e.jsxs(h,{direction:"column",gap:"2",align:"center",children:[e.jsxs(M,{children:["Selected: ",Array.from(r).join(", ")]}),e.jsxs(i,{children:[e.jsx(u,{"aria-label":"Menu",children:"Menu"}),e.jsx(l,{selectedKeys:r,onSelectionChange:o,children:s.map(t=>e.jsx(c,{id:t.value,children:t.label},t.value))})]})]})}},p={args:{...n.args},render:()=>{const[r,o]=a.useState(new Set([s[2].value,s[3].value]));return e.jsxs(h,{direction:"column",gap:"2",align:"center",children:[e.jsxs(M,{children:["Selected: ",Array.from(r).join(", ")]}),e.jsxs(i,{children:[e.jsx(u,{"aria-label":"Menu",children:"Menu"}),e.jsx(l,{selectionMode:"multiple",selectedKeys:r,onSelectionChange:o,children:s.map(t=>e.jsx(c,{id:t.value,children:t.label},t.value))})]})]})}},d={args:{...n.args},render:()=>{const[r,o]=a.useState(new Set([s[2].value]));return e.jsxs(h,{direction:"column",gap:"2",align:"start",children:[e.jsxs(M,{children:["Selected: ",Array.from(r).join(", ")]}),e.jsxs(i,{isOpen:!0,children:[e.jsx(u,{"aria-label":"Menu",children:"Menu"}),e.jsxs(j,{children:[e.jsx(b,{children:"Edit"}),e.jsx(b,{children:"Duplicate"}),e.jsxs(v,{children:[e.jsx(b,{children:"Submenu"}),e.jsx(l,{selectedKeys:r,onSelectionChange:o,placement:"right top",children:s.map(t=>e.jsx(c,{id:t.value,children:t.label},t.value))})]})]})]})]})}},g={args:{...n.args},render:()=>{const[r,o]=a.useState([]);return a.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{o(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(i,{isOpen:!0,children:[e.jsx(u,{"aria-label":"Menu",children:"Menu"}),e.jsx(l,{items:r,placeholder:"Search Pokemon...",virtualized:!0,children:r.map((t,S)=>e.jsx(c,{id:t.name,children:t.name.charAt(0).toLocaleUpperCase("en-US")+t.name.slice(1)},S))})]})}},x={args:{...n.args},render:()=>{const[r,o]=a.useState([]);return a.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{o(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(i,{isOpen:!0,children:[e.jsx(u,{"aria-label":"Menu",children:"Menu"}),e.jsx(l,{items:r,placeholder:"Search Pokemon...",virtualized:!0,maxHeight:"300px",children:r.map((t,S)=>e.jsx(c,{id:t.name,children:t.name.charAt(0).toLocaleUpperCase("en-US")+t.name.slice(1)},S))})]})}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
}`,...x.parameters?.docs?.source}}};const ie=["Default","PreviewListbox","PreviewListboxMultiple","Submenu","Virtualized","VirtualizedMaxHeight"];export{n as Default,m as PreviewListbox,p as PreviewListboxMultiple,d as Submenu,g as Virtualized,x as VirtualizedMaxHeight,ie as __namedExportsOrder,ae as default};
