import{j as e,r as d,p as g,M as x}from"./iframe-BYYe_BET.js";import{a as i,e as a,M as r,b as j,S as I}from"./Menu-C2kjSQqD.js";import{B as b}from"./BUIProvider-By5rpXjK.js";import{B as s}from"./Button-DLV4nrO1.js";import"./preload-helper-PPVm8Dsz.js";import"./Autocomplete-DPgl-JtA.js";import"./utils-CJSyyO3-.js";import"./useObjectRef-9OXtpzcu.js";import"./keyboard-DfJpn7U5.js";import"./useFocusRing-BRx5O8Da.js";import"./openLink-BON_CNZm.js";import"./getMetaValue-Bn1etyTW.js";import"./useEvent-B1WEd5Ze.js";import"./useLabels-4i8ghj68.js";import"./useLocalizedStringFormatter-yKTdty33.js";import"./I18nProvider-rRNMaJeu.js";import"./useControlledState-DguQehpe.js";import"./Button-DEPxcD8C.js";import"./Label-Bs-x77sn.js";import"./Hidden-c60OiMP4.js";import"./useLabel-dcXziXhr.js";import"./number-CtW1NSkQ.js";import"./useButton-f7nJByYc.js";import"./usePress-CdThG8-6.js";import"./textSelection-D5BzNUOh.js";import"./useHover-DawSjhGk.js";import"./useLoadMoreSentinel-CNEYEidD.js";import"./useCollection-DqLEpLDM.js";import"./FocusScope-D48ubNpo.js";import"./Input-BCQuwCc2.js";import"./ListBox-D6VaTCxL.js";import"./SelectionIndicator-kuT3rs5m.js";import"./Text-DCKtGqqk.js";import"./useListState-BNvxBoXz.js";import"./Dialog-5N2H3Til.js";import"./Heading-BulpGcy4.js";import"./useOverlayTriggerState-B9znxEmb.js";import"./VisuallyHidden-DOvpC764.js";import"./animation-DtpQ2ZDK.js";import"./SearchField-DO5H9G35.js";import"./FieldError-lvCPLHt0.js";import"./Form-DuiANyPI.js";import"./useFormValidation-DJxngnhN.js";import"./useTextField-D_S0Erlu.js";import"./useField-CTlO1gOc.js";import"./useFormReset-CgEuTYmc.js";import"./Virtualizer-B586PFaq.js";import"./useFilter-CZi588_R.js";import"./index-COE7Jz9g.js";import"./getNodeText-Bdrh_1kq.js";import"./BUIRoutingProvider-DagVjI_D.js";import"./useResolvedHref-C1qAVxpR.js";const u=g.meta({title:"Backstage UI/MenuAutocomplete",component:i,decorators:[t=>e.jsx(x,{children:e.jsx(b,{children:e.jsx(t,{})})})]}),f=[{label:"Apple",value:"apple"},{label:"Banana",value:"banana"},{label:"Blueberry",value:"blueberry"},{label:"Cherry",value:"cherry"},{label:"Durian",value:"durian"},{label:"Elderberry",value:"elderberry"},{label:"Fig",value:"fig"},{label:"Grape",value:"grape"},{label:"Honeydew",value:"honeydew"}],o=u.story({args:{children:null},render:()=>e.jsxs(i,{isOpen:!0,children:[e.jsx(s,{"aria-label":"Menu",children:"Menu"}),e.jsxs(a,{placeholder:"Filter",children:[e.jsx(r,{children:"Create new file..."}),e.jsx(r,{children:"Create new folder..."}),e.jsx(r,{children:"Assign to..."}),e.jsx(r,{children:"Assign to me"}),e.jsx(r,{children:"Change status..."}),e.jsx(r,{children:"Change priority..."}),e.jsx(r,{children:"Add label..."}),e.jsx(r,{children:"Remove label..."})]})]})}),m=u.story({args:{...o.input.args},render:()=>e.jsxs(i,{children:[e.jsx(s,{"aria-label":"Menu",children:"Menu"}),e.jsxs(a,{placeholder:"Filter",children:[e.jsx(r,{children:"Create new file..."}),e.jsx(r,{children:"Create new folder..."}),e.jsx(r,{children:"Assign to..."}),e.jsx(r,{children:"Assign to me"}),e.jsx(r,{children:"Change status..."}),e.jsx(r,{children:"Change priority..."}),e.jsx(r,{children:"Add label..."}),e.jsx(r,{children:"Remove label..."})]})]})}),p=u.story({args:{...o.input.args},render:()=>{const[t,h]=d.useState([]);return d.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(n=>n.json()).then(n=>{h(n.results)}).catch(n=>{console.error("Error fetching Pokemon:",n)})},[]),e.jsxs(i,{isOpen:!0,children:[e.jsx(s,{"aria-label":"Menu",children:"Menu"}),e.jsx(a,{items:t,placeholder:"Search Pokemon...",virtualized:!0,children:t.map((n,M)=>e.jsx(r,{id:n.name,children:n.name.charAt(0).toUpperCase()+n.name.slice(1)},M))})]})}}),l=u.story({args:{...o.input.args},render:()=>{const[t,h]=d.useState([]);return d.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(n=>n.json()).then(n=>{h(n.results)}).catch(n=>{console.error("Error fetching Pokemon:",n)})},[]),e.jsxs(i,{isOpen:!0,children:[e.jsx(s,{"aria-label":"Menu",children:"Menu"}),e.jsx(a,{items:t,placeholder:"Search Pokemon...",virtualized:!0,maxHeight:"300px",children:t.map((n,M)=>e.jsx(r,{id:n.name,children:n.name.charAt(0).toUpperCase()+n.name.slice(1)},M))})]})}}),c=u.story({args:{...o.input.args},render:()=>e.jsxs(i,{isOpen:!0,children:[e.jsx(s,{"aria-label":"Menu",children:"Menu"}),e.jsxs(j,{children:[e.jsx(r,{children:"Edit"}),e.jsx(r,{children:"Duplicate"}),e.jsxs(I,{children:[e.jsx(r,{children:"Submenu"}),e.jsx(a,{placement:"right top",children:f.map(t=>e.jsx(r,{id:t.value,children:t.label},t.value))})]})]})]})});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
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
