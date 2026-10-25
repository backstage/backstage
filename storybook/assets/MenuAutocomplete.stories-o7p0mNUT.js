import{j as e,r as d,p as g,M as x}from"./iframe-CMSX-Slv.js";import{a as i,e as a,M as r,b as j,S as I}from"./Menu-BkgF4e0R.js";import{B as b}from"./BUIProvider-rCuBO32v.js";import{B as s}from"./Button-B-qU7U03.js";import"./preload-helper-PPVm8Dsz.js";import"./Autocomplete-QSoLsmg6.js";import"./utils-lN068qtb.js";import"./useObjectRef-BtQagX3Q.js";import"./keyboard-DZQobsnO.js";import"./useFocusRing-DUZK2ZXK.js";import"./openLink-p0OhMCOD.js";import"./getMetaValue-DyXwXlFD.js";import"./useEvent-BikmhAJg.js";import"./useLabels-B9A8JaNL.js";import"./useLocalizedStringFormatter-DNWACNIN.js";import"./I18nProvider-B2rLmNuT.js";import"./useControlledState-DUMTY9Yj.js";import"./Button-C89HVwFt.js";import"./Label-QJ7mfr_v.js";import"./Hidden-kIQntXwy.js";import"./useLabel-BoN1kqrs.js";import"./number-gVXFFl9I.js";import"./useButton-C_sygl1c.js";import"./usePress-BzSNyydx.js";import"./textSelection-CwsB_5f_.js";import"./useHover-D7owYt-e.js";import"./useLoadMoreSentinel-CTkpujsH.js";import"./useCollection-C55LZDbY.js";import"./FocusScope-hnaFZs9t.js";import"./Input-Cw-knjtb.js";import"./ListBox-B_Wi1ZMb.js";import"./SelectionIndicator-B0WiXYe-.js";import"./Text-CcBkJcX0.js";import"./useListState-DfNyrXkH.js";import"./Dialog-Fw8yCkvG.js";import"./Heading-Dia6c8Ve.js";import"./useOverlayTriggerState-u57ke4k2.js";import"./VisuallyHidden-BP5VTP-I.js";import"./animation-rB_Nrf2Y.js";import"./SearchField-BXu4aPO1.js";import"./FieldError-BqVen_RV.js";import"./Form-Bo24afV9.js";import"./useFormValidation-CxDn_wUg.js";import"./useTextField-Drkqegd4.js";import"./useField-B0e6CrK8.js";import"./useFormReset-CIL9IUM3.js";import"./Virtualizer-C1udpvcD.js";import"./useFilter-BpAAqLEH.js";import"./index-DnnZFGoL.js";import"./getNodeText-COCAFKSu.js";import"./BUIRoutingProvider-CMtIo0Uo.js";import"./useResolvedHref-CvdgPikl.js";const u=g.meta({title:"Backstage UI/MenuAutocomplete",component:i,decorators:[t=>e.jsx(x,{children:e.jsx(b,{children:e.jsx(t,{})})})]}),f=[{label:"Apple",value:"apple"},{label:"Banana",value:"banana"},{label:"Blueberry",value:"blueberry"},{label:"Cherry",value:"cherry"},{label:"Durian",value:"durian"},{label:"Elderberry",value:"elderberry"},{label:"Fig",value:"fig"},{label:"Grape",value:"grape"},{label:"Honeydew",value:"honeydew"}],o=u.story({args:{children:null},render:()=>e.jsxs(i,{isOpen:!0,children:[e.jsx(s,{"aria-label":"Menu",children:"Menu"}),e.jsxs(a,{placeholder:"Filter",children:[e.jsx(r,{children:"Create new file..."}),e.jsx(r,{children:"Create new folder..."}),e.jsx(r,{children:"Assign to..."}),e.jsx(r,{children:"Assign to me"}),e.jsx(r,{children:"Change status..."}),e.jsx(r,{children:"Change priority..."}),e.jsx(r,{children:"Add label..."}),e.jsx(r,{children:"Remove label..."})]})]})}),m=u.story({args:{...o.input.args},render:()=>e.jsxs(i,{children:[e.jsx(s,{"aria-label":"Menu",children:"Menu"}),e.jsxs(a,{placeholder:"Filter",children:[e.jsx(r,{children:"Create new file..."}),e.jsx(r,{children:"Create new folder..."}),e.jsx(r,{children:"Assign to..."}),e.jsx(r,{children:"Assign to me"}),e.jsx(r,{children:"Change status..."}),e.jsx(r,{children:"Change priority..."}),e.jsx(r,{children:"Add label..."}),e.jsx(r,{children:"Remove label..."})]})]})}),p=u.story({args:{...o.input.args},render:()=>{const[t,h]=d.useState([]);return d.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(n=>n.json()).then(n=>{h(n.results)}).catch(n=>{console.error("Error fetching Pokemon:",n)})},[]),e.jsxs(i,{isOpen:!0,children:[e.jsx(s,{"aria-label":"Menu",children:"Menu"}),e.jsx(a,{items:t,placeholder:"Search Pokemon...",virtualized:!0,children:t.map((n,M)=>e.jsx(r,{id:n.name,children:n.name.charAt(0).toUpperCase()+n.name.slice(1)},M))})]})}}),l=u.story({args:{...o.input.args},render:()=>{const[t,h]=d.useState([]);return d.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(n=>n.json()).then(n=>{h(n.results)}).catch(n=>{console.error("Error fetching Pokemon:",n)})},[]),e.jsxs(i,{isOpen:!0,children:[e.jsx(s,{"aria-label":"Menu",children:"Menu"}),e.jsx(a,{items:t,placeholder:"Search Pokemon...",virtualized:!0,maxHeight:"300px",children:t.map((n,M)=>e.jsx(r,{id:n.name,children:n.name.charAt(0).toUpperCase()+n.name.slice(1)},M))})]})}}),c=u.story({args:{...o.input.args},render:()=>e.jsxs(i,{isOpen:!0,children:[e.jsx(s,{"aria-label":"Menu",children:"Menu"}),e.jsxs(j,{children:[e.jsx(r,{children:"Edit"}),e.jsx(r,{children:"Duplicate"}),e.jsxs(I,{children:[e.jsx(r,{children:"Submenu"}),e.jsx(a,{placement:"right top",children:f.map(t=>e.jsx(r,{id:t.value,children:t.label},t.value))})]})]})]})});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: null
  },
  render: () => <MenuTrigger isOpen>
      <Button aria-label="Menu">Menu</Button>
      <MenuAutocomplete placeholder="Filter">
        <MenuItem>Create new file...</MenuItem>
        <MenuItem>Create new folder...</MenuItem>
        <MenuItem>Assign to...</MenuItem>
        <MenuItem>Assign to me</MenuItem>
        <MenuItem>Change status...</MenuItem>
        <MenuItem>Change priority...</MenuItem>
        <MenuItem>Add label...</MenuItem>
        <MenuItem>Remove label...</MenuItem>
      </MenuAutocomplete>
    </MenuTrigger>
})`,...o.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: () => <MenuTrigger>
      <Button aria-label="Menu">Menu</Button>
      <MenuAutocomplete placeholder="Filter">
        <MenuItem>Create new file...</MenuItem>
        <MenuItem>Create new folder...</MenuItem>
        <MenuItem>Assign to...</MenuItem>
        <MenuItem>Assign to me</MenuItem>
        <MenuItem>Change status...</MenuItem>
        <MenuItem>Change priority...</MenuItem>
        <MenuItem>Add label...</MenuItem>
        <MenuItem>Remove label...</MenuItem>
      </MenuAutocomplete>
    </MenuTrigger>
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
        <MenuAutocomplete items={pokemon} placeholder="Search Pokemon..." virtualized>
          {pokemon.map((p, index) => <MenuItem key={index} id={p.name}>
              {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
            </MenuItem>)}
        </MenuAutocomplete>
      </MenuTrigger>;
  }
})`,...p.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
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
        <MenuAutocomplete items={pokemon} placeholder="Search Pokemon..." virtualized maxHeight="300px">
          {pokemon.map((p, index) => <MenuItem key={index} id={p.name}>
              {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
            </MenuItem>)}
        </MenuAutocomplete>
      </MenuTrigger>;
  }
})`,...l.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: () => <MenuTrigger isOpen>
      <Button aria-label="Menu">Menu</Button>
      <Menu>
        <MenuItem>Edit</MenuItem>
        <MenuItem>Duplicate</MenuItem>
        <SubmenuTrigger>
          <MenuItem>Submenu</MenuItem>
          <MenuAutocomplete placement="right top">
            {options.map(option => <MenuItem key={option.value} id={option.value}>
                {option.label}
              </MenuItem>)}
          </MenuAutocomplete>
        </SubmenuTrigger>
      </Menu>
    </MenuTrigger>
})`,...c.input.parameters?.docs?.source}}};const be=["Default","PreviewAutocompleteMenu","Virtualized","VirtualizedMaxHeight","Submenu"];export{o as Default,m as PreviewAutocompleteMenu,c as Submenu,p as Virtualized,l as VirtualizedMaxHeight,be as __namedExportsOrder};
