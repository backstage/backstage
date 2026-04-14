import{j as e,r as d,p as g,M as x}from"./iframe-KINrIo_f.js";import{M as a,e as i,b as r,a as j,S as I}from"./Menu-s08ry3Au.js";import{B as b}from"./BUIProvider-Ciu3w9NY.js";import{B as s}from"./Button-DJZRNjgN.js";import"./preload-helper-PPVm8Dsz.js";import"./Autocomplete-B_tF8JCw.js";import"./RSPContexts-BB815QrL.js";import"./utils-Dp48jrsX.js";import"./useObjectRef-Cl-GJEjw.js";import"./useFocusable-CaaSd55t.js";import"./openLink-BCV1Ju3v.js";import"./useLabels-mheEzMbZ.js";import"./useEvent-BOGlR7Jp.js";import"./SelectionManager-D9gyKx5v.js";import"./SelectionIndicator-BhnE4v6J.js";import"./context-B896Pv5S.js";import"./usePress-BRBPsLh-.js";import"./textSelection-1F9aHMh8.js";import"./Hidden-CKUXjs7V.js";import"./useControlledState-CmWPFpjF.js";import"./useLocalizedStringFormatter-Xx4C-qoc.js";import"./Button-B_WSb347.js";import"./Label-CJonN38k.js";import"./useNumberFormatter-BRRCv1PA.js";import"./useLabel-CtWiwLqZ.js";import"./useButton-DEkJAlCo.js";import"./useFocusRing-BZvEHQX6.js";import"./Separator-BNO8xXB0.js";import"./Input-DLCtCgi7.js";import"./useFormReset-CiyO9xzi.js";import"./useField-CQ_siFYl.js";import"./Form-Dteeinzj.js";import"./ListBox-Bzb_vCdk.js";import"./Text-BocnvHcP.js";import"./useListState-CvYuqVi3.js";import"./Dialog-Dw8Bysji.js";import"./OverlayArrow-C_Z2pH72.js";import"./animation-cEYBDaw2.js";import"./VisuallyHidden-B0kkQ8nV.js";import"./SearchField-Wca4BMVc.js";import"./FieldError-CHy2zJ6h.js";import"./Virtualizer-B-t3D24O.js";import"./index-Dv1l67z5.js";import"./linkUtils-tKDL5Jm1.js";import"./getNodeText-MPmDkoxK.js";import"./useFilter-6VG5hCfA.js";const u=g.meta({title:"Backstage UI/MenuAutocomplete",component:a,decorators:[t=>e.jsx(x,{children:e.jsx(b,{children:e.jsx(t,{})})})]}),f=[{label:"Apple",value:"apple"},{label:"Banana",value:"banana"},{label:"Blueberry",value:"blueberry"},{label:"Cherry",value:"cherry"},{label:"Durian",value:"durian"},{label:"Elderberry",value:"elderberry"},{label:"Fig",value:"fig"},{label:"Grape",value:"grape"},{label:"Honeydew",value:"honeydew"}],o=u.story({args:{children:null},render:()=>e.jsxs(a,{isOpen:!0,children:[e.jsx(s,{"aria-label":"Menu",children:"Menu"}),e.jsxs(i,{placeholder:"Filter",children:[e.jsx(r,{children:"Create new file..."}),e.jsx(r,{children:"Create new folder..."}),e.jsx(r,{children:"Assign to..."}),e.jsx(r,{children:"Assign to me"}),e.jsx(r,{children:"Change status..."}),e.jsx(r,{children:"Change priority..."}),e.jsx(r,{children:"Add label..."}),e.jsx(r,{children:"Remove label..."})]})]})}),m=u.story({args:{...o.input.args},render:()=>e.jsxs(a,{children:[e.jsx(s,{"aria-label":"Menu",children:"Menu"}),e.jsxs(i,{placeholder:"Filter",children:[e.jsx(r,{children:"Create new file..."}),e.jsx(r,{children:"Create new folder..."}),e.jsx(r,{children:"Assign to..."}),e.jsx(r,{children:"Assign to me"}),e.jsx(r,{children:"Change status..."}),e.jsx(r,{children:"Change priority..."}),e.jsx(r,{children:"Add label..."}),e.jsx(r,{children:"Remove label..."})]})]})}),l=u.story({args:{...o.input.args},render:()=>{const[t,h]=d.useState([]);return d.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(n=>n.json()).then(n=>{h(n.results)}).catch(n=>{console.error("Error fetching Pokemon:",n)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(s,{"aria-label":"Menu",children:"Menu"}),e.jsx(i,{items:t,placeholder:"Search Pokemon...",virtualized:!0,children:t.map((n,M)=>e.jsx(r,{id:n.name,children:n.name.charAt(0).toLocaleUpperCase("en-US")+n.name.slice(1)},M))})]})}}),p=u.story({args:{...o.input.args},render:()=>{const[t,h]=d.useState([]);return d.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(n=>n.json()).then(n=>{h(n.results)}).catch(n=>{console.error("Error fetching Pokemon:",n)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(s,{"aria-label":"Menu",children:"Menu"}),e.jsx(i,{items:t,placeholder:"Search Pokemon...",virtualized:!0,maxHeight:"300px",children:t.map((n,M)=>e.jsx(r,{id:n.name,children:n.name.charAt(0).toLocaleUpperCase("en-US")+n.name.slice(1)},M))})]})}}),c=u.story({args:{...o.input.args},render:()=>e.jsxs(a,{isOpen:!0,children:[e.jsx(s,{"aria-label":"Menu",children:"Menu"}),e.jsxs(j,{children:[e.jsx(r,{children:"Edit"}),e.jsx(r,{children:"Duplicate"}),e.jsxs(I,{children:[e.jsx(r,{children:"Submenu"}),e.jsx(i,{placement:"right top",children:f.map(t=>e.jsx(r,{id:t.value,children:t.label},t.value))})]})]})]})});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...c.input.parameters?.docs?.source}}};const he=["Default","PreviewAutocompleteMenu","Virtualized","VirtualizedMaxHeight","Submenu"];export{o as Default,m as PreviewAutocompleteMenu,c as Submenu,l as Virtualized,p as VirtualizedMaxHeight,he as __namedExportsOrder};
