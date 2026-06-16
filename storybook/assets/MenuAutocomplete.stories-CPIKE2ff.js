import{bR as e,ca as d,c7 as g,w as x}from"./iframe-A5q7KvPV.js";import{h as a,a as i,c as r,M as j,S as I}from"./Menu-CbFlGWHA.js";import{B as b}from"./BUIProvider-Dj-0esdq.js";import{B as s}from"./Button-GVmu3Z9r.js";import"./preload-helper-PPVm8Dsz.js";import"./Autocomplete-Ot2MDEsQ.js";import"./utils-Bd1To_cp.js";import"./useObjectRef-DI-R3VBW.js";import"./keyboard-owTSdexX.js";import"./useFocusRing-CPnrIyn1.js";import"./openLink-Cwj0uu6r.js";import"./useEvent-gKV9J6XA.js";import"./useLabels-CVaxSMYD.js";import"./useLocalizedStringFormatter-CJ3uu6qK.js";import"./I18nProvider-BQn_nrLl.js";import"./useControlledState-DL5QOA5t.js";import"./Button-XHM23BEd.js";import"./Label-DE0NX8eg.js";import"./Hidden-CskdN9Ng.js";import"./useLabel-Dsw_IjC-.js";import"./number-D5A5VP1m.js";import"./useButton-CnerOY6g.js";import"./usePress-eozoWKZn.js";import"./textSelection-DBqj4_Js.js";import"./useHover-BuQfyXDT.js";import"./getItemCount-DSkr3rUA.js";import"./useCollection-d4liYNuA.js";import"./FocusScope-DQc1fB9P.js";import"./Input-Dx-TcgvS.js";import"./ListBox-LHcXGeE0.js";import"./Text-S0QT30oh.js";import"./useListState-C1r74yqQ.js";import"./Dialog-CZGKeKw-.js";import"./Heading-RIf1nfLa.js";import"./useOverlayTriggerState-RZwt8MjL.js";import"./VisuallyHidden-CrRt6UY6.js";import"./animation-Dikt5ULv.js";import"./SearchField-C078_e1N.js";import"./FieldError-CarArOa-.js";import"./useFormValidation-DEJ9EEyE.js";import"./useTextField-CBLcHat9.js";import"./useField-CE3-IKhf.js";import"./useFormReset-YQ3CTLA4.js";import"./Virtualizer-tp4bwYfx.js";import"./useFilter-ibFzBqBC.js";import"./index-CmJXbCwW.js";import"./getNodeText-B1prwWJV.js";import"./useResolvedHref-mXGtO_J8.js";const u=g.meta({title:"Backstage UI/MenuAutocomplete",component:a,decorators:[t=>e.jsx(x,{children:e.jsx(b,{children:e.jsx(t,{})})})]}),f=[{label:"Apple",value:"apple"},{label:"Banana",value:"banana"},{label:"Blueberry",value:"blueberry"},{label:"Cherry",value:"cherry"},{label:"Durian",value:"durian"},{label:"Elderberry",value:"elderberry"},{label:"Fig",value:"fig"},{label:"Grape",value:"grape"},{label:"Honeydew",value:"honeydew"}],o=u.story({args:{children:null},render:()=>e.jsxs(a,{isOpen:!0,children:[e.jsx(s,{"aria-label":"Menu",children:"Menu"}),e.jsxs(i,{placeholder:"Filter",children:[e.jsx(r,{children:"Create new file..."}),e.jsx(r,{children:"Create new folder..."}),e.jsx(r,{children:"Assign to..."}),e.jsx(r,{children:"Assign to me"}),e.jsx(r,{children:"Change status..."}),e.jsx(r,{children:"Change priority..."}),e.jsx(r,{children:"Add label..."}),e.jsx(r,{children:"Remove label..."})]})]})}),m=u.story({args:{...o.input.args},render:()=>e.jsxs(a,{children:[e.jsx(s,{"aria-label":"Menu",children:"Menu"}),e.jsxs(i,{placeholder:"Filter",children:[e.jsx(r,{children:"Create new file..."}),e.jsx(r,{children:"Create new folder..."}),e.jsx(r,{children:"Assign to..."}),e.jsx(r,{children:"Assign to me"}),e.jsx(r,{children:"Change status..."}),e.jsx(r,{children:"Change priority..."}),e.jsx(r,{children:"Add label..."}),e.jsx(r,{children:"Remove label..."})]})]})}),l=u.story({args:{...o.input.args},render:()=>{const[t,h]=d.useState([]);return d.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(n=>n.json()).then(n=>{h(n.results)}).catch(n=>{console.error("Error fetching Pokemon:",n)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(s,{"aria-label":"Menu",children:"Menu"}),e.jsx(i,{items:t,placeholder:"Search Pokemon...",virtualized:!0,children:t.map((n,M)=>e.jsx(r,{id:n.name,children:n.name.charAt(0).toLocaleUpperCase("en-US")+n.name.slice(1)},M))})]})}}),p=u.story({args:{...o.input.args},render:()=>{const[t,h]=d.useState([]);return d.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(n=>n.json()).then(n=>{h(n.results)}).catch(n=>{console.error("Error fetching Pokemon:",n)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(s,{"aria-label":"Menu",children:"Menu"}),e.jsx(i,{items:t,placeholder:"Search Pokemon...",virtualized:!0,maxHeight:"300px",children:t.map((n,M)=>e.jsx(r,{id:n.name,children:n.name.charAt(0).toLocaleUpperCase("en-US")+n.name.slice(1)},M))})]})}}),c=u.story({args:{...o.input.args},render:()=>e.jsxs(a,{isOpen:!0,children:[e.jsx(s,{"aria-label":"Menu",children:"Menu"}),e.jsxs(j,{children:[e.jsx(r,{children:"Edit"}),e.jsx(r,{children:"Duplicate"}),e.jsxs(I,{children:[e.jsx(r,{children:"Submenu"}),e.jsx(i,{placement:"right top",children:f.map(t=>e.jsx(r,{id:t.value,children:t.label},t.value))})]})]})]})});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...m.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
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
              {p.name.charAt(0).toLocaleUpperCase('en-US') + p.name.slice(1)}
            </MenuItem>)}
        </MenuAutocomplete>
      </MenuTrigger>;
  }
})`,...l.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
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
              {p.name.charAt(0).toLocaleUpperCase('en-US') + p.name.slice(1)}
            </MenuItem>)}
        </MenuAutocomplete>
      </MenuTrigger>;
  }
})`,...p.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...c.input.parameters?.docs?.source}}};const ge=["Default","PreviewAutocompleteMenu","Virtualized","VirtualizedMaxHeight","Submenu"];export{o as Default,m as PreviewAutocompleteMenu,c as Submenu,l as Virtualized,p as VirtualizedMaxHeight,ge as __namedExportsOrder};
