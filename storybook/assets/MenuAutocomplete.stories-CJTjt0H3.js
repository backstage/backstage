import{p as h,j as e,r as M}from"./iframe-B5eUq3Se.js";import{M as m,e as p,b as n,a as I,S as x}from"./Menu-xRJadu6c.js";import{M as b}from"./index-Cz1Ci6GP.js";import{B as l}from"./Button-BYN5maDP.js";import"./preload-helper-PPVm8Dsz.js";import"./Autocomplete-B40gOv4y.js";import"./Separator-CLN0tOj9.js";import"./SelectionManager-BStmZ_8N.js";import"./useFocusable-B1Zrypyp.js";import"./useObjectRef-CH2wfUkV.js";import"./clsx-B-dksMZM.js";import"./useEvent-BJx1ljgf.js";import"./SelectionIndicator-BbD8z6of.js";import"./context-DE73IaZD.js";import"./usePress-oaHysT2Y.js";import"./Hidden-YqmwH8Ck.js";import"./useControlledState-B-3NIUMU.js";import"./utils-D-zya2iC.js";import"./RSPContexts-Crb4K2wk.js";import"./useLabels-Bni-AqQK.js";import"./useLocalizedStringFormatter-BA0kgncM.js";import"./Button-Br4MRPAF.js";import"./Label-8ckUWZ4b.js";import"./useLabel-BeE5xCm1.js";import"./useButton-Bp0KGOkr.js";import"./useFocusRing-BwgTf1EI.js";import"./Input-DffBXyyn.js";import"./useFormReset-DzONGEtP.js";import"./useField-3I4Jns_6.js";import"./Form-CgkvCBNc.js";import"./ListBox-BS9Q3D5-.js";import"./Text-CmLYSt_a.js";import"./useListState-3RRYWmnM.js";import"./Dialog-aJazKGgG.js";import"./OverlayArrow-CtY62SAN.js";import"./animation-JN4M0u_f.js";import"./VisuallyHidden-Bjpd_nl4.js";import"./SearchField-l71I6NWb.js";import"./FieldError-B3isgOqO.js";import"./useStyles-CRlsW8dG.js";import"./index-kXp0wd56.js";import"./InternalLinkProvider-4vCYfpZG.js";import"./defineComponent-CBBRBVBO.js";import"./useBg-Bc6Co4CK.js";const c=h.meta({title:"Backstage UI/MenuAutocomplete",component:m,decorators:[o=>e.jsx(b,{children:e.jsx(o,{})})]}),k=[{label:"Apple",value:"apple"},{label:"Banana",value:"banana"},{label:"Blueberry",value:"blueberry"},{label:"Cherry",value:"cherry"},{label:"Durian",value:"durian"},{label:"Elderberry",value:"elderberry"},{label:"Fig",value:"fig"},{label:"Grape",value:"grape"},{label:"Honeydew",value:"honeydew"}],r=c.story({args:{children:null},render:()=>e.jsxs(m,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsxs(p,{placeholder:"Filter",children:[e.jsx(n,{children:"Create new file..."}),e.jsx(n,{children:"Create new folder..."}),e.jsx(n,{children:"Assign to..."}),e.jsx(n,{children:"Assign to me"}),e.jsx(n,{children:"Change status..."}),e.jsx(n,{children:"Change priority..."}),e.jsx(n,{children:"Add label..."}),e.jsx(n,{children:"Remove label..."})]})]})}),u=c.story({args:{...r.input.args},render:()=>e.jsxs(m,{children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsxs(p,{placeholder:"Filter",children:[e.jsx(n,{children:"Create new file..."}),e.jsx(n,{children:"Create new folder..."}),e.jsx(n,{children:"Assign to..."}),e.jsx(n,{children:"Assign to me"}),e.jsx(n,{children:"Change status..."}),e.jsx(n,{children:"Change priority..."}),e.jsx(n,{children:"Add label..."}),e.jsx(n,{children:"Remove label..."})]})]})}),a=c.story({args:{...r.input.args},render:()=>{const[o,d]=M.useState([]);return M.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{d(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(m,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsx(p,{items:o,placeholder:"Search Pokemon...",virtualized:!0,children:o.map((t,g)=>e.jsx(n,{id:t.name,children:t.name.charAt(0).toLocaleUpperCase("en-US")+t.name.slice(1)},g))})]})}}),i=c.story({args:{...r.input.args},render:()=>{const[o,d]=M.useState([]);return M.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{d(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(m,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsx(p,{items:o,placeholder:"Search Pokemon...",virtualized:!0,maxHeight:"300px",children:o.map((t,g)=>e.jsx(n,{id:t.name,children:t.name.charAt(0).toLocaleUpperCase("en-US")+t.name.slice(1)},g))})]})}}),s=c.story({args:{...r.input.args},render:()=>e.jsxs(m,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsxs(I,{children:[e.jsx(n,{children:"Edit"}),e.jsx(n,{children:"Duplicate"}),e.jsxs(x,{children:[e.jsx(n,{children:"Submenu"}),e.jsx(p,{placement:"right top",children:k.map(o=>e.jsx(n,{id:o.value,children:o.label},o.value))})]})]})]})});r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{code:`const Default = () => (
  <MenuTrigger isOpen>
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
);
`,...r.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{code:`const PreviewAutocompleteMenu = () => (
  <MenuTrigger>
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
);
`,...u.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{code:`const Virtualized = () => {
  const [pokemon, setPokemon] = useState<Array<{ name: string; url: string }>>(
    []
  );

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1000")
      .then((response) => response.json())
      .then((data) => {
        setPokemon(data.results);
      })
      .catch((error) => {
        console.error("Error fetching Pokemon:", error);
      });
  }, []);

  return (
    <MenuTrigger isOpen>
      <Button aria-label="Menu">Menu</Button>
      <MenuAutocomplete
        items={pokemon}
        placeholder="Search Pokemon..."
        virtualized
      >
        {pokemon.map((p, index) => (
          <MenuItem key={index} id={p.name}>
            {p.name.charAt(0).toLocaleUpperCase("en-US") + p.name.slice(1)}
          </MenuItem>
        ))}
      </MenuAutocomplete>
    </MenuTrigger>
  );
};
`,...a.input.parameters?.docs?.source}}};i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{code:`const VirtualizedMaxHeight = () => {
  const [pokemon, setPokemon] = useState<Array<{ name: string; url: string }>>(
    []
  );

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1000")
      .then((response) => response.json())
      .then((data) => {
        setPokemon(data.results);
      })
      .catch((error) => {
        console.error("Error fetching Pokemon:", error);
      });
  }, []);

  return (
    <MenuTrigger isOpen>
      <Button aria-label="Menu">Menu</Button>
      <MenuAutocomplete
        items={pokemon}
        placeholder="Search Pokemon..."
        virtualized
        maxHeight="300px"
      >
        {pokemon.map((p, index) => (
          <MenuItem key={index} id={p.name}>
            {p.name.charAt(0).toLocaleUpperCase("en-US") + p.name.slice(1)}
          </MenuItem>
        ))}
      </MenuAutocomplete>
    </MenuTrigger>
  );
};
`,...i.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{code:`const Submenu = () => (
  <MenuTrigger isOpen>
    <Button aria-label="Menu">Menu</Button>
    <Menu>
      <MenuItem>Edit</MenuItem>
      <MenuItem>Duplicate</MenuItem>
      <SubmenuTrigger>
        <MenuItem>Submenu</MenuItem>
        <MenuAutocomplete placement="right top">
          {options.map((option) => (
            <MenuItem key={option.value} id={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </MenuAutocomplete>
      </SubmenuTrigger>
    </Menu>
  </MenuTrigger>
);
`,...s.input.parameters?.docs?.source}}};r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...r.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...u.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...a.input.parameters?.docs?.source}}};i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...i.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...s.input.parameters?.docs?.source}}};const le=["Default","PreviewAutocompleteMenu","Virtualized","VirtualizedMaxHeight","Submenu"];export{r as Default,u as PreviewAutocompleteMenu,s as Submenu,a as Virtualized,i as VirtualizedMaxHeight,le as __namedExportsOrder};
