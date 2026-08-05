import{bR as e,ca as d,c7 as g,w as x}from"./iframe-B8uJzJnC.js";import{h as a,a as i,c as r,M as j,S as I}from"./Menu-CGbsF87i.js";import{B as b}from"./BUIProvider-B485Y6HT.js";import{B as s}from"./Button-CrMPC4H3.js";import"./preload-helper-PPVm8Dsz.js";import"./Autocomplete-nI_kARcr.js";import"./utils-C9WtHl0n.js";import"./useObjectRef-B58w8bQG.js";import"./keyboard-DuJAq24v.js";import"./useFocusRing-uHGre-No.js";import"./openLink-BUwh7SN8.js";import"./useEvent-Bv3yEJFZ.js";import"./useLabels-vvtSY4r8.js";import"./useLocalizedStringFormatter-Cmwn2jYC.js";import"./I18nProvider-BAFWouLl.js";import"./useControlledState-Bsv8jzCO.js";import"./Button-9hcql9Z1.js";import"./Label-B8rV63W8.js";import"./Hidden--CtbbQAG.js";import"./useLabel-DuQ-sB8F.js";import"./number-Cc-kUzHo.js";import"./useButton-B84fiS4B.js";import"./usePress-z5JJKJO5.js";import"./textSelection-COVkqnKL.js";import"./useHover-CGBJrmnR.js";import"./getItemCount-uMh6GABa.js";import"./useCollection-CvOYNyzq.js";import"./FocusScope-8F6SB8jw.js";import"./Input-fVCzcyQW.js";import"./ListBox-Bmbrmpsk.js";import"./Text-C2P1-Stb.js";import"./useListState-DwWpE2UK.js";import"./Dialog-CDtLVRGJ.js";import"./Heading-BXqzHZ6g.js";import"./useOverlayTriggerState-DCu5HTgY.js";import"./VisuallyHidden-BSSg_A1m.js";import"./animation-DAXhfvHs.js";import"./SearchField-D1T0c6Hb.js";import"./FieldError-TYXfNCFj.js";import"./useFormValidation-t3MKasab.js";import"./useTextField-C0zGORas.js";import"./useField-CUj6IoGp.js";import"./useFormReset-X4EXoTS3.js";import"./Virtualizer-BaLbtrxQ.js";import"./useFilter-XXN06l-U.js";import"./index-C3TndV9r.js";import"./getNodeText-5Q0dGTIm.js";import"./useResolvedHref-CVch4iPG.js";const u=g.meta({title:"Backstage UI/MenuAutocomplete",component:a,decorators:[t=>e.jsx(x,{children:e.jsx(b,{children:e.jsx(t,{})})})]}),f=[{label:"Apple",value:"apple"},{label:"Banana",value:"banana"},{label:"Blueberry",value:"blueberry"},{label:"Cherry",value:"cherry"},{label:"Durian",value:"durian"},{label:"Elderberry",value:"elderberry"},{label:"Fig",value:"fig"},{label:"Grape",value:"grape"},{label:"Honeydew",value:"honeydew"}],o=u.story({args:{children:null},render:()=>e.jsxs(a,{isOpen:!0,children:[e.jsx(s,{"aria-label":"Menu",children:"Menu"}),e.jsxs(i,{placeholder:"Filter",children:[e.jsx(r,{children:"Create new file..."}),e.jsx(r,{children:"Create new folder..."}),e.jsx(r,{children:"Assign to..."}),e.jsx(r,{children:"Assign to me"}),e.jsx(r,{children:"Change status..."}),e.jsx(r,{children:"Change priority..."}),e.jsx(r,{children:"Add label..."}),e.jsx(r,{children:"Remove label..."})]})]})}),m=u.story({args:{...o.input.args},render:()=>e.jsxs(a,{children:[e.jsx(s,{"aria-label":"Menu",children:"Menu"}),e.jsxs(i,{placeholder:"Filter",children:[e.jsx(r,{children:"Create new file..."}),e.jsx(r,{children:"Create new folder..."}),e.jsx(r,{children:"Assign to..."}),e.jsx(r,{children:"Assign to me"}),e.jsx(r,{children:"Change status..."}),e.jsx(r,{children:"Change priority..."}),e.jsx(r,{children:"Add label..."}),e.jsx(r,{children:"Remove label..."})]})]})}),l=u.story({args:{...o.input.args},render:()=>{const[t,h]=d.useState([]);return d.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(n=>n.json()).then(n=>{h(n.results)}).catch(n=>{console.error("Error fetching Pokemon:",n)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(s,{"aria-label":"Menu",children:"Menu"}),e.jsx(i,{items:t,placeholder:"Search Pokemon...",virtualized:!0,children:t.map((n,M)=>e.jsx(r,{id:n.name,children:n.name.charAt(0).toLocaleUpperCase("en-US")+n.name.slice(1)},M))})]})}}),p=u.story({args:{...o.input.args},render:()=>{const[t,h]=d.useState([]);return d.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(n=>n.json()).then(n=>{h(n.results)}).catch(n=>{console.error("Error fetching Pokemon:",n)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(s,{"aria-label":"Menu",children:"Menu"}),e.jsx(i,{items:t,placeholder:"Search Pokemon...",virtualized:!0,maxHeight:"300px",children:t.map((n,M)=>e.jsx(r,{id:n.name,children:n.name.charAt(0).toLocaleUpperCase("en-US")+n.name.slice(1)},M))})]})}}),c=u.story({args:{...o.input.args},render:()=>e.jsxs(a,{isOpen:!0,children:[e.jsx(s,{"aria-label":"Menu",children:"Menu"}),e.jsxs(j,{children:[e.jsx(r,{children:"Edit"}),e.jsx(r,{children:"Duplicate"}),e.jsxs(I,{children:[e.jsx(r,{children:"Submenu"}),e.jsx(i,{placement:"right top",children:f.map(t=>e.jsx(r,{id:t.value,children:t.label},t.value))})]})]})]})});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
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
